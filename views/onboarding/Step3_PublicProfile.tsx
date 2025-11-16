
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { INTERESTS } from '../../constants';
import OnboardingStepLayout from './OnboardingStepLayout';

interface Step3_PublicProfileProps {
  profileData: UserProfile;
  onNext: (updatedData: Partial<UserProfile>) => void;
  onBack: () => void;
  updateProfile: (field: keyof UserProfile, value: any) => void;
}

const BIO_MAX_LENGTH = 500;

const Step3_PublicProfile: React.FC<Step3_PublicProfileProps> = ({ profileData, onNext, onBack, updateProfile }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateProfile(name as keyof UserProfile, value);
  };

  const handleTagToggle = (interest: string) => {
    const newInterests = profileData.interests.includes(interest)
      ? profileData.interests.filter(i => i !== interest)
      : [...profileData.interests, interest];
    updateProfile('interests', newInterests);
  };

  const handleNextClick = () => {
    onNext({
      bio: profileData.bio,
      occupation: profileData.occupation,
      interests: profileData.interests,
    });
  };

  return (
    <OnboardingStepLayout
      title="Fale um pouco sobre você"
      description="Esta parte é opcional, mas ajuda a criar conexões. Você pode editar isso depois."
      onNext={handleNextClick}
      onBack={onBack}
    >
      <div className="mb-4">
        <label htmlFor="bio" className="block text-sm font-bold text-gray-700 mb-1">Minha Biografia</label>
        <textarea
          name="bio"
          id="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          maxLength={BIO_MAX_LENGTH}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          placeholder="O que você gostaria que os outros soubessem sobre você?"
        ></textarea>
        <p className="text-right text-sm text-gray-500 mt-1">{profileData.bio.length}/{BIO_MAX_LENGTH}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="occupation" className="block text-sm font-bold text-gray-700 mb-1">Ocupação</label>
        <input
          type="text"
          name="occupation"
          id="occupation"
          value={profileData.occupation}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          placeholder="Ex: Estudante, Engenheiro, Artista"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">Interesses & Hobbies</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => {
            const isSelected = profileData.interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleTagToggle(interest)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-gray-700 border-gray-300'
                } cursor-pointer hover:bg-rose-100`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
    </OnboardingStepLayout>
  );
};

export default Step3_PublicProfile;
