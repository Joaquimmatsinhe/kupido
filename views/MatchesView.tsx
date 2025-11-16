import React from 'react';
import { UserProfile, Message } from '../types';
import ProfileSection from '../components/ProfileSection';

const getConversationId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

interface MatchesViewProps {
  matches: UserProfile[];
  onSelectMatch: (match: UserProfile) => void;
  messagesByConversationId: Record<string, Message[]>;
  currentUser: UserProfile;
}

const MatchesView: React.FC<MatchesViewProps> = ({ matches, onSelectMatch, messagesByConversationId, currentUser }) => {
  return (
    <ProfileSection title={`Suas Conexões (${matches.length})`}>
      {matches.length > 0 ? (
        <div className="space-y-2">
          {matches.map(match => {
            const conversationId = getConversationId(currentUser.id, match.id);
            const conversation = messagesByConversationId[conversationId] || [];
            const lastMessage = conversation[conversation.length - 1];

            return (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="flex items-center p-3 bg-white hover:bg-rose-50 rounded-lg cursor-pointer transition-colors duration-200 shadow-sm border border-gray-100"
              >
                <img src={match.photos[0]} alt={match.name} className="w-16 h-16 object-cover rounded-full mr-4" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-800">{match.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage
                      ? `${lastMessage.senderId === currentUser.id ? 'Você: ' : ''}${lastMessage.text}`
                      : 'Comece a conversa!'}
                  </p>
                </div>
                 <i className="fa-solid fa-chevron-right text-gray-300"></i>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
            <i className="fa-solid fa-comments-dollar text-5xl mb-4 text-rose-300"></i>
            <h3 className="text-xl font-semibold">Ainda sem conexões</h3>
            <p className="mt-2">Continue a explorar na tela "Descobrir" para encontrar seu par perfeito!</p>
        </div>
      )}
    </ProfileSection>
  );
};

export default MatchesView;
