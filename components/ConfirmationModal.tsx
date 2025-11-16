import React, { useState, useEffect } from 'react';

interface ConfirmationModalProps {
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  onClose: () => void;
  isDestructive?: boolean;
  requiresConfirmationText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, description, confirmText, onConfirm, onClose, isDestructive = false, requiresConfirmationText }) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [canConfirm, setCanConfirm] = useState(!requiresConfirmationText);

  useEffect(() => {
    if (requiresConfirmationText) {
      setCanConfirm(confirmationInput === requiresConfirmationText);
    }
  }, [confirmationInput, requiresConfirmationText]);

  const confirmButtonClass = isDestructive
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-rose-500 hover:bg-rose-600';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform animate-jump-in">
        <div className="p-6 text-center">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${isDestructive ? 'bg-red-100' : 'bg-rose-100'} mb-4`}>
                <i className={`fa-solid ${isDestructive ? 'fa-triangle-exclamation text-red-600' : 'fa-question text-rose-600'} text-3xl`}></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
        </div>

        {requiresConfirmationText && (
          <div className="px-6 pb-4">
            <label htmlFor="confirmationText" className="block text-sm font-medium text-gray-700">
              Para confirmar, digite <strong className="text-gray-900">{requiresConfirmationText}</strong> abaixo:
            </label>
            <input
              type="text"
              id="confirmationText"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              autoComplete="off"
            />
          </div>
        )}
        
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white ${confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {confirmText}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes jump-in { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-jump-in { animation: jump-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
