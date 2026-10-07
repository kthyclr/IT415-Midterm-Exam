import React from 'react';
import { KioskStage } from '../../types/pos';

interface ProgressIndicatorProps {
  currentStage: KioskStage;
  variant?: 'bar' | 'inline';
}

interface StepDef {
  id: number;
  stepText: string;
  label: string;
  stages: KioskStage[];
}

const STEPS: StepDef[] = [
  { id: 1, stepText: 'Step One', label: 'Order', stages: ['ITEM_SELECTION'] },
  { id: 2, stepText: 'Step Two', label: 'Review', stages: ['ORDER_SUMMARY'] },
  { id: 3, stepText: 'Step Three', label: 'Payment', stages: ['PAYMENT_METHOD', 'PAYMENT_PROCESSING'] },
  { id: 4, stepText: 'Step Four', label: 'Confirmed', stages: ['PAYMENT_SUCCESSFUL'] },
  { id: 5, stepText: 'Step Five', label: 'Receipt', stages: ['RECEIPT'] },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStage,
  variant = 'inline',
}) => {
  const activeStepIndex = STEPS.findIndex((s) => s.stages.includes(currentStage));
  const currentStep = STEPS[activeStepIndex] || STEPS[0];

  if (variant === 'inline') {
    return (
      <div className="no-print" aria-label="Transaction Progress">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isCurrent = index === activeStepIndex;
            return (
              <div
                key={step.id}
                title={`${step.stepText}: ${step.label}`}
                className={`w-3.5 h-3.5 rounded-full border-2 border-[#252422] transition-colors ${
                  isCurrent
                    ? 'bg-[#eb5e28]'
                    : isCompleted
                      ? 'bg-[#252422]'
                      : 'bg-transparent'
                }`}
              />
            );
          })}
          <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-[#403d39]">
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.id}>
                <span className={idx === activeStepIndex ? 'font-bold text-[#252422]' : 'opacity-60'}>
                  {s.label}
                </span>
                {idx < STEPS.length - 1 && <span className="mx-1.5 opacity-40">→</span>}
              </React.Fragment>
            ))}
          </span>
        </div>
        <div className="kiosk-label">{currentStep.stepText}</div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[#fffcf2] border-b-2 border-[#252422] px-6 py-2.5 no-print"
      aria-label="Transaction Progress"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isCurrent = index === activeStepIndex;
            return (
              <div
                key={step.id}
                className={`w-3.5 h-3.5 rounded-full border-2 border-[#252422] ${
                  isCurrent
                    ? 'bg-[#eb5e28]'
                    : isCompleted
                      ? 'bg-[#252422]'
                      : 'bg-white'
                }`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
          {STEPS.map((step, idx) => {
            const isCurrent = idx === activeStepIndex;
            return (
              <React.Fragment key={step.id}>
                <span
                  className={
                    isCurrent
                      ? 'font-bold text-[#eb5e28] underline underline-offset-4'
                      : idx < activeStepIndex
                        ? 'font-bold text-[#252422]'
                        : 'text-[#403d39]/60'
                  }
                >
                  {step.id}. {step.label}
                </span>
                {idx < STEPS.length - 1 && <span className="text-[#252422]/40">→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
