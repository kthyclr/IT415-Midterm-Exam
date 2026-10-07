import React from 'react';
import { KioskStage } from '../../types/pos';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStage: KioskStage;
}

interface StepDef {
  id: number;
  label: string;
  stages: KioskStage[];
}

const STEPS: StepDef[] = [
  { id: 1, label: 'Order', stages: ['ITEM_SELECTION'] },
  { id: 2, label: 'Review', stages: ['ORDER_SUMMARY'] },
  { id: 3, label: 'Payment', stages: ['PAYMENT_METHOD', 'PAYMENT_PROCESSING'] },
  { id: 4, label: 'Confirmation', stages: ['PAYMENT_SUCCESSFUL'] },
  { id: 5, label: 'Receipt', stages: ['RECEIPT'] },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStage }) => {
  const activeStepIndex = STEPS.findIndex((s) => s.stages.includes(currentStage));

  return (
    <div
      className="w-full bg-white border-b border-slate-200 px-6 py-3 no-print"
      aria-label="Transaction Progress"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isCurrent = index === activeStepIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5 shrink-0 py-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.id}
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    isCurrent
                      ? 'text-slate-900'
                      : isCompleted
                        ? 'text-emerald-800'
                        : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-[24px] max-w-[120px] rounded-full transition-colors ${
                    index < activeStepIndex ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
