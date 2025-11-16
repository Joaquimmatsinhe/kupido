
import React, { useState, useEffect } from 'react';
import { UserProfile, Gender } from '../../types';
import { LOCATIONS, GENDERS } from '../../constants';
import OnboardingStepLayout from './OnboardingStepLayout';

interface Step1_BasicInfoProps {
  profileData: UserProfile;
  onNext: (updatedData: Partial<UserProfile>) => void;
}

const Step1_BasicInfo: React.FC<Step1_BasicInfoProps> = ({ profileData, onNext }) => {
  const [localData, setLocalData] = useState({
    name: profileData.name,
    dateOfBirth: profileData.dateOfBirth,
    gender: profileData.gender,
    location: profileData.location,
  });
  const [error, setError] = useState('');

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const birthday = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleNextClick = () => {
    setError('');
    if (!localData.name.trim()) {
      setError('Por favor, insira o seu nome.');
      return;
    }
    if (!localData.dateOfBirth) {
      setError('Por favor, selecione a sua data de nascimento.');
      return;
    }
    const age = calculateAge(localData.dateOfBirth);
    if (age < 18) {
      setError('Você deve ter pelo menos 18 anos para usar o Kupido.');
      return;
    }
    if (!localData.location) {
      setError('Por favor, selecione a sua localização.');
      return;
    }
    onNext(localData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };
  
  const isNextDisabled = !localData.name || !localData.dateOfBirth || !localData.location;

  return (
    <OnboardingStepLayout
      title="Vamos começar pelo básico"
      description="Estas informações nos ajudarão a criar seu perfil."
      onNext={handleNextClick}
      isNextDisabled={isNextDisabled}
    >
      {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
        <input
          type="text"
          name="name"
          id="name"
          value={localData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          placeholder="Como você se chama?"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="dateOfBirth" className="block text-sm font-bold text-gray-700 mb-1">Data de Nascimento</label>
        <input
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={localData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gender" className="block text-sm font-bold text-gray-700 mb-1">Gênero</label>
        <select
          name="gender"
          id="gender"
          value={localData.gender}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
        >
          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-1">Onde você mora?</label>
        <select
          name="location"
          id="location"
          value={localData.location}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
        >
          <option value="">Selecione uma cidade</option>
          {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>
    </OnboardingStepLayout>
  );
};

export default Step1_BasicInfo;
