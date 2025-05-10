
import React, { useRef, useEffect } from 'react';
import { MessageItem } from './types';

interface MessageListProps {
  messages: MessageItem[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="h-96 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.type === 'user'
                ? 'bg-cyber-green/20 text-white border border-cyber-green/40'
                : message.type === 'system'
                ? 'bg-orange-950/60 text-orange-200 border border-orange-500/40'
                : 'bg-black/60 text-cyber-green border border-cyber-green/20'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-black/60 text-cyber-green border border-cyber-green/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
