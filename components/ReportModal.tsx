
import React, { useState } from 'react';
import { UserProfile, ReportReason } from '../types';
import { REPORT_REASONS } from '../constants';

interface ReportModalProps {
  user: UserProfile;
  onClose: () => void;
  onSubmit: (user: UserProfile, reason: ReportReason) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ user, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedReason) {
      setSubmitted(true);
      // We call onSubmit first, which will trigger the toast in the parent
      onSubmit(user, selectedReason);
      // Then we close the modal after a delay
      setTimeout(onClose, 2000); 
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform animate-jump-in">
        <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-800">Denunciar {user.name}</h2>
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <i className="fa-solid fa-times text-2xl"></i>
               </button>
            </div>
             <p className="text-gray-600 mt-2">Sua denúncia é anônima. Ajude-nos a manter a comunidade segura.</p>
        </div>
        
        {submitted ? (
             <div className="text-center p-10">
                <i className="fa-solid fa-circle-check text-5xl text-green-500 mb-4"></i>
                <h3 className="text-xl font-bold text-gray-800">Denúncia Enviada</h3>
                <p className="text-gray-600 mt-1">Obrigado! Nossa equipe irá analisar a sua denúncia.</p>
            </div>
        ) : (
             <>
                <div className="px-6 py-4 space-y-3 border-y">
                {REPORT_REASONS.map(reason => (
                    <label key={reason} className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="report-reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">{reason}</span>
                    </label>
                ))}
                </div>
                <div className="p-6 bg-gray-50 rounded-b-xl">
                <button
                    onClick={handleSubmit}
                    disabled={!selectedReason}
                    className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-red-700 transition-transform transform hover:scale-105 disabled:bg-gray-300 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-paper-plane mr-2"></i> Enviar Denúncia
                </button>
                </div>
             </>
        )}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes jump-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-jump-in { animation: jump-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ReportModal;
