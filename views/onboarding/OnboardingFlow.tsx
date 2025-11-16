
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import StepProgressBar from './StepProgressBar';
import Step1_BasicInfo from './Step1_BasicInfo';
import Step2_Photos from './Step2_Photos';
import Step3_PublicProfile from './Step3_PublicProfile';
import Step4_Preferences from './Step4_Preferences';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onOnboardingComplete: (completedProfile: UserProfile) => void;
}

const TOTAL_STEPS = 4;

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ initialProfile, onOnboardingComplete }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<UserProfile>(initialProfile);

  useEffect(() => {
    // Persist profile data in case the user leaves mid-onboarding
    try {
        localStorage.setItem('kupido-onboarding-profile', JSON.stringify(profileData));
    } catch (e) {
        console.error("Could not save onboarding profile to local storage", e);
    }
  }, [profileData]);

  const handleNext = (updatedData: Partial<UserProfile>) => {
    const newProfileData = { ...profileData, ...updatedData };
    setProfileData(newProfileData);
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      onOnboardingComplete(newProfileData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  
  const updatePreferences = (field: keyof UserProfile['preferences'], value: any) => {
      setProfileData(prev => ({
          ...prev,
          preferences: {
              ...prev.preferences,
              [field]: value,
          }
      }));
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1_BasicInfo
            profileData={profileData}
            onNext={handleNext}
          />
        );
      case 2:
         return (
             <Step2_Photos 
                profileData={profileData}
                onNext={handleNext}
                onBack={handleBack}
                updateProfile={updateProfile}
             />
         );
      case 3:
         return (
            <Step3_PublicProfile
                profileData={profileData}
                onNext={handleNext}
                onBack={handleBack}
                updateProfile={updateProfile}
            />
         );
      case 4:
         return (
             <Step4_Preferences 
                profileData={profileData}
                onNext={handleNext}
                onBack={handleBack}
                updatePreferences={updatePreferences}
             />
         );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg mx-auto">
        <StepProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in-up">
          {renderStep()}
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;
