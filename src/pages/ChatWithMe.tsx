
import React, { useEffect } from 'react';
import '@n8n/chat/style.css';
import '../chat.css';
import { createChat } from '@n8n/chat';
import { toast } from '@/components/ui/sonner';

const ChatWithMe = () => {
  useEffect(() => {
    try {
      createChat({
        webhookUrl: 'https://rofex2.app.n8n.cloud/webhook/898255f2-ef09-4845-a1e6-00229105e8ab/chat',
        target: '#n8n-chat',
        mode: 'window',
        initialMessages: [
          'How can I assist you today?'
        ],
        i18n: {
          en: {
            title: 'Hi there! 👋',
            subtitle: "",
            footer: '',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your question..',
            closeButtonTooltip: 'Close Chat',
          },
        },
      });
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      toast.error("Failed to initialize chat. Please refresh the page.");
    }

    // Clean up on unmount
    return () => {
      const chatElements = document.querySelectorAll('.n8n-chat-widget');
      chatElements.forEach(element => element.remove());
    };
  }, []);

  return <div id="n8n-chat" />;
};

export default ChatWithMe;
