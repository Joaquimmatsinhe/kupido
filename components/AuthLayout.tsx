import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-rose-200 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 animate-fade-in-up">
        {children}
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;