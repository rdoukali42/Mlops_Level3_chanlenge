import React, { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import Navigation from '../components/Navigation';
import GridBackground from '../components/GridBackground';
import { toast } from '@/components/ui/sonner';

const ChatWithMe = () => {
  useEffect(() => {
    try {
      createChat({
        webhookUrl: 'https://rofex2.app.n8n.cloud/webhook/898255f2-ef09-4845-a1e6-00229105e8ab/chat',
	mode: 'fullscreen',
	initialMessages: [
		'Hi there! 👋',
		'My name is Reda. How can I assist you today?'
	],
      });
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      toast.error("Failed to initialize chat. Please refresh the page.");
    }
    
    // Clean up function
    return () => {
      // Remove n8n chat elements when component unmounts
      const chatElements = document.querySelectorAll('.n8n-chat-widget');
      chatElements.forEach(element => element.remove());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <GridBackground />
      <Navigation />
      
      <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-10 px-4">
        <div className="w-full max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-[#5CD8B1] text-center mb-6">Chat with Me</h1>
          <div className="backdrop-blur-sm bg-black/40 border border-[#5CD8B1]/20 p-6 rounded-lg shadow-lg">
            <p className="text-white/90 mb-4 text-center">
              Use the chat widget in the bottom right corner to start a conversation. 
              The chat interface will automatically connect to our AI assistant.
            </p>
          </div>
        </div>
        
        {/* This div serves as a container for the n8n chat which will be inserted by the createChat function */}
        <div id="chat-container" className="w-full h-full"></div>
      </div>
      
      <footer className="mt-auto py-6 text-[#5CD8B1]/60 text-sm z-10">
        <div className="container">
          © {new Date().getFullYear()} LEVEL3. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ChatWithMe;
