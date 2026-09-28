import React, { useEffect, useState } from 'react';

interface TransparentFoodImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Optional brightness/contrast filter enhancement */
  enhance?: boolean;
}

// Module-level cache so each image is processed only once per session
const processedImageCache = new Map<string, string>();
const pendingPromises = new Map<string, Promise<string>>();

/**
 * Removes a studio white/light-neutral backdrop from food photography using
 * a border-seeded Breadth-First Search (BFS) flood-fill algorithm with
 * chroma protection, 2px edge feathering, color decontamination, and auto-trimming.
 */
function removeWhiteStudioBackground(img: HTMLImageElement): string {
  const maxDim = 680;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || 680, img.naturalHeight || 680));
  const w = Math.max(1, Math.round((img.naturalWidth || 600) * scale));
  const h = Math.max(1, Math.round((img.naturalHeight || 600) * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample corners to determine studio background RGB
  const cornerCoords = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ];

  let bgR = 252;
  let bgG = 252;
  let bgB = 252;
  let sampleCount = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  for (const [cx, cy] of cornerCoords) {
    const idx = (cy * w + cx) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 190) {
      sumR += r;
      sumG += g;
      sumB += b;
      sampleCount++;
    }
  }

  if (sampleCount > 0) {
    bgR = sumR / sampleCount;
    bgG = sumG / sampleCount;
    bgB = sumB / sampleCount;
  }

  const totalPixels = w * h;
  // 0 = unvisited, 1 = exterior background, 2 = foreground boundary stop
  const mask = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const isBackgroundCandidate = (pixelIndex: number): boolean => {
    const i = pixelIndex * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const chroma = maxC - minC;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    const dr = r - bgR;
    const dg = g - bgG;
    const db = b - bgB;
    const distBg = Math.sqrt(dr * dr + dg * dg + db * db);

    if (lum > 242 && chroma < 30) return true;
    if (distBg < 38 && chroma < 24 && lum > 205) return true;
    if (lum > 195 && chroma < 12 && distBg < 62) return true;

    return false;
  };

  // Seed BFS queue along all 4 borders
  for (let x = 0; x < w; x++) {
    const topIdx = x;
    const botIdx = (h - 1) * w + x;
    if (isBackgroundCandidate(topIdx)) {
      mask[topIdx] = 1;
      queue[tail++] = topIdx;
    }
    if (isBackgroundCandidate(botIdx) && mask[botIdx] === 0) {
      mask[botIdx] = 1;
      queue[tail++] = botIdx;
    }
  }

  for (let y = 1; y < h - 1; y++) {
    const leftIdx = y * w;
    const rightIdx = y * w + (w - 1);
    if (isBackgroundCandidate(leftIdx) && mask[leftIdx] === 0) {
      mask[leftIdx] = 1;
      queue[tail++] = leftIdx;
    }
    if (isBackgroundCandidate(rightIdx) && mask[rightIdx] === 0) {
      mask[rightIdx] = 1;
      queue[tail++] = rightIdx;
    }
  }

  // Flood fill inward from borders
  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = (curr - cx) / w;

    if (cx > 0) {
      const n = curr - 1;
      if (mask[n] === 0) {
        if (isBackgroundCandidate(n)) {
          mask[n] = 1;
          queue[tail++] = n;
        } else {
          mask[n] = 2;
        }
      }
    }
    if (cx < w - 1) {
      const n = curr + 1;
      if (mask[n] === 0) {
        if (isBackgroundCandidate(n)) {
          mask[n] = 1;
          queue[tail++] = n;
        } else {
          mask[n] = 2;
        }
      }
    }
    if (cy > 0) {
      const n = curr - w;
      if (mask[n] === 0) {
        if (isBackgroundCandidate(n)) {
          mask[n] = 1;
          queue[tail++] = n;
        } else {
          mask[n] = 2;
        }
      }
    }
    if (cy < h - 1) {
      const n = curr + w;
      if (mask[n] === 0) {
        if (isBackgroundCandidate(n)) {
          mask[n] = 1;
          queue[tail++] = n;
        } else {
          mask[n] = 2;
        }
      }
    }
  }

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p = idx * 4;

      if (mask[idx] === 1) {
        data[p + 3] = 0;
        continue;
      }

      let bgNeighbors = 0;
      let totalNeighbors = 0;
      for (let dy = -2; dy <= 2; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          totalNeighbors++;
          if (mask[ny * w + nx] === 1) {
            bgNeighbors++;
          }
        }
      }

      if (bgNeighbors > 0) {
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const ratio = 1 - bgNeighbors / totalNeighbors;

        const lumPenalty = lum > 225 ? Math.max(0, (255 - lum) / 30) : 1;
        const alpha = Math.round(255 * Math.pow(ratio, 0.85) * lumPenalty);
        data[p + 3] = alpha;

        if (alpha > 15 && alpha < 240 && lum > 200) {
          data[p] = Math.max(0, Math.round(r * 0.92));
          data[p + 1] = Math.max(0, Math.round(g * 0.92));
          data[p + 2] = Math.max(0, Math.round(b * 0.9));
        }
      }

      if (data[p + 3] > 25) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (maxX > minX && maxY > minY) {
    const contentW = maxX - minX + 1;
    const contentH = maxY - minY + 1;
    const padX = Math.round(contentW * 0.04);
    const padY = Math.round(contentH * 0.04);

    const cropX = Math.max(0, minX - padX);
    const cropY = Math.max(0, minY - padY);
    const cropW = Math.min(w - cropX, contentW + padX * 2);
    const cropH = Math.min(h - cropY, contentH + padY * 2);

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = cropW;
    trimmedCanvas.height = cropH;
    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (trimmedCtx) {
      trimmedCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      return trimmedCanvas.toDataURL('image/png');
    }
  }

  return canvas.toDataURL('image/png');
}

function processImageAsync(src: string): Promise<string> {
  if (processedImageCache.has(src)) {
    return Promise.resolve(processedImageCache.get(src)!);
  }
  if (pendingPromises.has(src)) {
    return pendingPromises.get(src)!;
  }

  const promise = new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      try {
        const resultDataUrl = removeWhiteStudioBackground(img);
        processedImageCache.set(src, resultDataUrl);
        pendingPromises.delete(src);
        resolve(resultDataUrl);
      } catch {
        processedImageCache.set(src, src);
        pendingPromises.delete(src);
        resolve(src);
      }
    };
    img.onerror = (err) => {
      pendingPromises.delete(src);
      reject(err);
    };
    img.src = src;
  });

  pendingPromises.set(src, promise);
  return promise;
}

/**
 * Preloads and processes an array of studio food image URLs so that
 * burger and floating ingredient animations start simultaneously without decoding lag.
 */
export function preloadTransparentFoodImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  urls.forEach((url) => {
    if (!processedImageCache.has(url)) {
      processImageAsync(url).catch(() => {});
    }
  });
}

export const TransparentFoodImage: React.FC<TransparentFoodImageProps> = React.memo(({
  src,
  alt,
  className = '',
  style,
  enhance = true,
}) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(() => {
    return processedImageCache.get(src) || null;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (processedImageCache.has(src)) {
      setProcessedSrc(processedImageCache.get(src)!);
      return;
    }

    let isMounted = true;
    processImageAsync(src)
      .then((dataUrl) => {
        if (isMounted) setProcessedSrc(dataUrl);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <span className="text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-2">
          {alt}
        </span>
      </div>
    );
  }

  // Render immediately using raw src while cutout finishes if not yet cached, preventing any delayed pop-in
  const displaySrc = processedSrc || src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      referrerPolicy="no-referrer"
      draggable={false}
      className={`select-none pointer-events-none transition-opacity duration-150 ${
        processedSrc ? 'opacity-100' : 'opacity-90'
      } ${className}`}
      style={{
        willChange: 'transform',
        filter: enhance
          ? 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.30)) contrast(1.04) saturate(1.08)'
          : undefined,
        ...style,
      }}
    />
  );
});
