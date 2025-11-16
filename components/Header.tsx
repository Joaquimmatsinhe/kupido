import React from 'react';

interface HeaderProps {
  notificationCount: number;
  onNotificationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ notificationCount, onNotificationClick }) => {
  return (
    <header className="text-center pt-4 pb-2 shrink-0 px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 bg-gradient-to-b from-rose-100 to-rose-100/80 backdrop-blur-sm z-20">
      <div className="w-10"></div> {/* Spacer */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-rose-500 tracking-tight">
          K<i className="fa-solid fa-heart text-rose-400"></i>pido
        </h1>
        <p className="text-rose-700 text-sm">Encontros em Moçambique</p>
      </div>
      <div className="w-10 flex justify-end">
        <button onClick={onNotificationClick} className="relative text-gray-500 hover:text-rose-500 transition-colors">
          <i className="fa-solid fa-bell text-2xl"></i>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-rose-100">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
