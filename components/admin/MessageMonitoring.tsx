import React, { useState, useMemo } from 'react';
import { UserProfile, Message } from '../../types';
import MessageBubble from '../MessageBubble';

interface MessageMonitoringProps {
  allUsers: UserProfile[];
  messagesByConversationId: Record<string, Message[]>; // Note: This is per-user data, simulation is needed for a global view.
}

interface Conversation {
  id: string;
  participants: UserProfile[];
  messages: Message[];
}

const SUSPICIOUS_KEYWORDS = ['dinheiro', 'pix', 'venda', 'comprar', 'cripto', 'investimento', 'sugar daddy', 'patrocínio'];

// Helper to find a user by ID
const findUser = (id: string, allUsers: UserProfile[]) => allUsers.find(u => u.id === id);

const MessageMonitoring: React.FC<MessageMonitoringProps> = ({ allUsers }) => {
  const [keywordFilter, setKeywordFilter] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // SIMULATE global conversations for demonstration
  const conversations = useMemo<Conversation[]>(() => {
    if (allUsers.length < 4) return [];
    
    const user1 = allUsers[0];
    const user2 = allUsers[1];
    const user3 = allUsers[2];
    const user4 = allUsers[3];
    
    return [
      {
        id: 'conv1',
        participants: [user1, user2],
        messages: [
          { id: 'm1', senderId: user1.id, text: 'Olá, tudo bem?', timestamp: new Date() },
          { id: 'm2', senderId: user2.id, text: 'Tudo ótimo! E com vc?', timestamp: new Date() },
        ],
      },
      {
        id: 'conv2',
        participants: [user3, user4],
        messages: [
          { id: 'm3', senderId: user3.id, text: 'Oi, gostei do seu perfil. Você aceita pix para sair?', timestamp: new Date() },
          { id: 'm4', senderId: user4.id, text: 'O quê? Claro que não.', timestamp: new Date() },
          { id: 'm5', senderId: user3.id, text: 'Qual é o problema? Só quero um patrocínio', timestamp: new Date() },
        ],
      },
       {
        id: 'conv3',
        participants: [user1, user3],
        messages: [
          { id: 'm6', senderId: user1.id, text: 'Vamos falar de investimento?', timestamp: new Date() },
        ],
      },
    ].filter(c => c.participants[0] && c.participants[1]); // Ensure participants exist
  }, [allUsers]);

  const filteredConversations = useMemo(() => {
    if (!keywordFilter) return conversations;
    const keywords = SUSPICIOUS_KEYWORDS.map(k => k.toLowerCase());
    return conversations.filter(conv => 
      conv.messages.some(msg => 
        keywords.some(keyword => msg.text.toLowerCase().includes(keyword))
      )
    );
  }, [conversations, keywordFilter]);

  const ChatModal: React.FC<{ conversation: Conversation; onClose: () => void }> = ({ conversation, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b font-bold text-gray-800">
                Conversa entre {conversation.participants[0].name} & {conversation.participants[1].name}
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-rose-50/20 space-y-4">
                {conversation.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === conversation.participants[0].id} />
                ))}
            </div>
             <div className="p-2 bg-gray-50 border-t text-center text-xs text-gray-500">
                Visualização apenas para moderação.
            </div>
        </div>
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <select
          value={keywordFilter}
          onChange={e => setKeywordFilter(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
        >
          <option value="">Mostrar Todas as Conversas</option>
          <option value="suspicious">Filtrar por Palavras-Chave Suspeitas</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Participantes</th>
                    <th scope="col" className="px-6 py-3">Última Mensagem</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {filteredConversations.map(conv => {
                    const lastMessage = conv.messages[conv.messages.length - 1];
                    const sender = findUser(lastMessage.senderId, allUsers);
                    return (
                        <tr key={conv.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {conv.participants.map(p => p.name).join(' & ')}
                            </td>
                            <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                                <strong>{sender?.name.split(' ')[0]}:</strong> {lastMessage.text}
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => setSelectedConversation(conv)} className="font-medium text-rose-600 hover:underline">
                                    Ver Chat
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        {filteredConversations.length === 0 && (
            <p className="text-center text-gray-500 py-8">
                {keywordFilter ? 'Nenhuma conversa suspeita encontrada.' : 'Nenhuma conversa para exibir.'}
            </p>
        )}
      </div>

      {selectedConversation && <ChatModal conversation={selectedConversation} onClose={() => setSelectedConversation(null)} />}
    </div>
  );
};

export default MessageMonitoring;
