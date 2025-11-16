
import React, { useState } from 'react';
import { UserProfile, Message } from '../../types';
import DashboardView from './DashboardView';
import UserManagementView from './UserManagementView';
import ContentAnalysisView from './ContentAnalysisView';
import { ToastType } from '../../components/Toast';
import AdminManagementView from './AdminManagementView';

interface AdminViewProps {
  allUsers: UserProfile[];
  setAllUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  messagesByConversationId: Record<string, Message[]>;
  onBack: () => void;
  onShowToast: (message: string, type: ToastType) => void;
}

type AdminTab = 'dashboard' | 'users' | 'content' | 'admins';

const AdminView: React.FC<AdminViewProps> = ({ allUsers, setAllUsers, messagesByConversationId, onBack, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div className="pb-8 animate-fade-in bg-gray-50 -mx-4 -mt-2 px-4 py-4 min-h-screen">
      <div className="flex items-center justify-between pt-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard do Administrador</h1>
        <button
          onClick={onBack}
          className="bg-rose-500 text-white font-bold py-2 px-4 rounded-full hover:bg-rose-600 transition-colors text-sm"
        >
          <i className="fa-solid fa-right-from-bracket mr-2"></i>
          Sair
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'users'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gestão de Usuários
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'content'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Análise de Conteúdo
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'admins'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Administradores
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'dashboard' && (
          <DashboardView allUsers={allUsers} messagesByConversationId={messagesByConversationId} />
        )}
        {activeTab === 'users' && (
          <UserManagementView allUsers={allUsers} setAllUsers={setAllUsers} onShowToast={onShowToast} />
        )}
        {activeTab === 'content' && (
          <ContentAnalysisView allUsers={allUsers} messagesByConversationId={messagesByConversationId} />
        )}
        {activeTab === 'admins' && (
          <AdminManagementView allUsers={allUsers} setAllUsers={setAllUsers} onShowToast={onShowToast} />
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminView;
