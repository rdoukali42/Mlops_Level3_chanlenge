
import React from 'react';
import { Link } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="py-4 px-6 flex justify-between items-center w-full">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/42eb2bec-e3fe-462c-bff9-1183d6d0ef5f.png" 
            alt="LEVEL3" 
            className="h-10 mr-2" 
          />
          <span className="text-5CD8B1 font-cyber font-bold">MLOps</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-8">
       <Link to="/data" className="text-white hover:text-[#5CD8B1] hover:opacity-80 transition-all font-medium">/Data</Link>
        <Link to="/data_prepare" className="text-white hover:text-[#5CD8B1] hover:opacity-80 transition-all font-medium">/Data_Prepare</Link>
        <Link to="/model" className="text-white hover:text-[#5CD8B1] hover:opacity-80 transition-all font-medium">/Model</Link>
        <Link to="/chat" className="text-white hover:text-[#5CD8B1] hover:opacity-80 transition-all font-medium">/Chat</Link>
        <Link to="/chat_with_me" className="text-white hover:text-[#5CD8B1] hover:opacity-80 transition-all font-medium">/Chat_with_me</Link>
      </div>
    </nav>
  );
};

export default Navigation;
