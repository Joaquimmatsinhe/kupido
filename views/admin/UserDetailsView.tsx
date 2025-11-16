
import React from 'react';
import { UserProfile, VerificationStatus } from '../../types';
import ProfileSection from '../../components/ProfileSection';

interface UserDetailsViewProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
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
};

const UserDetailsView: React.FC<UserDetailsViewProps> = ({ user, onClose, onUpdateUser }) => {
    
  const handleStatusChange = (status: VerificationStatus) => {
    onUpdateUser({ ...user, verificationStatus: status });
  };

  const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-bold text-gray-600">{label}</p>
        <p className="text-gray-800">{value || '-'}</p>
    </div>
  );
  
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onClose}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Detalhes de {user.name}</h2>
          <button onClick={onClose} className="text-gray-500 p-2 rounded-full hover:bg-gray-200">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
            <ProfileSection title="Moderação">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-600">Status de Verificação</p>
                        <p className="text-gray-800 font-semibold">{user.verificationStatus}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleStatusChange(VerificationStatus.Verified)} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300" disabled={user.verificationStatus === VerificationStatus.Verified}>Aprovar</button>
                        <button onClick={() => handleStatusChange(VerificationStatus.NotVerified)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300" disabled={user.verificationStatus === VerificationStatus.NotVerified}>Rejeitar/Bloquear</button>
                    </div>
                </div>
            </ProfileSection>

            <ProfileSection title="Fotos">
                <div className="grid grid-cols-3 gap-2">
                    {user.photos.map((photo, index) => (
                        <img key={index} src={photo} alt={`Foto ${index+1}`} className="w-full aspect-square object-cover rounded-md"/>
                    ))}
                    {user.photos.length === 0 && <p className="text-gray-500 col-span-3">Nenhuma foto.</p>}
                </div>
            </ProfileSection>
            
            <ProfileSection title="Informações do Perfil">
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Nome" value={user.name} />
                    <DetailItem label="Idade" value={calculateAge(user.dateOfBirth)} />
                    <DetailItem label="Email" value={user.email} />
                    <DetailItem label="Gênero" value={user.gender} />
                    <DetailItem label="Localização" value={user.location} />
                    <DetailItem label="Ocupação" value={user.occupation} />
                    <DetailItem label="Data de Registro" value={new Date(user.registrationDate).toLocaleString('pt-BR')} />
                    <DetailItem label="ID do Usuário" value={<span className="text-xs font-mono">{user.id}</span>} />
                </div>
                <div className="mt-4">
                     <DetailItem label="Bio" value={user.bio} />
                </div>
                <div className="mt-4">
                    <p className="text-sm font-bold text-gray-600 mb-1">Interesses</p>
                    <div className="flex flex-wrap gap-2">
                        {user.interests.map(interest => <span key={interest} className="bg-rose-100 text-rose-800 text-sm px-3 py-1 rounded-full">{interest}</span>)}
                    </div>
                </div>
            </ProfileSection>

            <ProfileSection title="Histórico de Atividade (Simulado)">
                 <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><i className="fa-solid fa-right-to-bracket w-6 text-gray-400"></i>Último login: Hoje, às 14:32</li>
                    <li className="flex items-center"><i className="fa-solid fa-heart w-6 text-gray-400"></i>32 matches no total</li>
                    <li className="flex items-center"><i className="fa-solid fa-comments w-6 text-gray-400"></i>184 mensagens enviadas</li>
                 </ul>
            </ProfileSection>
            
            <ProfileSection title="Histórico de Denúncias (Simulado)">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Denúncias Recebidas</p>
                        <p className="text-2xl font-bold text-red-500">2</p>
                    </div>
                     <div>
                        <p className="font-semibold">Denúncias Feitas</p>
                        <p className="text-2xl font-bold text-gray-700">0</p>
                    </div>
                </div>
            </ProfileSection>

        </div>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

export default UserDetailsView;
