import React from 'react';
import { Notification, NotificationType } from '../types';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onReadAll: () => void;
}

const getIconForNotification = (type: NotificationType) => {
  switch (type) {
    case NotificationType.NEW_MATCH:
      return { icon: 'fa-solid fa-heart-circle-check', color: 'text-rose-500' };
    case NotificationType.NEW_MESSAGE:
      return { icon: 'fa-solid fa-comment-dots', color: 'text-blue-500' };
    case NotificationType.NEW_LIKE:
      return { icon: 'fa-solid fa-heart', color: 'text-pink-500' };
    case NotificationType.SUPER_LIKE:
      return { icon: 'fa-solid fa-star', color: 'text-cyan-500' };
    default:
      return { icon: 'fa-solid fa-bell', color: 'text-gray-500' };
  }
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onReadAll }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onClose}>
      <div 
        className="absolute top-16 right-4 sm:right-6 lg:right-8 w-full max-w-sm bg-white rounded-lg shadow-2xl border border-gray-200 animate-slide-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg text-gray-800">Notificações</h3>
          {unreadCount > 0 && (
            <button onClick={onReadAll} className="text-sm text-rose-500 hover:underline">
              Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map(notif => {
                const { icon, color } = getIconForNotification(notif.type);
                return (
                  <li key={notif.id} className={`flex items-start p-4 border-b last:border-b-0 hover:bg-gray-50 ${!notif.read ? 'bg-rose-50/50' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${color} bg-opacity-10 mr-4`}>
                      <i className={`${icon} text-xl ${color}`}></i>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    {!notif.read && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full self-center ml-2"></div>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <i className="fa-solid fa-check-double text-4xl mb-3 text-gray-300"></i>
              <p>Tudo em dia!</p>
              <p className="text-sm">Não há notificações novas.</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in-down { animation: slide-in-down 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default NotificationsPanel;