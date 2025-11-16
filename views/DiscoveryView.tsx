
import React from 'react';
import { UserProfile } from '../types';
import ProfileCard from '../components/ProfileCard';

interface DiscoveryViewProps {
  profiles: UserProfile[];
  onLike: (user: UserProfile) => void;
  onPass: (userId: string) => void;
  onBlock: (user: UserProfile) => void;
  onReport: (user: UserProfile) => void;
  onSuperLike: (user: UserProfile) => void;
  superLikesRemaining: number;
}

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ profiles, onLike, onPass, onBlock, onReport, onSuperLike, superLikesRemaining }) => {
  const currentProfile = profiles[0];

  const handleLikeClick = () => {
    if (currentProfile) onLike(currentProfile);
  };

  const handlePassClick = () => {
    if (currentProfile) onPass(currentProfile.id);
  };
  
  const handleSuperLikeClick = () => {
    if (currentProfile) onSuperLike(currentProfile);
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] pt-16 relative">
      {currentProfile ? (
        <>
          <div className="w-full max-w-sm h-[60vh] relative flex items-center justify-center">
             <ProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipeRight={handleLikeClick}
                onSwipeLeft={handlePassClick}
                onBlock={() => onBlock(currentProfile)}
                onReport={() => onReport(currentProfile)}
                isSuperLiked={currentProfile.hasSuperLikedYou}
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePassClick}
              aria-label="Pular perfil"
              className="bg-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-yellow-500 hover:bg-yellow-100 transition-all transform hover:scale-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-times text-3xl"></i>
            </button>
            <button
              onClick={handleSuperLikeClick}
              aria-label="Super Like"
              disabled={superLikesRemaining <= 0}
              className="bg-white rounded-full shadow-lg w-20 h-20 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-all transform hover:scale-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-star text-4xl"></i>
            </button>
            <button
              onClick={handleLikeClick}
              aria-label="Curtir perfil"
              className="bg-white rounded-full shadow-lg w-24 h-24 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-all transform hover:scale-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-heart text-5xl"></i>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 p-8 bg-white/50 rounded-lg">
          <i className="fa-solid fa-users-slash text-5xl mb-4 text-rose-300"></i>
          <h2 className="text-2xl font-bold">É tudo por agora!</h2>
          <p className="mt-2">Você viu todos os perfis disponíveis. Tente ajustar suas preferências ou volte mais tarde.</p>
        </div>
      )}
    </div>
  );
};

export default DiscoveryView;
