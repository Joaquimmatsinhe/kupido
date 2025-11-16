
import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import Spinner from '../../components/Spinner';

interface ForgotPasswordViewProps {
  onNavigateToLogin: () => void;
  onResetPasswordRequest: () => void;
}

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigateToLogin, onResetPasswordRequest }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      // Simulate network delay
      setTimeout(() => {
        console.log('Password recovery link sent to:', email);
        setSubmitted(true);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Recuperar Senha</h2>
      </div>
      
      {submitted ? (
         <div className="text-center mt-8 space-y-6">
            <i className="fa-solid fa-paper-plane text-5xl text-rose-500"></i>
            <p className="text-gray-600">Se uma conta com o email <strong>{email}</strong> existir, enviamos um link para redefinir sua senha.</p>
            <button 
                onClick={onResetPasswordRequest}
                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-green-600"
            >
                (Simular) Ir para Redefinição de Senha
            </button>
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-8">
            <p className="text-gray-600 text-center">Digite seu email e enviaremos um link para você voltar a acessar sua conta.</p>
            <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                placeholder="seu.email@exemplo.com"
                required
                disabled={isLoading}
            />
            </div>
            <button
            type="submit"
            className="w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 flex justify-center items-center"
            disabled={isLoading}
            >
            {isLoading ? <Spinner /> : 'Enviar Link de Recuperação'}
            </button>
      </form>
      )}

      <div className="mt-6 text-center text-sm">
        <button onClick={onNavigateToLogin} className="font-medium text-rose-600 hover:text-rose-500">
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Voltar para o Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordView;
