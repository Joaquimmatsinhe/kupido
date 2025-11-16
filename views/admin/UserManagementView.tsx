
import React, { useState, useMemo, useCallback } from 'react';
import { UserProfile, VerificationStatus } from '../../types';
import { LOCATIONS } from '../../constants';
import { ToastType } from '../../components/Toast';
import UserDetailsView from './UserDetailsView';

interface UserManagementViewProps {
  allUsers: UserProfile[];
  setAllUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  onShowToast: (message: string, type: ToastType) => void;
}

const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const birthday = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age > 0 ? age : 0;
}

const VerificationStatusPill: React.FC<{ status: VerificationStatus }> = ({ status }) => {
    const statusMap = {
        [VerificationStatus.Verified]: { text: 'Verificado', classes: 'bg-green-100 text-green-800' },
        [VerificationStatus.Pending]: { text: 'Pendente', classes: 'bg-yellow-100 text-yellow-800' },
        [VerificationStatus.NotVerified]: { text: 'Não Verificado', classes: 'bg-red-100 text-red-800' },
    };
    const { text, classes } = statusMap[status] || { text: 'Desconhecido', classes: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

const UserManagementView: React.FC<UserManagementViewProps> = ({ allUsers, setAllUsers, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    verificationStatus: '',
  });
  const [selectedUserIds, setSelectedUserIds] = useState(new Set<string>());
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower);
      const matchesLocation = !filters.location || user.location === filters.location;
      const matchesStatus = !filters.verificationStatus || user.verificationStatus === filters.verificationStatus;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [allUsers, searchTerm, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleSelectUser = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleBatchAction = (status: VerificationStatus) => {
    if (selectedUserIds.size === 0) return;
    setAllUsers(prevUsers =>
      prevUsers.map(user =>
        selectedUserIds.has(user.id) ? { ...user, verificationStatus: status } : user
      )
    );
    const actionText = status === VerificationStatus.Verified ? 'verificados' : 'bloqueados';
    onShowToast(`${selectedUserIds.size} usuários ${actionText}.`, 'success');
    setSelectedUserIds(new Set());
  };
  
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, email, ID..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 md:col-span-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select name="location" value={filters.location} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500">
          <option value="">Todas Localizações</option>
          {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <select name="verificationStatus" value={filters.verificationStatus} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500">
          <option value="">Todos Status</option>
          {Object.values(VerificationStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {selectedUserIds.size > 0 && (
        <div className="bg-rose-50 p-3 rounded-md mb-4 flex items-center gap-4">
            <p className="text-sm font-medium text-rose-700">{selectedUserIds.size} usuários selecionados</p>
            <button onClick={() => handleBatchAction(VerificationStatus.Verified)} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
                <i className="fa-solid fa-check mr-2"></i>Verificar
            </button>
            <button onClick={() => handleBatchAction(VerificationStatus.NotVerified)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                <i className="fa-solid fa-ban mr-2"></i>Bloquear
            </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0} /></th>
                    <th scope="col" className="px-6 py-3">Nome</th>
                    <th scope="col" className="px-6 py-3">Localização</th>
                    <th scope="col" className="px-6 py-3">Idade</th>
                    <th scope="col" className="px-6 py-3">Data Registro</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.map(user => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4"><input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={() => handleSelectUser(user.id)} /></td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="font-bold">{user.name || "Não definido"}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">{user.location}</td>
                        <td className="px-6 py-4">{calculateAge(user.dateOfBirth)}</td>
                        <td className="px-6 py-4">{new Date(user.registrationDate).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4"><VerificationStatusPill status={user.verificationStatus} /></td>
                        <td className="px-6 py-4">
                            <button onClick={() => setViewingUser(user)} className="font-medium text-rose-600 hover:underline">Ver Detalhes</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum usuário encontrado.</p>}
      </div>
      {viewingUser && <UserDetailsView user={viewingUser} onClose={() => setViewingUser(null)} onUpdateUser={handleUpdateUser} />}
    </div>
  );
};

export default UserManagementView;
