import { Product } from '../types/pos';
import coffeeImg from '../assets/images/product_coffee_cup_1791355690264.jpg';
import sandwichImg from '../assets/images/product_club_sandwich_1791355702044.jpg';
import softdrinkImg from '../assets/images/product_cola_drink_1791355713747.jpg';
import cookiesImg from '../assets/images/product_choco_cookies_1791355724440.jpg';
import waterImg from '../assets/images/product_spring_water_1791355735212.jpg';
import chocolateImg from '../assets/images/product_chocolate_bar_1791355747552.jpg';
import tumblerImg from '../assets/images/product_campus_tumbler_1791355760751.jpg';
import lanyardImg from '../assets/images/product_id_lanyard_1791355772082.jpg';

/**
 * Default Product Images Map (Bundled by Vite for both dev and deployed production builds)
 */
export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  'prod-coffee': coffeeImg,
  'prod-sandwich': sandwichImg,
  'prod-softdrink': softdrinkImg,
  'prod-cookies': cookiesImg,
  'prod-water': waterImg,
  'prod-chocolate': chocolateImg,
  'prod-tumbler': tumblerImg,
  'prod-lanyard': lanyardImg,
};

export function resolveProductImage(product: Pick<Product, 'id' | 'name' | 'category' | 'imageUrl'>): string {
  // Always prefer bundled asset URLs if the stored imageUrl was an unbundled /src/assets/ string
  if (
    product.imageUrl &&
    product.imageUrl.trim().length > 0 &&
    !product.imageUrl.startsWith('/src/assets/')
  ) {
    return product.imageUrl;
  }
  if (DEFAULT_PRODUCT_IMAGES[product.id]) {
    return DEFAULT_PRODUCT_IMAGES[product.id];
  }
  const lower = product.name.toLowerCase();
  if (lower.includes('coffee') || lower.includes('latte') || lower.includes('espresso')) {
    return DEFAULT_PRODUCT_IMAGES['prod-coffee'];
  }
  if (lower.includes('sandwich') || lower.includes('burger') || lower.includes('meal')) {
    return DEFAULT_PRODUCT_IMAGES['prod-sandwich'];
  }
  if (lower.includes('water')) {
    return DEFAULT_PRODUCT_IMAGES['prod-water'];
  }
  if (lower.includes('drink') || lower.includes('soda') || lower.includes('cola') || lower.includes('juice')) {
    return DEFAULT_PRODUCT_IMAGES['prod-softdrink'];
  }
  if (lower.includes('cookie') || lower.includes('biscuit') || lower.includes('pastry')) {
    return DEFAULT_PRODUCT_IMAGES['prod-cookies'];
  }
  if (lower.includes('chocolate') || lower.includes('candy') || lower.includes('bar')) {
    return DEFAULT_PRODUCT_IMAGES['prod-chocolate'];
  }
  if (lower.includes('tumbler') || lower.includes('flask') || lower.includes('mug')) {
    return DEFAULT_PRODUCT_IMAGES['prod-tumbler'];
  }
  if (product.category === 'Merch') {
    return DEFAULT_PRODUCT_IMAGES['prod-lanyard'];
  }
  if (product.category === 'Drinks') {
    return DEFAULT_PRODUCT_IMAGES['prod-coffee'];
  }
  if (product.category === 'Snacks') {
    return DEFAULT_PRODUCT_IMAGES['prod-cookies'];
  }
  return DEFAULT_PRODUCT_IMAGES['prod-sandwich'];
}

/**
 * Initial Ate & Served Products
 * Includes the 6 required exam products with exact prices plus 2 store merch items.
 */
export const INITIAL_CAMPUS_PRODUCTS: Product[] = [
  {
    id: 'prod-coffee',
    name: 'Coffee',
    priceCentavos: 4500, // ₱45.00
    category: 'Drinks',
    description: 'Freshly brewed hot campus roast arabica coffee (12oz cup).',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-coffee'],
    active: true,
  },
  {
    id: 'prod-sandwich',
    name: 'Sandwich',
    priceCentavos: 5000, // ₱50.00
    category: 'Food',
    description: 'Toasted clubhouse sandwich with ham, cheddar cheese, lettuce, and egg.',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-sandwich'],
    active: true,
  },
  {
    id: 'prod-softdrink',
    name: 'Soft Drink',
    priceCentavos: 3500, // ₱35.00
    category: 'Drinks',
    description: 'Ice-cold carbonated cola refreshment in a 330ml chilled can.',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-softdrink'],
    active: true,
  },
  {
    id: 'prod-cookies',
    name: 'Cookies',
    priceCentavos: 2500, // ₱25.00
    category: 'Snacks',
    description: 'Baked double chocolate chip butter cookies (pack of 3).',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-cookies'],
    active: true,
  },
  {
    id: 'prod-water',
    name: 'Bottled Water',
    priceCentavos: 2000, // ₱20.00
    category: 'Drinks',
    description: 'Purified chilled spring drinking water (500ml bottle).',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-water'],
    active: true,
  },
  {
    id: 'prod-chocolate',
    name: 'Chocolate',
    priceCentavos: 2500, // ₱25.00
    category: 'Snacks',
    description: 'Creamy milk chocolate energy bar with roasted almonds (45g).',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-chocolate'],
    active: true,
  },
  {
    id: 'prod-tumbler',
    name: 'Campus Tumbler',
    priceCentavos: 15000, // ₱150.00
    category: 'Merch',
    description: 'Insulated stainless steel university flask (500ml) with leak-proof lid.',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-tumbler'],
    active: true,
  },
  {
    id: 'prod-lanyard',
    name: 'University ID Lanyard',
    priceCentavos: 6500, // ₱65.00
    category: 'Merch',
    description: 'Woven polyester campus lanyard with metal safety clasp and ID holder.',
    imageUrl: DEFAULT_PRODUCT_IMAGES['prod-lanyard'],
    active: true,
  },
];
