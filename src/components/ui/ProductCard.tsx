import React, { useState } from 'react';
import { Product } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import { resolveProductImage } from '../../data/initialProducts';
import { Plus, Utensils } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onSelectProduct,
}) => {
  const [imgError, setImgError] = useState(false);
  const isSelected = quantityInCart > 0;
  const imgSrc = resolveProductImage(product);

  return (
    <button
      type="button"
      onClick={() => onSelectProduct(product)}
      className={`ink-card-interactive text-left w-full p-4 sm:p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
        isSelected ? 'ring-3 ring-[#eb5e28]' : ''
      }`}
    >
      <div>
        {/* Product Image Container */}
        <div className="relative w-full aspect-4/3 rounded-2xl border-2 border-[#252422] overflow-hidden bg-[#fffcf2] mb-3.5">
          {!imgError && imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#fff0eb] text-[#eb5e28] p-4 text-center">
              <Utensils className="w-8 h-8 mb-1" />
              <span className="font-mono text-xs font-bold uppercase text-[#252422]">
                {product.name}
              </span>
            </div>
          )}

          {isSelected && (
            <span className="absolute top-2.5 right-2.5 font-mono text-xs font-bold bg-[#252422] text-white px-2.5 py-1 rounded-xl border-2 border-white shadow-xs">
              ×{quantityInCart} IN TRAY
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="kiosk-label">{product.category}</span>
        </div>

        <h3 className="handwritten text-3xl font-bold text-[#252422] mt-1 mb-1 leading-none">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-[#403d39] leading-snug mb-4 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-dashed border-[#252422]/15">
        <div className="font-mono font-bold text-base sm:text-lg text-[#252422] bg-[#fff0eb] border-2 border-[#252422] px-3 py-1 rounded-xl tabular-nums">
          {formatCurrency(product.priceCentavos)}
        </div>

        <span
          className={`min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-[#252422] font-mono text-xs font-bold uppercase inline-flex items-center gap-1 transition-colors ${
            isSelected
              ? 'bg-[#eb5e28] text-white'
              : 'bg-[#fffcf2] text-[#252422] hover:bg-[#eb5e28] hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add
        </span>
      </div>
    </button>
  );
};
