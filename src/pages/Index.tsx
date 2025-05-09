
import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import TechChecklist from '../components/TechChecklist';
import GridBackground from '../components/GridBackground';
import '../App.css';

const Index = () => {
  useEffect(() => {
    // This simulates the RGB shift effect mentioned in the example
    const handleLogoEffect = () => {
      const logoElement = document.querySelector('.glitch-container img');
      if (!logoElement) return;
      
      // Apply additional visual effects here if needed
      console.log('Logo effects initialized');
    };
    
    handleLogoEffect();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <GridBackground />
      
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full mx-auto">
          <Level3Logo />
          
          <TechChecklist />
        </div>
      </main>
      
      <footer className="mt-auto py-6 text-cyber-green/60 text-sm">
        <div className="container">
          © {new Date().getFullYear()} LEVEL3. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
