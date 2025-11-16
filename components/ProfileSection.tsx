
import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-rose-800 mb-4 border-b border-rose-100 pb-2">{title}</h2>
      {children}
    </div>
  );
};

export default ProfileSection;
