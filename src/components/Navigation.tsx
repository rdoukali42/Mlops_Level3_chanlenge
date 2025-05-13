
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import useMobile from '@/hooks/use-mobile';
import Level3Logo from './Level3Logo';

const Navigation = () => {
  const location = useLocation();
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/data', label: 'Data' },
    { to: '/data_prepare', label: 'Data Prepare' },
    { to: '/model', label: 'Model' },
    { to: '/chat', label: 'Chat' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-[#5CD8B1]' : 'hover:text-[#5CD8B1] transition-colors';
  };

  const handleSheetOpen = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <header className="bg-[var(--color-background)]/30 border-[var(--color-surface)] font-mono px-6 text-[var(--color-text)] backdrop-blur-xs border-b fixed left-0 py-3 right-0 shadow-md top-0 z-100 z-[100]">
      <div className="flex items-center max-w-7xl mx-auto justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center font-cyber font-bold text-xl"
          >
            <div className="w-10 h-10">
              <Level3Logo />
            </div>
            <span className="mlops-caption ml-2">MLOps</span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#111] backdrop-blur-md border-[#222]">
              <nav className="flex flex-col gap-4 pt-8">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-lg font-cyber ${isActive(link.to)}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-cyber ${isActive(link.to)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
