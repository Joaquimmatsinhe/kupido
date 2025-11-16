import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import MoreOptionsMenu from './MoreOptionsMenu';

interface ProfileCardProps {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onBlock: () => void;
  onReport: () => void;
  isSuperLiked?: boolean;
}

const SWIPE_THRESHOLD = 120; // pixels

const calculateAge = (dateOfBirth: string): number => {
    const birthday = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipeLeft, onSwipeRight, onBlock, onReport, isSuperLiked }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX, y: clientY };
    if (cardRef.current) {
        cardRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    const rotation = deltaX * 0.1;

    setPosition({ x: deltaX, y: deltaY, rotation });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease-out';
    }

    if (position.x > SWIPE_THRESHOLD) {
      onSwipeRight();
    } else if (position.x < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    } else {
      setPosition({ x: 0, y: 0, rotation: 0 });
    }
  };
  
  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
  };

  return (
    <div
      ref={cardRef}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={cardStyle}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className={`p-1.5 rounded-2xl shadow-2xl transition-all duration-300 ${isSuperLiked ? 'bg-gradient-to-br from-blue-400 to-cyan-400' : 'bg-transparent'}`}>
        <div className="relative w-full h-full rounded-xl overflow-hidden select-none bg-gray-200">
            <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
            
             {isSuperLiked && (
                <div className="absolute top-4 left-4 text-white bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <i className="fa-solid fa-star mr-2"></i>DEU-TE UM SUPER LIKE
                </div>
             )}

            <div className="absolute top-4 right-4 z-10">
                <MoreOptionsMenu onBlock={onBlock} onReport={onReport} />
            </div>

            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                {/* FIX: Calculate age from dateOfBirth because the 'age' property does not exist on the UserProfile type. */}
                <h2 className="text-3xl font-bold">{profile.name}, <span className="font-light">{calculateAge(profile.dateOfBirth)}</span></h2>
                <p className="mt-1 text-lg">{profile.occupation}</p>
                <p className="mt-2 text-base opacity-90 line-clamp-2">{profile.bio}</p>
            </div>
            {isDragging && (
                 <>
                    <div className={`absolute top-8 left-8 text-green-400 border-4 border-green-400 rounded-lg px-6 py-2 text-4xl font-bold transform -rotate-15 transition-opacity ${position.x > 30 ? 'opacity-100' : 'opacity-0'}`}>
                        LIKE
                    </div>
                    <div className={`absolute top-8 right-8 text-red-500 border-4 border-red-500 rounded-lg px-6 py-2 text-4xl font-bold transform rotate-15 transition-opacity ${position.x < -30 ? 'opacity-100' : 'opacity-0'}`}>
                        PASS
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;