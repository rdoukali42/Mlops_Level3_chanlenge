
import React, { useRef, useEffect } from 'react';

interface ComingSoonProps {
  text: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ text }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    // Simulate RGB shift with custom animation
    const applyRgbShift = () => {
      const texts = textElement.querySelectorAll('div');
      
      texts.forEach((txt, index) => {
        if (index === 0) return; // Skip the main text
        
        // Create random shift values
        const xShift = Math.random() * 6 - 3;
        const yShift = Math.random() * 6 - 3;
        
        if (index === 1) {
          txt.style.transform = `translate(${xShift}px, ${yShift}px)`;
        } else if (index === 2) {
          txt.style.transform = `translate(${-xShift}px, ${-yShift}px)`;
        } else {
          txt.style.transform = `translate(${yShift}px, ${-xShift}px)`;
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
    <div className="glitch-container my-16" ref={textRef}>
      <div className="text-6xl font-cyber font-bold text-white/90 glitch-image">
        {text}
      </div>
      <div className="text-6xl font-cyber font-bold text-transparent glitch-image-1" aria-hidden="true">
        {text}
      </div>
      <div className="text-6xl font-cyber font-bold text-transparent glitch-image-2" aria-hidden="true">
        {text}
      </div>
      <div className="text-6xl font-cyber font-bold text-transparent glitch-image-3" aria-hidden="true">
        {text}
      </div>
    </div>
  );
};

export default ComingSoon;
