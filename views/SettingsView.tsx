import React from 'react';
import { NotificationSettings, PrivacySettings } from '../types';
import ProfileSection from '../components/ProfileSection';
import ToggleSwitch from '../components/ToggleSwitch';

interface SettingsViewProps {
  onBack: () => void;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  onPrivacySettingsChange: (settings: PrivacySettings) => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onLogoutRequest: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  onBack, 
  notificationSettings, 
  privacySettings,
  onSettingsChange, 
  onPrivacySettingsChange,
  onDeactivate, 
  onDelete,
  onLogoutRequest
}) => {
  
  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    onSettingsChange({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    onPrivacySettingsChange({
      ...privacySettings,
      [key]: !privacySettings[key],
    });
  };

  return (
    <div className="pb-8 animate-slide-in-right">
      <div className="flex items-center pt-4 mb-4">
        <button onClick={onBack} className="text-rose-500 p-2 rounded-full hover:bg-rose-100 mr-2">
          <i className="fa-solid fa-chevron-left fa-lg"></i>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Ajustes e Privacidade</h1>
      </div>
      
      <ProfileSection title="Preferências de Notificação">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label htmlFor="new-matches" className="text-gray-700">Novos Matches</label>
                <ToggleSwitch id="new-matches" checked={notificationSettings.newMatches} onChange={() => handleNotificationToggle('newMatches')} />
            </div>
            <div className="flex justify-between items-center">
                <label htmlFor="new-messages" className="text-gray-700">Novas Mensagens</label>
                 <ToggleSwitch id="new-messages" checked={notificationSettings.newMessages} onChange={() => handleNotificationToggle('newMessages')} />
            </div>
            <div className="flex justify-between items-center">
                <label htmlFor="new-likes" className="text-gray-700">Novas Curtidas</label>
                 <ToggleSwitch id="new-likes" checked={notificationSettings.newLikes} onChange={() => handleNotificationToggle('newLikes')} />
            </div>
            <div className="flex justify-between items-center">
                <label htmlFor="super-likes" className="text-gray-700">Super Likes</label>
                 <ToggleSwitch id="super-likes" checked={notificationSettings.superLikes} onChange={() => handleNotificationToggle('superLikes')} />
            </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Privacidade">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <label htmlFor="profile-visible" className="text-gray-700 font-medium">Tornar meu perfil visível</label>
                    <p className="text-sm text-gray-500">Se desativado, seu perfil não será mostrado a ninguém na área "Descobrir".</p>
                </div>
                <ToggleSwitch id="profile-visible" checked={privacySettings.isProfileVisible} onChange={() => handlePrivacyToggle('isProfileVisible')} />
            </div>
        </div>
      </ProfileSection>
      
      <ProfileSection title="Gestão de Conta">
          <div className="space-y-4">
              <button onClick={onLogoutRequest} className="w-full text-left p-3 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                 <i className="fa-solid fa-right-from-bracket mr-3 w-5 text-center"></i> Sair da Conta
              </button>
              <button onClick={onDeactivate} className="w-full text-left p-3 rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors">
                 <i className="fa-solid fa-moon mr-3 w-5 text-center"></i> Desativar conta temporariamente
              </button>
              <button onClick={onDelete} className="w-full text-left p-3 rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors">
                  <i className="fa-solid fa-trash-can mr-3 w-5 text-center"></i> Deletar conta permanentemente
              </button>
          </div>
      </ProfileSection>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SettingsView;