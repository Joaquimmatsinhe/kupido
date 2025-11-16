import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 text-gray-800 self-start rounded-2xl rounded-bl-none p-3 shadow-sm">
        <div className="flex items-center space-x-1">
          <span className="typing-dot"></span>
          <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
          <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
       <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1.0);
          }
        }
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #9ca3af;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
