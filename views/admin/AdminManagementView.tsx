
import React, { useState, useMemo } from 'react';
import { UserProfile, Gender, VerificationStatus } from '../../types';
import ProfileSection from '../../components/ProfileSection';
import { ToastType } from '../../components/Toast';
import Spinner from '../../components/Spinner';

interface AdminManagementViewProps {
  allUsers: UserProfile[];
  setAllUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  onShowToast: (message: string, type: ToastType) => void;
}

const AdminManagementView: React.FC<AdminManagementViewProps> = ({ allUsers, setAllUsers, onShowToast }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adminUsers = useMemo(() => {
    return allUsers.filter(user => user.isAdmin);
  }, [allUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Formato de email inválido.');
      return;
    }
    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (allUsers.some(user => user.email === formData.email)) {
      setError('Este email já está em uso.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newAdmin: UserProfile = {
        id: `admin-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: true,
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: Gender.PreferNotToSay,
        location: 'Sede',
        photos: [],
        bio: 'Conta de administrador.',
        occupation: 'Administrador',
        interests: [],
        preferences: { minAge: 18, maxAge: 99, genders: [], maxDistance: 500 },
        registrationDate: new Date().toISOString(),
        verificationStatus: VerificationStatus.Verified,
      };

      setAllUsers(prevUsers => [...prevUsers, newAdmin]);
      onShowToast('Novo administrador cadastrado com sucesso!', 'success');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Clear form
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileSection title="Administradores Atuais">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Nome</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map(admin => (
                <tr key={admin.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{new Date(admin.registrationDate).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProfileSection>

      <ProfileSection title="Cadastrar Novo Administrador">
        <form onSubmit={handleRegisterAdmin} className="space-y-4 max-w-lg">
          {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha Temporária</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Senha</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-rose-500 text-white font-bold py-2 px-6 rounded-full hover:bg-rose-600 transition-colors flex items-center justify-center disabled:bg-gray-400"
          >
            {isLoading ? <Spinner size="sm" /> : <><i className="fa-solid fa-plus mr-2"></i> Cadastrar Administrador</>}
          </button>
        </form>
      </ProfileSection>
    </div>
  );
};

export default AdminManagementView;
