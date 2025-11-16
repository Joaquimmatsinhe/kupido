import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message } from '../types';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import MoreOptionsMenu from '../components/MoreOptionsMenu';

interface ChatViewProps {
  match: UserProfile;
  messages: Message[];
  currentUser: UserProfile;
  onSendMessage: (text: string) => void;
  onBack: () => void;
  isTyping: boolean;
  onBlock: (user: UserProfile) => void;
  onReport: (user: UserProfile) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ match, messages, currentUser, onSendMessage, onBack, isTyping, onBlock, onReport }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="absolute inset-0 bg-white rounded-xl shadow-lg flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
        <button onClick={onBack} className="text-rose-500 p-2 rounded-full hover:bg-rose-100">
          <i className="fa-solid fa-chevron-left fa-lg"></i>
        </button>
        <img src={match.photos[0]} alt={match.name} className="w-10 h-10 object-cover rounded-full mx-3" />
        <h2 className="font-bold text-lg text-gray-800 flex-grow">{match.name}</h2>
        <MoreOptionsMenu onBlock={() => onBlock(match)} onReport={() => onReport(match)} buttonColor="text-gray-500" />
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-rose-50/20">
        <div className="space-y-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === currentUser.id} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-gray-200 rounded-b-xl shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-rose-500 focus:border-rose-500 transition"
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
            className="bg-rose-500 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0 hover:bg-rose-600 transition-transform transform hover:scale-110 disabled:bg-gray-300"
            disabled={!inputText.trim()}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatView;