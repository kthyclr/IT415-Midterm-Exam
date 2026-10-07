import React from 'react';
import { Product } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import {
  Coffee,
  Sandwich,
  CupSoda,
  Cookie,
  GlassWater,
  Candy,
  ShoppingBag,
  Tag,
  Plus,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onSelectProduct: (product: Product) => void;
}

function getProductIcon(product: Product) {
  const lower = product.name.toLowerCase();
  if (lower.includes('coffee')) return <Coffee className="w-7 h-7 text-amber-800" />;
  if (lower.includes('sandwich')) return <Sandwich className="w-7 h-7 text-orange-700" />;
  if (lower.includes('soft drink') || lower.includes('soda') || lower.includes('cola'))
    return <CupSoda className="w-7 h-7 text-rose-700" />;
  if (lower.includes('cookie')) return <Cookie className="w-7 h-7 text-amber-700" />;
  if (lower.includes('water') || lower.includes('tumbler'))
    return <GlassWater className="w-7 h-7 text-sky-700" />;
  if (lower.includes('chocolate') || lower.includes('candy'))
    return <Candy className="w-7 h-7 text-purple-700" />;
  if (product.category === 'Merch') return <ShoppingBag className="w-7 h-7 text-emerald-700" />;
  return <Tag className="w-7 h-7 text-slate-700" />;
}

function getProductSurfaceTint(product: Product): string {
  const lower = product.name.toLowerCase();
  if (lower.includes('coffee')) return 'bg-amber-50/80 border-amber-200/60';
  if (lower.includes('sandwich')) return 'bg-orange-50/80 border-orange-200/60';
  if (lower.includes('soft drink')) return 'bg-rose-50/80 border-rose-200/60';
  if (lower.includes('cookie')) return 'bg-yellow-50/80 border-yellow-200/60';
  if (lower.includes('water')) return 'bg-sky-50/80 border-sky-200/60';
  if (lower.includes('chocolate')) return 'bg-purple-50/80 border-purple-200/60';
  return 'bg-emerald-50/70 border-emerald-200/60';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onSelectProduct,
}) => {
  const isSelected = quantityInCart > 0;

  return (
    <button
      type="button"
      onClick={() => onSelectProduct(product)}
      className={`group text-left w-full rounded-2xl p-5 transition-all duration-150 active:scale-[0.98] flex flex-col justify-between min-h-[190px] cursor-pointer border ${
        isSelected
          ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getProductSurfaceTint(
              product
            )}`}
          >
            {getProductIcon(product)}
          </div>

          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 block">
              {product.category}
            </span>
            {isSelected && (
              <span className="text-xs font-mono font-bold text-emerald-700 mt-1 block">
                {quantityInCart} in order
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-xl font-mono font-bold text-slate-900 tabular-nums">
          {formatCurrency(product.priceCentavos)}
        </span>

        <span
          className={`min-h-[44px] px-4 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            isSelected
              ? 'bg-emerald-700 text-white'
              : 'bg-slate-100 text-slate-800 group-hover:bg-emerald-700 group-hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Tap to Add
        </span>
      </div>
    </button>
  );
};
