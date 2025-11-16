
import React, { useState } from 'react';
import { UserProfile, Gender } from '../../types';
import { GENDERS } from '../../constants';
import OnboardingStepLayout from './OnboardingStepLayout';

interface Step4_PreferencesProps {
  profileData: UserProfile;
  onNext: (updatedData: Partial<UserProfile>) => void;
  onBack: () => void;
  updatePreferences: (field: keyof UserProfile['preferences'], value: any) => void;
}

const Step4_Preferences: React.FC<Step4_PreferencesProps> = ({ profileData, onNext, onBack, updatePreferences }) => {
  
  const handlePreferenceGenderChange = (gender: Gender) => {
    const currentGenders = profileData.preferences.genders;
    const newGenders = currentGenders.includes(gender)
      ? currentGenders.filter(g => g !== gender)
      : [...currentGenders, gender];
    updatePreferences('genders', newGenders);
  };
  
  const handleNextClick = () => {
    onNext({ preferences: profileData.preferences });
  };
  
  const isNextDisabled = profileData.preferences.genders.length === 0;

  return (
    <OnboardingStepLayout
      title="O que você procura?"
      description="Defina suas preferências para encontrar as pessoas certas."
      onNext={handleNextClick}
      onBack={onBack}
      nextButtonText="Começar a Usar o Kupido!"
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Faixa de Idade</label>
          <div className="flex items-center justify-between text-gray-600 px-2">
            <span>{profileData.preferences.minAge} anos</span>
            <span>{profileData.preferences.maxAge} anos</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <input
              type="range"
              name="minAge"
              min="18"
              max="99"
              value={profileData.preferences.minAge}
              onChange={(e) => updatePreferences('minAge', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <input
              type="range"
              name="maxAge"
              min="18"
              max="99"
              value={profileData.preferences.maxAge}
              onChange={(e) => updatePreferences('maxAge', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tenho interesse em</label>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map(gender => {
              const isSelected = profileData.preferences.genders.includes(gender);
              return (
                <button
                  key={gender}
                  onClick={() => handlePreferenceGenderChange(gender)}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  } cursor-pointer hover:bg-rose-100`}
                >
                  {gender}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Distância Máxima</label>
          <div className="flex items-center justify-between text-gray-600 px-2">
            <span>{profileData.preferences.maxDistance} km</span>
          </div>
          <input
            type="range"
            name="maxDistance"
            min="1"
            max="500"
            value={profileData.preferences.maxDistance}
            onChange={(e) => updatePreferences('maxDistance', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-2"
          />
        </div>
      </div>
    </OnboardingStepLayout>
  );
};

export default Step4_Preferences;
