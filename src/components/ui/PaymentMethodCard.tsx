import React from 'react';
import { PaymentMethod } from '../../types/pos';
import { Banknote, QrCode, CreditCard, ChevronRight } from 'lucide-react';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  title: string;
  subtitle: string;
  description: string;
  selected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  title,
  subtitle,
  description,
  selected,
  onSelect,
}) => {
  const renderIcon = () => {
    switch (method) {
      case 'Cash':
        return <Banknote className="w-8 h-8 text-emerald-700" />;
      case 'QR Payment':
        return <QrCode className="w-8 h-8 text-emerald-700" />;
      case 'Credit/Debit Card':
        return <CreditCard className="w-8 h-8 text-emerald-700" />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={`w-full text-left rounded-2xl p-6 transition-all duration-150 active:scale-[0.99] flex flex-col justify-between min-h-[210px] cursor-pointer border ${
        selected
          ? 'bg-emerald-50/50 border-emerald-700 ring-2 ring-emerald-700/20 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center">
            {renderIcon()}
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">
            {subtitle}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{description}</p>
      </div>

      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-emerald-800">
          Select {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};
