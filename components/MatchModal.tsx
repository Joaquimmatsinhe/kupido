import React from 'react';
import { UserProfile } from '../types';

interface MatchModalProps {
  currentUser: UserProfile;
  newMatch: UserProfile;
  onClose: () => void;
  onSendMessageClick: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ currentUser, newMatch, onClose, onSendMessageClick }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl shadow-xl max-w-md w-full text-center p-8 relative transform scale-100 animate-jump-in">
        <h2 className="text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'cursive' }}>É um Match!</h2>
        <p className="mt-2 text-lg opacity-90">Você e {newMatch.name} curtiram um ao outro.</p>

        <div className="flex justify-center items-center my-8 space-x-[-30px]">
          <img
            src={currentUser.photos[0]}
            alt={currentUser.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg transform rotate-[-10deg]"
          />
          <img
            src={newMatch.photos[0]}
            alt={newMatch.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg transform rotate-[10deg]"
          />
        </div>

        <div className="space-y-4">
            <button
                onClick={onSendMessageClick}
                className="w-full bg-white text-rose-600 font-bold py-3 px-6 rounded-full text-lg hover:bg-rose-100 transition-transform transform hover:scale-105"
            >
                <i className="fa-solid fa-paper-plane mr-2"></i> Enviar uma mensagem
            </button>
            <button
                onClick={onClose}
                className="w-full bg-transparent border-2 border-white/50 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition-colors"
            >
                Continuar a deslizar
            </button>
        </div>
      </div>
       <style>{`
        @keyframes jump-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-jump-in {
          animation: jump-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MatchModal;