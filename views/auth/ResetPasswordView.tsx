
import React, { useState, useMemo } from 'react';
import AuthLayout from '../../components/AuthLayout';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import Spinner from '../../components/Spinner';

interface ResetPasswordViewProps {
  onPasswordResetSuccess: () => void;
  onNavigateToLogin: () => void;
}

const getPasswordStrength = (password: string): number => {
    let score = 0;
    if (!password) return score;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onPasswordResetSuccess, onNavigateToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const isPasswordStrongEnough = passwordStrength >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    if (!isPasswordStrongEnough) {
      setError('Sua nova senha deve ser pelo menos "Razoável".');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        console.log('Password successfully reset.');
        setSuccess(true);
        setTimeout(() => {
            onPasswordResetSuccess();
        }, 2500);
    }, 1000);
  };
  
  if (success) {
      return (
        <AuthLayout>
             <div className="text-center mt-8 space-y-6">
                <i className="fa-solid fa-circle-check text-5xl text-green-500"></i>
                <h2 className="text-2xl font-bold text-gray-800">Senha Redefinida!</h2>
                <p className="text-gray-600">Sua senha foi alterada com sucesso. Você será redirecionado para o login.</p>
            </div>
        </AuthLayout>
      );
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Crie uma Nova Senha</h2>
        <p className="mt-2 text-gray-600">Sua nova senha deve ser diferente da anterior.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-4 mt-8">
        {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nova Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            placeholder="********"
            required
            disabled={isLoading}
          />
           <PasswordStrengthIndicator password={password} />
        </div>
         <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Nova Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
            placeholder="********"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={!isPasswordStrongEnough || !password || !confirmPassword || isLoading}
        >
          {isLoading ? <Spinner /> : 'Redefinir Senha'}
        </button>
      </form>

       <div className="mt-6 text-center text-sm">
        <button onClick={onNavigateToLogin} className="font-medium text-rose-600 hover:text-rose-500" disabled={isLoading}>
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Voltar para o Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordView;
