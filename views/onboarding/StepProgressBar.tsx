
import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps -1)) * 100;

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="flex justify-between items-center mb-2 text-sm text-rose-600 font-semibold">
        <span>Passo {currentStep} de {totalSteps}</span>
      </div>
      <div className="w-full bg-rose-200 rounded-full h-2.5">
        <div
          className="bg-rose-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepProgressBar;
