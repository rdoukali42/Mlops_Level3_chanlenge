
import React from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import ChatInterface from '../components/ChatInterface';
import GridBackground from '../components/GridBackground';

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <GridBackground />
      
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full mx-auto">
          <Level3Logo />
          <ChatInterface />
        </div>
      </main>
      
      <footer className="mt-auto py-6 text-5CD8B1/60 text-sm">
        <div className="container">
          © {new Date().getFullYear()} LEVEL3. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Chat;
