
import React, { useEffect, useRef } from 'react';

const Level3Logo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logoElement = logoRef.current;
    if (!logoElement) return;

    // Simulate RGB shift with custom animation
    const applyRgbShift = () => {
      const images = logoElement.querySelectorAll('img');
      
      // Apply different transformations to each image layer
      images.forEach((img, index) => {
        if (index === 0) return; // Skip the main image
        
        // Create random shift values
        const xShift = Math.random() * 6 - 3;
        const yShift = Math.random() * 6 - 3;
        
        // Apply different shifts based on image layer
        if (index === 1) {
          img.style.transform = `translate(${xShift}px, ${yShift}px)`;
        } else if (index === 2) {
          img.style.transform = `translate(${-xShift}px, ${-yShift}px)`;
        } else {
          img.style.transform = `translate(${yShift}px, ${-xShift}px)`;
        }
      });
    };

    // Apply initial RGB shift
    applyRgbShift();
    
    // Set interval for continuous RGB shift effect
    const interval = setInterval(applyRgbShift, 150);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="glitch-container my-8" ref={logoRef}>
        <img 
          src="/lovable-uploads/42eb2bec-e3fe-462c-bff9-1183d6d0ef5f.png" 
          alt="LEVEL3" 
          className="glitch-image w-full max-w-[500px] h-auto logo-rgb-shift"
        />
        <img 
          src="/lovable-uploads/42eb2bec-e3fe-462c-bff9-1183d6d0ef5f.png" 
          alt="" 
          aria-hidden="true"
          className="glitch-image-1 w-full max-w-[500px] h-auto"
        />
        <img 
          src="/lovable-uploads/42eb2bec-e3fe-462c-bff9-1183d6d0ef5f.png" 
          alt="" 
          aria-hidden="true"
          className="glitch-image-2 w-full max-w-[500px] h-auto"
        />
        <img 
          src="/lovable-uploads/42eb2bec-e3fe-462c-bff9-1183d6d0ef5f.png" 
          alt="" 
          aria-hidden="true"
          className="glitch-image-3 w-full max-w-[500px] h-auto"
        />
      </div>
      <div className="mlops-caption glitch-container -mt-4">
        <span className="glitch-image">MLOps</span>
        <span className="glitch-image-1">MLOps</span>
        <span className="glitch-image-2">MLOps</span>
        <span className="glitch-image-3">MLOps</span>
      </div>
    </div>
  );
};

export default Level3Logo;
