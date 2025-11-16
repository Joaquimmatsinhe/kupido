
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import OnboardingStepLayout from './OnboardingStepLayout';

interface Step2_PhotosProps {
  profileData: UserProfile;
  onNext: (updatedData: Partial<UserProfile>) => void;
  onBack: () => void;
  updateProfile: (field: 'photos', value: string[]) => void;
}

const MAX_PHOTOS = 6;

const Step2_Photos: React.FC<Step2_PhotosProps> = ({ profileData, onNext, onBack, updateProfile }) => {
  const [error, setError] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = MAX_PHOTOS - profileData.photos.length;
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            updateProfile('photos', [...profileData.photos, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (indexToRemove: number) => {
    updateProfile('photos', profileData.photos.filter((_, index) => index !== indexToRemove));
  };
  
  const handleNextClick = () => {
      if (profileData.photos.length === 0) {
          setError('Adicione pelo menos uma foto para continuar.');
          return;
      }
      onNext({ photos: profileData.photos });
  }

  const isNextDisabled = profileData.photos.length === 0;

  return (
    <OnboardingStepLayout
      title="Mostre o seu melhor ângulo"
      description="Adicione pelo menos uma foto. Perfis com fotos recebem 10x mais atenção!"
      onNext={handleNextClick}
      onBack={onBack}
      isNextDisabled={isNextDisabled}
    >
      {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
      
      <div className="grid grid-cols-3 gap-3">
        {profileData.photos.map((photo, index) => (
          <div key={index} className="relative group aspect-square">
            <img src={photo} alt={`Sua foto ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
            <button
              onClick={() => removePhoto(index)}
              aria-label="Remover foto"
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fa-solid fa-times text-sm"></i>
            </button>
          </div>
        ))}

        {profileData.photos.length < MAX_PHOTOS && (
          <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-rose-300 text-rose-400 rounded-lg hover:bg-rose-100 hover:border-rose-400 transition-colors aspect-square">
            <div className="text-center">
              <i className="fa-solid fa-plus text-3xl"></i>
              <span className="block mt-1 text-xs">Adicionar</span>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        )}
      </div>
    </OnboardingStepLayout>
  );
};

export default Step2_Photos;
