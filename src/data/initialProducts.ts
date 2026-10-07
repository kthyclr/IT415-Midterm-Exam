import { Product } from '../types/pos';

/**
 * Initial Campus Store Products
 * Includes the 6 required exam products with exact prices plus 2 campus store items.
 */
export const INITIAL_CAMPUS_PRODUCTS: Product[] = [
  {
    id: 'prod-coffee',
    name: 'Coffee',
    priceCentavos: 4500, // ₱45.00
    category: 'Drinks',
    description: 'Freshly brewed hot campus roast arabica coffee (12oz cup).',
    active: true,
  },
  {
    id: 'prod-sandwich',
    name: 'Sandwich',
    priceCentavos: 5000, // ₱50.00
    category: 'Food',
    description: 'Toasted clubhouse sandwich with ham, cheddar cheese, lettuce, and egg.',
    active: true,
  },
  {
    id: 'prod-softdrink',
    name: 'Soft Drink',
    priceCentavos: 3500, // ₱35.00
    category: 'Drinks',
    description: 'Ice-cold carbonated cola refreshment in a 330ml chilled can.',
    active: true,
  },
  {
    id: 'prod-cookies',
    name: 'Cookies',
    priceCentavos: 2500, // ₱25.00
    category: 'Snacks',
    description: 'Baked double chocolate chip butter cookies (pack of 3).',
    active: true,
  },
  {
    id: 'prod-water',
    name: 'Bottled Water',
    priceCentavos: 2000, // ₱20.00
    category: 'Drinks',
    description: 'Purified chilled spring drinking water (500ml bottle).',
    active: true,
  },
  {
    id: 'prod-chocolate',
    name: 'Chocolate',
    priceCentavos: 2500, // ₱25.00
    category: 'Snacks',
    description: 'Creamy milk chocolate energy bar with roasted almonds (45g).',
    active: true,
  },
  {
    id: 'prod-tumbler',
    name: 'Campus Tumbler',
    priceCentavos: 15000, // ₱150.00
    category: 'Merch',
    description: 'Insulated stainless steel university flask (500ml) with leak-proof lid.',
    active: true,
  },
  {
    id: 'prod-lanyard',
    name: 'University ID Lanyard',
    priceCentavos: 6500, // ₱65.00
    category: 'Merch',
    description: 'Woven polyester campus lanyard with metal safety clasp and ID holder.',
    active: true,
  },
];
