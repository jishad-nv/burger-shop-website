import burgerImgUrl from '../assets/images/hero_double_burger_1790594987171.jpg';
import rollImgUrl from '../assets/images/hero_chicken_roll_1790595003281.jpg';
import pizzaImgUrl from '../assets/images/hero_pizza_slice_1790595016981.jpg';
import { SlideId } from '../components/FloatingIngredients';
import { preloadTransparentFoodImages } from '../components/TransparentFoodImage';

// Preload all hero food images immediately so transitions are 100% simultaneous
preloadTransparentFoodImages([burgerImgUrl, rollImgUrl, pizzaImgUrl]);

export interface HeroSlide {
  id: SlideId;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  calories: string;
  prepTime: string;
  image: string;
  /** Radial background gradient matching the category color transition system */
  bgGradient: string;
  /** Ambient center glow color */
  glowColor: string;
  /** Button / badge accent color */
  accentColor: string;
  /** Letter spacing class for the giant background word */
  titleTracking: string;
  /** Base rotation and scale for the main food image */
  dishRotation: number;
  dishScale: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'burger',
    title: 'BURGER',
    subtitle: 'Double Smoked Cheddar & Crisp Lettuce',
    description:
      "Vegans aren't just a healthier option for animal welfare, conscious or holistic lifestyle is also a great way to learn how to live your own self-reliant and explore.",
    price: 199,
    calories: '680 kcal',
    prepTime: '12 min',
    image: burgerImgUrl,
    // BURGER CATEGORY: Warm orange, golden yellow, and subtle red accents
    bgGradient:
      'radial-gradient(circle at 50% 48%, #FFE699 0%, #F5A623 36%, #E57C19 72%, #D64515 100%)',
    glowColor: 'rgba(255, 236, 179, 0.58)',
    accentColor: '#E58619',
    titleTracking: 'tracking-[-0.01em]',
    dishRotation: 0,
    dishScale: 'w-[260px] sm:w-[340px] md:w-[400px] lg:w-[450px]',
  },
  {
    id: 'roll',
    title: 'ROLL',
    subtitle: 'Crispy Chargrilled Tortilla Chicken Wrap',
    description:
      'The chicken roll is a very popular dish and loved dish in North India. It includes traditionally small pieces of boneless chicken baked using skewers on a brazier.',
    price: 149,
    calories: '520 kcal',
    prepTime: '10 min',
    image: rollImgUrl,
    // ROLLS AND WRAPS CATEGORY: Fresh green, warm orange, and cream
    bgGradient:
      'radial-gradient(circle at 50% 48%, #F4FCE3 0%, #B8F238 35%, #82C91E 72%, #5C940D 100%)',
    glowColor: 'rgba(244, 252, 227, 0.62)',
    accentColor: '#71C208',
    titleTracking: 'tracking-[0.12em] pl-[0.12em]',
    dishRotation: -4,
    dishScale: 'w-[270px] sm:w-[360px] md:w-[430px] lg:w-[480px]',
  },
  {
    id: 'pizza',
    title: 'PIZZA',
    subtitle: 'Artisan Wood-Fired Olive & Basil Slice',
    description:
      'Pizza is a very popular and famous dish in North India. It includes traditionally small and thin pieces beef/chicken/fish/mushrooms.',
    price: 299,
    calories: '610 kcal',
    prepTime: '15 min',
    image: pizzaImgUrl,
    // PIZZA CATEGORY: Tomato red, golden yellow, and warm cream
    bgGradient:
      'radial-gradient(circle at 50% 48%, #FFF3D6 0%, #F79646 36%, #E8591C 72%, #C92A2A 100%)',
    glowColor: 'rgba(255, 238, 204, 0.58)',
    accentColor: '#E03131',
    titleTracking: 'tracking-[0.04em] pl-[0.04em]',
    dishRotation: -2,
    dishScale: 'w-[270px] sm:w-[360px] md:w-[430px] lg:w-[480px]',
  },
];
