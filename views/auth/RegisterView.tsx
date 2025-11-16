
import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import Spinner from '../../components/Spinner';
import { UserProfile, Gender, VerificationStatus } from '../../types';

interface RegisterViewProps {
  onRegisterSuccess: (email: string) => void;
  onNavigateToLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    
    // Validations
    if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Por favor, preencha todos os campos.');
        return;
    }
    if (!validateEmail(formData.email)) {
        setError('Por favor, insira um formato de email válido.');
        return;
    }
    if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem.');
        return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
        const usersDB: UserProfile[] = JSON.parse(localStorage.getItem('kupido-users') || '[]');
        
        if (usersDB.some(user => user.email === formData.email)) {
            setError('Este email já está cadastrado.');
            setIsLoading(false);
            return;
        }
        
        const newUser: UserProfile = {
            id: `user-${Date.now()}`,
            email: formData.email,
            password: formData.password, // Em um app real, isso seria hasheado
            name: '',
            dateOfBirth: '',
            gender: Gender.PreferNotToSay,
            location: '',
            photos: [],
            bio: '',
            occupation: '',
            interests: [],
            preferences: {
                minAge: 18,
                maxAge: 99,
                genders: [],
                maxDistance: 100,
            },
            registrationDate: new Date().toISOString(),
            verificationStatus: VerificationStatus.Pending,
        };

        usersDB.push(newUser);
        localStorage.setItem('kupido-users', JSON.stringify(usersDB));
        
        localStorage.setItem('kupido-onboarding-pending', 'true');
        onRegisterSuccess(formData.email);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="text-center w-full">
        <h2 className="text-3xl font-bold text-gray-800">Crie sua Conta</h2>
        <p className="mt-2 text-gray-600">É rápido e fácil. Vamos começar.</p>
        <form onSubmit={handleRegister} className="w-full space-y-4 mt-6">
            {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
            <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Email" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                disabled={isLoading} 
            />
            <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Senha (mínimo 6 caracteres)" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                disabled={isLoading} 
            />
            <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                placeholder="Confirmar Senha" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                disabled={isLoading} 
            />
            <button 
                type="submit" 
                className="w-full bg-rose-500 text-white font-bold py-3 rounded-full text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg" 
                disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Registrar'}
            </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button onClick={onNavigateToLogin} className="font-medium text-rose-600 hover:text-rose-500">
                Faça login
            </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterView;