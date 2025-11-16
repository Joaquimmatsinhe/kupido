
import React, { useState, useCallback, useMemo } from 'react';
import { UserProfile, Gender } from '../types';
import { LOCATIONS, INTERESTS, GENDERS } from '../constants';
import ProfileSection from '../components/ProfileSection';
import FormField from '../components/FormField';
import Spinner from '../components/Spinner';
import { View } from '../AuthenticatedApp';
import { ToastType } from '../components/Toast';

interface ProfileViewProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    setActiveView: (view: View) => void;
    onShowToast: (message: string, type: ToastType) => void;
}

const MAX_PHOTOS = 6;
const BIO_MAX_LENGTH = 500;

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


const ProfileView: React.FC<ProfileViewProps> = ({ profile, setProfile, setActiveView, onShowToast }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState('');
  
  const calculatedAge = useMemo(() => calculateAge(profile.dateOfBirth), [profile.dateOfBirth]);

  const handleSave = () => {
      if (profile.name.trim() === '') {
          onShowToast('O nome não pode estar em branco.', 'error');
          return;
      }
      if (profile.photos.length === 0) {
          onShowToast('Você deve ter pelo menos uma foto no perfil.', 'error');
          return;
      }

      setIsSaving(true);

      let profileUpdates: Partial<UserProfile> = {};
      if (newPassword) {
          if (newPassword.length < 6) {
              onShowToast('A nova senha deve ter pelo menos 6 caracteres.', 'error');
              setIsSaving(false);
              return;
          }
          profileUpdates.password = newPassword;
      }

      setProfile(p => ({ ...p, ...profileUpdates }));
      setNewPassword('');

      setTimeout(() => {
        setIsEditing(false);
        setIsSaving(false);
        onShowToast('Perfil salvo com sucesso!', 'success');
      }, 1000);
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  }, [setProfile]);

  const handlePreferencesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({
      ...p,
      preferences: { ...p.preferences, [name]: Number(value) },
    }));
  }, [setProfile]);
  
  const handlePreferenceGenderChange = useCallback((gender: Gender) => {
    setProfile(p => {
      const newGenders = p.preferences.genders.includes(gender)
        ? p.preferences.genders.filter(g => g !== gender)
        : [...p.preferences.genders, gender];
      return { ...p, preferences: { ...p.preferences, genders: newGenders } };
    });
  }, [setProfile]);

  const handleTagToggle = useCallback((interest: string) => {
    setProfile(p => {
      const newInterests = p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest];
      return { ...p, interests: newInterests };
    });
  }, [setProfile]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = MAX_PHOTOS - profile.photos.length;
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            setProfile(p => ({ ...p, photos: [...p.photos, event.target.result as string] }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [profile.photos.length, setProfile]);

  const removePhoto = useCallback((indexToRemove: number) => {
    setProfile(p => ({
      ...p,
      photos: p.photos.filter((_, index) => index !== indexToRemove),
    }));
  }, [setProfile]);
  
  const handleReorderPhoto = useCallback((index: number, direction: 'left' | 'right') => {
    setProfile(p => {
        const newPhotos = [...p.photos];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newPhotos.length) return p;
        [newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]];
        return { ...p, photos: newPhotos };
    });
  }, [setProfile]);

  return (
    <div className="pb-24">
      <ProfileSection title="Minhas Fotos">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {profile.photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={photo} alt={`Foto de perfil ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
              {isEditing && (
                <>
                  <button
                    onClick={() => removePhoto(index)}
                    aria-label="Remover foto"
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                  <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleReorderPhoto(index, 'left')}
                        disabled={index === 0}
                        aria-label="Mover para esquerda"
                        className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                      </button>
                      <button
                        onClick={() => handleReorderPhoto(index, 'right')}
                        disabled={index === profile.photos.length - 1}
                        aria-label="Mover para direita"
                        className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {isEditing && profile.photos.length < MAX_PHOTOS && (
            <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-rose-300 text-rose-400 rounded-lg hover:bg-rose-100 hover:border-rose-400 transition-colors aspect-square">
              <div className="text-center">
                <i className="fa-solid fa-plus text-4xl"></i>
                <span className="block mt-2 text-sm">Adicionar Foto</span>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          )}
        </div>
         {!isEditing && profile.photos.length === 0 && <p className="text-gray-500">Nenhuma foto adicionada.</p>}
      </ProfileSection>

      <ProfileSection title="Informações Básicas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Nome" isEditing={isEditing} displayValue={profile.name}>
            <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
          </FormField>
          <FormField label="Idade" isEditing={false} displayValue={calculatedAge || '--'}>
             <p className="text-gray-500 bg-gray-50 p-3 rounded-md min-h-[44px]">Sua idade é calculada automaticamente.</p>
          </FormField>
          <FormField label="Data de Nascimento" isEditing={isEditing} displayValue={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('pt-BR') : 'Não definido'}>
            <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
          </FormField>
          <FormField label="Gênero" isEditing={isEditing} displayValue={profile.gender}>
            <select name="gender" value={profile.gender} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500">
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </FormField>
           <FormField label="Localização" isEditing={isEditing} displayValue={profile.location}>
            <select name="location" value={profile.location} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500">
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </FormField>
           <FormField label="Email" isEditing={isEditing} displayValue={profile.email}>
            <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
          </FormField>
           <FormField label="Senha" isEditing={isEditing} displayValue="********">
            <input type="password" name="password" placeholder="Nova senha (deixe em branco para não alterar)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
          </FormField>
        </div>
      </ProfileSection>
      
      <ProfileSection title="Perfil Público">
        <FormField label="Biografia / Apresentação" isEditing={isEditing} displayValue={profile.bio}>
          <textarea name="bio" value={profile.bio} onChange={handleInputChange} maxLength={BIO_MAX_LENGTH} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"></textarea>
          {isEditing && <p className="text-right text-sm text-gray-500 mt-1">{profile.bio.length}/{BIO_MAX_LENGTH}</p>}
        </FormField>
        <FormField label="Ocupação" isEditing={isEditing} displayValue={profile.occupation}>
           <input type="text" name="occupation" value={profile.occupation} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"/>
        </FormField>
        <div className="mb-4">
           <label className="block text-sm font-bold text-gray-700 mb-2">Interesses & Hobbies</label>
           <div className="flex flex-wrap gap-2">
             {INTERESTS.map(interest => {
                const isSelected = profile.interests.includes(interest);
                return (
                    <button key={interest} onClick={() => isEditing && handleTagToggle(interest)} disabled={!isEditing}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                            isSelected 
                            ? 'bg-rose-500 text-white border-rose-500' 
                            : 'bg-white text-gray-700 border-gray-300'
                        } ${isEditing ? 'cursor-pointer hover:bg-rose-100' : 'cursor-default'}`}
                    >
                        {interest}
                    </button>
                )
             })}
           </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Preferências de Busca">
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Faixa de Idade</label>
                <div className="flex items-center justify-between text-gray-600">
                    <span>{profile.preferences.minAge} anos</span>
                    <span>{profile.preferences.maxAge} anos</span>
                </div>
                {isEditing && (
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <input type="range" name="minAge" min="18" max="99" value={profile.preferences.minAge} onChange={handlePreferencesChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
                        <input type="range" name="maxAge" min="18" max="99" value={profile.preferences.maxAge} onChange={handlePreferencesChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
                    </div>
                )}
            </div>
            <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Gênero(s) de Interesse</label>
                 <div className="flex flex-wrap gap-2">
                    {GENDERS.map(gender => {
                        const isSelected = profile.preferences.genders.includes(gender);
                        return (
                            <button key={gender} onClick={() => isEditing && handlePreferenceGenderChange(gender)} disabled={!isEditing}
                                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                                    isSelected 
                                    ? 'bg-rose-500 text-white border-rose-500' 
                                    : 'bg-white text-gray-700 border-gray-300'
                                } ${isEditing ? 'cursor-pointer hover:bg-rose-100' : 'cursor-default'}`}
                            >
                                {gender}
                            </button>
                        )
                    })}
                 </div>
            </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Distância Máxima</label>
                <div className="flex items-center justify-between text-gray-600">
                    <span>{profile.preferences.maxDistance} km</span>
                </div>
                {isEditing && (
                     <input type="range" name="maxDistance" min="1" max="500" value={profile.preferences.maxDistance} onChange={handlePreferencesChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-2"/>
                )}
            </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Ajustes">
        <div className="space-y-3">
          <button onClick={() => setActiveView('settings')} className="w-full text-left p-3 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-cog mr-3 w-5 text-center"></i> Ajustes e Privacidade
          </button>
        </div>
      </ProfileSection>

      <div className="sticky bottom-24 bg-transparent py-4 px-4">
        <div className="flex justify-center">
             {isEditing ? (
                <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto bg-rose-500 text-white font-bold py-3 px-12 rounded-full hover:bg-rose-600 transition-transform transform hover:scale-105 shadow-lg flex justify-center items-center disabled:bg-gray-400">
                    {isSaving ? <Spinner /> : <><i className="fa-solid fa-save mr-2"></i> Salvar Perfil</>}
                </button>
             ) : (
                <button onClick={() => setIsEditing(true)} className="w-full md:w-auto bg-gray-700 text-white font-bold py-3 px-12 rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105 shadow-lg">
                    <i className="fa-solid fa-pencil mr-2"></i> Editar Perfil
                </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
