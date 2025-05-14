
import React from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import GridBackground from '../components/GridBackground';
import Form from '../components/Form';

const Model = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden [perspective:1px]">
  {/* Background Container */}
  <div className="fixed inset-0 [transform:translateZ(-1px)_scale(2)] z-0">
    <img 
      src="/lovable-uploads/bg.jpg" 
      className="w-full h-full object-cover"
      alt="Background" 
    />
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

      {/* <GridBackground /> */}
      
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full mx-auto">
          <Level3Logo />
          <Form />
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

export default Model;
