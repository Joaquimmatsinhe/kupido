import React, { useState } from 'react';

interface OnboardingProps {
  onFinish: () => void;
}

const onboardingSteps = [
  {
    icon: 'fa-heart',
    title: 'Bem-vindo ao Kupido!',
    description: 'O seu lugar para encontrar conexões verdadeiras em Moçambique. Vamos começar?',
  },
  {
    icon: 'fa-compass',
    title: 'Descubra Perfis',
    description: 'Na tela "Descobrir", arraste para a direita se gostar de alguém, ou para a esquerda se preferir passar.',
  },
  {
    icon: 'fa-star',
    title: 'Destaque-se com um Super Like',
    description: 'Use o seu Super Like diário para mostrar a alguém que o seu interesse é especial. Eles serão notificados imediatamente!',
  },
  {
    icon: 'fa-comments',
    title: 'É um Match!',
    description: 'Quando o interesse é mútuo, vocês dão match! A conversa começa na aba "Conexões".',
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const currentStep = onboardingSteps[step];
  const isLastStep = step === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinish();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-500 to-pink-600 flex flex-col items-center justify-center text-white p-8 text-center animate-fade-in">
      <div className="flex-grow flex flex-col items-center justify-center">
        <i className={`fa-solid ${currentStep.icon} text-7xl mb-6 text-white/80`}></i>
        <h1 className="text-4xl font-bold mb-4">{currentStep.title}</h1>
        <p className="text-lg max-w-sm opacity-90">{currentStep.description}</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-center gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === step ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full bg-white text-rose-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-rose-100 transition-transform transform hover:scale-105"
        >
          {isLastStep ? 'Começar a Usar!' : 'Próximo'}
        </button>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Onboarding;
