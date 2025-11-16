
import React, { useState, useEffect } from 'react';
import AuthenticatedApp from './AuthenticatedApp';
import WelcomeView from './views/auth/WelcomeView';
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';
import ForgotPasswordView from './views/auth/ForgotPasswordView';
import ResetPasswordView from './views/auth/ResetPasswordView';

type AuthStatus = 'unauthenticated' | 'authenticated' | 'checking';
type AuthView = 'welcome' | 'login' | 'register' | 'forgot_password' | 'reset_password';

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const App: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [loginMessage, setLoginMessage] = useState('');
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const [onboardingPending, setOnboardingPending] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('kupido-session');
    const onboardingFlag = localStorage.getItem('kupido-onboarding-pending');
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (Date.now() - session.loginTime > SESSION_DURATION_MS) {
        localStorage.removeItem('kupido-session');
        localStorage.removeItem('kupido-onboarding-pending');
        localStorage.removeItem('kupido-onboarding-profile');
        setAuthStatus('unauthenticated');
        setAuthView('login');
        setLoginMessage('Sua sessão expirou. Por favor, faça login novamente.');
      } else {
        setUserEmail(session.email);
        setIsAdmin(session.isAdmin || false);
        setAuthStatus('authenticated');
        if (onboardingFlag === 'true' && !session.isAdmin) {
          setOnboardingPending(true);
        }
      }
    } else {
      setAuthStatus('unauthenticated');
    }
  }, []);

  const handleLoginSuccess = (email: string, isAdminLogin: boolean = false) => {
    const session = { loginTime: Date.now(), email, isAdmin: isAdminLogin };
    localStorage.setItem('kupido-session', JSON.stringify(session));
    setUserEmail(email);
    setAuthStatus('authenticated');
    setIsAdmin(isAdminLogin);
    setLoginMessage('');
    if (localStorage.getItem('kupido-onboarding-pending') === 'true' && !isAdminLogin) {
        setOnboardingPending(true);
    }
  };

  const handleRegisterSuccess = (email: string) => {
    handleLoginSuccess(email, false);
    setIsNewRegistration(true);
  };
  
  const handleOnboardingFinish = () => {
    localStorage.removeItem('kupido-onboarding-pending');
    localStorage.removeItem('kupido-onboarding-profile');
    setIsNewRegistration(false);
    setOnboardingPending(false);
  };

  const handleLogout = (message?: string) => {
      localStorage.removeItem('kupido-session');
      setAuthStatus('unauthenticated');
      setAuthView('login');
      setLoginMessage(message || 'Você saiu com sucesso.');
      setIsNewRegistration(false);
      setOnboardingPending(false);
      setUserEmail('');
      setIsAdmin(false);
  }

  if (authStatus === 'checking') {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center">
            <i className="fa-solid fa-heart text-rose-500 text-6xl animate-pulse"></i>
        </div>
      );
  }

  if (authStatus === 'authenticated') {
    return (
        <AuthenticatedApp 
            key={userEmail}
            onLogout={(isInactive) => handleLogout(isInactive ? 'Sua sessão foi encerrada por inatividade.' : undefined)} 
            isProfileIncomplete={(isNewRegistration || onboardingPending) && !isAdmin} 
            userEmail={userEmail}
            onOnboardingFinish={handleOnboardingFinish}
            isAdmin={isAdmin}
        />
    );
  }

  switch (authView) {
    case 'login':
      return <LoginView 
        onLoginSuccess={handleLoginSuccess} 
        onNavigateToRegister={() => setAuthView('register')} 
        onNavigateToForgotPassword={() => setAuthView('forgot_password')}
        initialMessage={loginMessage}
        onClearMessage={() => setLoginMessage('')}
      />;
    case 'register':
      return <RegisterView onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setAuthView('login')} />;
    case 'forgot_password':
        return <ForgotPasswordView onNavigateToLogin={() => setAuthView('login')} onResetPasswordRequest={() => setAuthView('reset_password')} />;
    case 'reset_password':
        return <ResetPasswordView onPasswordResetSuccess={() => setAuthView('login')} onNavigateToLogin={() => setAuthView('login')} />;
    case 'welcome':
    default:
      return (
        <WelcomeView
          onNavigateToLogin={() => setAuthView('login')}
          onNavigateToRegister={() => setAuthView('register')}
        />
      );
  }
};

export default App;
