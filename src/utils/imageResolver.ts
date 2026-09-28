import burgerImgUrl from '../assets/images/hero_double_burger_1790594987171.jpg';
import rollImgUrl from '../assets/images/hero_chicken_roll_1790595003281.jpg';
import pizzaImgUrl from '../assets/images/hero_pizza_slice_1790595016981.jpg';
import zingerBurgerImgUrl from '../assets/images/menu_zinger_burger_1790597405110.jpg';
import paneerBurgerImgUrl from '../assets/images/menu_paneer_burger_1790597428962.jpg';
import tikkaPizzaImgUrl from '../assets/images/menu_tikka_pizza_1790597441614.jpg';
import shawarmaRollImgUrl from '../assets/images/menu_shawarma_roll_1790597456326.jpg';
import mojitoDrinkImgUrl from '../assets/images/menu_mojito_drink_1790599015098.jpg';
import chocoShakeImgUrl from '../assets/images/menu_chocolate_shake_1790599027284.jpg';
import orangeJuiceImgUrl from '../assets/images/menu_orange_juice_1790599038865.jpg';
import strawberryShakeImgUrl from '../assets/images/menu_strawberry_shake_1790599054960.jpg';
import lettuceImgUrl from '../assets/images/floating_lettuce_leaf_1790595028642.jpg';

export const ALL_IMAGE_ASSETS = {
  burger: burgerImgUrl,
  roll: rollImgUrl,
  pizza: pizzaImgUrl,
  zingerBurger: zingerBurgerImgUrl,
  paneerBurger: paneerBurgerImgUrl,
  tikkaPizza: tikkaPizzaImgUrl,
  shawarmaRoll: shawarmaRollImgUrl,
  mojitoDrink: mojitoDrinkImgUrl,
  chocoShake: chocoShakeImgUrl,
  orangeJuice: orangeJuiceImgUrl,
  strawberryShake: strawberryShakeImgUrl,
  lettuce: lettuceImgUrl,
};

/**
 * Resolves any image URL, legacy path, filename, preset ID, or raw database string
 * to a 100% reliable Vite-bundled production asset URL that loads flawlessly on Vercel.
 */
export function resolveFoodImageUrl(
  rawUrl: string | null | undefined,
  fallback: string = burgerImgUrl
): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return fallback;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return fallback;
  }

  // Base64 data URLs or Blob URLs from admin custom uploads are returned as-is
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  // 1. Check for specific filename keywords (covers /src/assets/images/..., /assets/images/..., http.../filename, etc.)
  if (lower.includes('floating_lettuce_leaf')) return lettuceImgUrl;
  if (lower.includes('hero_double_burger')) return burgerImgUrl;
  if (lower.includes('hero_chicken_roll')) return rollImgUrl;
  if (lower.includes('hero_pizza_slice')) return pizzaImgUrl;
  if (lower.includes('menu_zinger_burger')) return zingerBurgerImgUrl;
  if (lower.includes('menu_paneer_burger')) return paneerBurgerImgUrl;
  if (lower.includes('menu_tikka_pizza')) return tikkaPizzaImgUrl;
  if (lower.includes('menu_shawarma_roll')) return shawarmaRollImgUrl;
  if (lower.includes('menu_mojito_drink')) return mojitoDrinkImgUrl;
  if (lower.includes('menu_chocolate_shake')) return chocoShakeImgUrl;
  if (lower.includes('menu_orange_juice')) return orangeJuiceImgUrl;
  if (lower.includes('menu_strawberry_shake')) return strawberryShakeImgUrl;

  // 2. Check for preset IDs from Admin Image Picker
  if (lower === 'burger-double' || lower === 'burger') return burgerImgUrl;
  if (lower === 'burger-zinger' || lower === 'zinger') return zingerBurgerImgUrl;
  if (lower === 'burger-paneer' || lower === 'paneer') return paneerBurgerImgUrl;
  if (lower === 'pizza-margherita' || lower === 'margherita' || lower === 'pepperoni' || lower === 'pizza') return pizzaImgUrl;
  if (lower === 'pizza-tikka' || lower === 'tikka') return tikkaPizzaImgUrl;
  if (lower === 'roll-shawarma' || lower === 'shawarma') return shawarmaRollImgUrl;
  if (lower === 'roll-kathi' || lower === 'roll' || lower === 'kathi' || lower === 'wrap') return rollImgUrl;
  if (lower === 'drink-mojito' || lower === 'mojito' || lower === 'lime-soda') return mojitoDrinkImgUrl;
  if (lower === 'drink-choco' || lower === 'choco' || lower === 'cold-coffee') return chocoShakeImgUrl;
  if (lower === 'drink-strawberry' || lower === 'strawberry') return strawberryShakeImgUrl;
  if (lower === 'drink-orange' || lower === 'orange') return orangeJuiceImgUrl;

  // 3. Category fallbacks
  if (lower === 'burgers') return burgerImgUrl;
  if (lower === 'pizza') return tikkaPizzaImgUrl;
  if (lower === 'rolls') return shawarmaRollImgUrl;
  if (lower === 'drinks') return mojitoDrinkImgUrl;

  // 4. If it is an external http/https URL, return it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 5. If it starts with /assets/ or / (Vite bundle), return it
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return fallback;
}
