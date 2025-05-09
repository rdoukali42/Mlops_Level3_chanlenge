
import React from 'react';
import { Check } from 'lucide-react';

interface ChecklistItem {
  text: string;
  checked: boolean;
  highlight?: string;
}

const TechChecklist = () => {
  const items: ChecklistItem[] = [
    {
      text: "comfortable in multiple programming languages?",
      checked: true
    },
    {
      text: "using the terminal without fear?",
      checked: true
    },
    {
      text: "looking for a challenge?",
      checked: true
    },
    {
      text: "an expert in ",
      checked: false,
      highlight: "MLOps?"
    }
  ];

  return (
    <div className="max-w-lg mx-auto mt-12 text-left">
      <h2 className="text-cyber-green text-3xl mb-6 font-cyber font-medium">You are ...</h2>
      <ul className="space-y-5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-4 mt-1">
              {item.checked ? (
                <div className="w-5 h-5 flex items-center justify-center border border-cyber-green bg-cyber-green/20">
                  <Check size={16} className="text-cyber-green" />
                </div>
              ) : (
                <div className="w-5 h-5 border border-cyber-green"></div>
              )}
            </div>
            <div className="text-white text-lg">
              {item.text}
              {item.highlight && (
                <span className="text-cyber-green font-medium">{item.highlight}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechChecklist;
