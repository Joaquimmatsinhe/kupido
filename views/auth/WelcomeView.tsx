
import React from 'react';
import AuthLayout from '../../components/AuthLayout';

interface WelcomeViewProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-rose-500 tracking-tight">
          K<i className="fa-solid fa-heart text-rose-400"></i>pido
        </h1>
        <p className="mt-2 text-lg text-rose-700">Encontre conexões verdadeiras em Moçambique.</p>
      </div>
      <div className="w-full space-y-4 mt-12">
        <button
          onClick={onNavigateToRegister}
          className="w-full bg-rose-500 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg"
        >
          Criar Conta
        </button>
        <button
          onClick={onNavigateToLogin}
          className="w-full bg-white text-rose-500 border-2 border-rose-500 font-bold py-4 px-6 rounded-full text-lg hover:bg-rose-50 transition-transform transform hover:scale-105"
        >
          Fazer Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default WelcomeView;
