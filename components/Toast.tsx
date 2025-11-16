
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: 'fa-circle-check',
    bg: 'bg-green-500',
  },
  error: {
    icon: 'fa-circle-xmark',
    bg: 'bg-red-500',
  },
  info: {
    icon: 'fa-circle-info',
    bg: 'bg-blue-500',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Toast disappears after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const config = toastConfig[type];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-in-down">
      <div className={`flex items-center text-white font-bold px-6 py-4 rounded-full shadow-lg ${config.bg}`}>
        <i className={`fa-solid ${config.icon} mr-3 text-xl`}></i>
        <span>{message}</span>
      </div>
       <style>{`
        @keyframes slide-in-down { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-slide-in-down { animation: slide-in-down 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Toast;
