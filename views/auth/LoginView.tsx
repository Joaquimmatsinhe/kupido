
import React, { useState, useEffect } from 'react';
import AuthLayout from '../../components/AuthLayout';
import Spinner from '../../components/Spinner';
import { UserProfile, Gender, VerificationStatus } from '../../types';

const LOCKOUT_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 30;

interface LoginViewProps {
  onLoginSuccess: (email: string, isAdmin?: boolean) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  initialMessage?: string;
  onClearMessage?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigateToRegister, onNavigateToForgotPassword, initialMessage, onClearMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState(initialMessage || '');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(LOCKOUT_DURATION_SECONDS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (email || password) {
        if (infoMessage) {
            setInfoMessage('');
            onClearMessage?.();
        }
    }
  }, [email, password, infoMessage, onClearMessage]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isLocked) {
      timer = setInterval(() => {
        setLockoutTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            setFailedAttempts(0); 
            return LOCKOUT_DURATION_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked]);
  
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoading) return;
    setError('');
    setInfoMessage('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (!validateEmail(email)) {
        setError('Por favor, insira um formato de email válido.');
        return;
    }

    setIsLoading(true);

    // Admin backdoor login
    if (email === 'admin@gmail.com' && password === 'password252518#') {
        setTimeout(() => {
            const usersDB: UserProfile[] = JSON.parse(localStorage.getItem('kupido-users') || '[]');
            let adminUser = usersDB.find(user => user.email === 'admin@gmail.com');
            
            if (!adminUser) {
                adminUser = {
                    id: 'admin-user-001',
                    email: 'admin@gmail.com',
                    password: 'password252518#',
                    name: 'Admin',
                    dateOfBirth: '1990-01-01',
                    gender: Gender.PreferNotToSay,
                    location: 'Maputo',
                    photos: ['https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                    bio: 'Conta de administrador.',
                    occupation: 'Administrador de Sistema',
                    interests: ['Tecnologia'],
                    preferences: {
                        minAge: 18,
                        maxAge: 99,
                        genders: [Gender.Male, Gender.Female, Gender.NonBinary],
                        maxDistance: 500,
                    },
                    registrationDate: new Date().toISOString(),
                    verificationStatus: VerificationStatus.Verified,
                    isAdmin: true,
                };
                usersDB.push(adminUser);
                localStorage.setItem('kupido-users', JSON.stringify(usersDB));
            } else if (!adminUser.isAdmin) {
                 const updatedUsers = usersDB.map(u => 
                    u.email === 'admin@gmail.com' ? { ...u, isAdmin: true } : u
                );
                localStorage.setItem('kupido-users', JSON.stringify(updatedUsers));
            }
            
            onLoginSuccess('admin@gmail.com', true);
            setIsLoading(false);
        }, 500);
        return;
    }

    setTimeout(() => {
      const usersDB: UserProfile[] = JSON.parse(localStorage.getItem('kupido-users') || '[]');
      const foundUser = usersDB.find(user => user.email === email);

      if (foundUser && foundUser.password === password) {
          setFailedAttempts(0);
          onLoginSuccess(email, !!foundUser.isAdmin);
      } else {
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          if (newAttempts >= LOCKOUT_ATTEMPTS) {
              setIsLocked(true);
              setLockoutTimer(LOCKOUT_DURATION_SECONDS);
              setError(`Muitas tentativas falhadas. Tente novamente em ${LOCKOUT_DURATION_SECONDS} segundos.`);
          } else {
              setError(`Credenciais inválidas. (${newAttempts}/${LOCKOUT_ATTEMPTS} tentativas)`);
          }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Bem-vindo de volta!</h2>
        <p className="mt-2 text-gray-600">Faça login para continuar.</p>
      </div>
      <form onSubmit={handleLogin} className="w-full space-y-6 mt-8">
        {infoMessage && (
            <p className="text-center font-semibold p-3 rounded-lg text-blue-800 bg-blue-100">
                {infoMessage}
            </p>
        )}
        {error && (
            <p className={`text-center font-semibold p-3 rounded-lg ${isLocked ? 'text-yellow-800 bg-yellow-100' : 'text-red-500 bg-red-50'}`}>
                {error}
            </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-200"
            placeholder="seu.email@exemplo.com"
            autoComplete="email"
            disabled={isLocked || isLoading}
          />
        </div>
        <div>
           <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-200"
            placeholder="********"
            autoComplete="current-password"
            disabled={isLocked || isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={isLocked || isLoading}
        >
          {isLoading ? <Spinner /> : isLocked ? `Tente novamente em ${lockoutTimer}s` : 'Entrar'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button onClick={onNavigateToForgotPassword} className="font-medium text-rose-600 hover:text-rose-500">
          Esqueceu sua senha?
        </button>
        <p className="mt-2 text-gray-600">
          Não tem uma conta?{' '}
          <button onClick={onNavigateToRegister} className="font-medium text-rose-600 hover:text-rose-500">
            Crie uma agora
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginView;
