
import React from 'react';

interface OnboardingStepLayoutProps {
  title: string;
  description: string;
  onNext: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
  children: React.ReactNode;
}

const OnboardingStepLayout: React.FC<OnboardingStepLayoutProps> = ({
  title,
  description,
  onNext,
  onBack,
  isNextDisabled = false,
  nextButtonText = 'Próximo',
  children,
}) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>

      <div className={`mt-8 flex ${onBack ? 'justify-between' : 'justify-end'} items-center`}>
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
          </button>
        )}
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-rose-500 text-white font-bold py-3 px-8 rounded-full hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
        >
          {nextButtonText} <i className="fa-solid fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default OnboardingStepLayout;
