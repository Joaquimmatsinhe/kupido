import React, { useState, useRef, useEffect } from 'react';

interface MoreOptionsMenuProps {
  onBlock: () => void;
  onReport: () => void;
  buttonColor?: string;
}

const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({ onBlock, onReport, buttonColor = 'text-white' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBlockClick = () => {
    onBlock();
    setIsOpen(false);
  };

  const handleReportClick = () => {
    onReport();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors ${buttonColor}`}
        aria-label="Mais opções"
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 animate-fade-in-fast">
          <button
            onClick={handleBlockClick}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i className="fa-solid fa-ban w-6 mr-2 text-gray-500"></i>
            Bloquear Usuário
          </button>
          <button
            onClick={handleReportClick}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <i className="fa-solid fa-flag w-6 mr-2"></i>
            Denunciar Usuário
          </button>
        </div>
      )}
       <style>{`
        @keyframes fade-in-fast { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-fast { animation: fade-in-fast 0.1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MoreOptionsMenu;
