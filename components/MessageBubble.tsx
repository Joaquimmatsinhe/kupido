import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  const bubbleClasses = isMe
    ? 'bg-rose-500 text-white self-end rounded-br-none'
    : 'bg-gray-200 text-gray-800 self-start rounded-bl-none';
  
  const containerClasses = isMe ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={containerClasses}>
      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${bubbleClasses}`}>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
