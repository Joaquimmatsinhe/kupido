
import React from 'react';

type View = 'discover' | 'matches' | 'profile';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full transition-colors duration-300 ${
      isActive ? 'text-rose-500' : 'text-gray-400'
    } hover:text-rose-400`}
  >
    <i className={`fa-solid ${icon} text-2xl`}></i>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-200">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-around px-4">
        <NavButton
          label="Descobrir"
          icon="fa-compass"
          isActive={activeView === 'discover'}
          onClick={() => setActiveView('discover')}
        />
        <NavButton
          label="Conexões"
          icon="fa-comments"
          isActive={activeView === 'matches'}
          onClick={() => setActiveView('matches')}
        />
        <NavButton
          label="Perfil"
          icon="fa-user"
          isActive={activeView === 'profile'}
          onClick={() => setActiveView('profile')}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
