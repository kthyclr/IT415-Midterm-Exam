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
        return <Banknote className="w-8 h-8 text-[#eb5e28]" />;
      case 'QR Payment':
        return <QrCode className="w-8 h-8 text-[#eb5e28]" />;
      case 'Credit/Debit Card':
        return <CreditCard className="w-8 h-8 text-[#eb5e28]" />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={`ink-card-interactive w-full text-left p-6 flex flex-col justify-between min-h-[230px] cursor-pointer ${
        selected ? 'bg-[#fff0eb] ring-3 ring-[#eb5e28]' : 'bg-white'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#fffcf2] border-2 border-[#252422] flex items-center justify-center shadow-[3px_3px_0_#252422]">
            {renderIcon()}
          </div>
          <span className="kiosk-label">{subtitle}</span>
        </div>

        <h3 className="handwritten text-3xl font-bold text-[#252422] leading-none">
          {title}
        </h3>
        <p className="text-sm text-[#403d39] mt-2.5 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 mt-5 border-t-2 border-dashed border-[#252422]/30 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#252422]">
          Select {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-[#252422] text-white flex items-center justify-center">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};
