
import React from 'react';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="py-4 px-6 flex justify-between items-center w-full">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/42eb2bec-e3fe-462c-bff9-1183d6d0ef5f.png" 
          alt="LEVEL3" 
          className="h-10 mr-2" 
        />
      </div>
      
      <div className="flex items-center space-x-8">
        <a href="#tracks" className="text-cyber-green hover:text-cyber-lightgreen transition-colors font-medium">/tracks</a>
        <a href="#program" className="text-cyber-green hover:text-cyber-lightgreen transition-colors font-medium">/program</a>
        <a href="#partners" className="text-cyber-green hover:text-cyber-lightgreen transition-colors font-medium">/partners</a>
        <button className="cyber-button">Apply Now</button>
      </div>
    </nav>
  );
};

export default Navigation;
