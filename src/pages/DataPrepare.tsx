
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Code, ChevronLeft, ChevronRight } from "lucide-react";
import '../App.css';

const DataPrepare = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSnippet, setActiveSnippet] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle scroll for parallax effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSnippetToggle = (index: number) => {
    if (activeSnippet === index) {
      setActiveSnippet(null);
    } else {
      setActiveSnippet(index);
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => Math.min(2, prev + 1)); // Assuming max 3 images per snippet
  };

  // Preload images
  React.useEffect(() => {
    codeSnippets.forEach(snippet => {
      if (typeof snippet.image === 'string') {
        const img = new Image();
        img.src = snippet.image;
      } else if (Array.isArray(snippet.image)) {
        snippet.image.forEach(imgSrc => {
          const img = new Image();
          img.src = imgSrc;
        });
      }
    });
  }, []);

  const codeSnippets = [
    {
      type: "Drop",
      color: "#ea384c", // Red
      title: "Drop Track_id and Unamed Columns",
      code: `file = file.loc[:, ~file.columns.str.contains('^Unnamed')]`,
      image: ["/lovable-uploads/before_drop.png", "/lovable-uploads/After_drop.png"]
    },
    {
      type: "Encode",
      color: "#33C3F0", // Blue
      title: "Label Encoding",
      code: `le = LabelEncoder()
file['genre'] = le.fit_transform(file['genre'])
file['artist_name'] = le.fit_transform(file['artist_name'])
file['track_name'] = le.fit_transform(file['artist_name'])`,
      image: ["/lovable-uploads/Before_encode.png", "/lovable-uploads/After_encode.png"]
    },
    {
      type: "Drop",
      color: "#ea384c", // Red
      title: "Drop Year 2023",
      code: "file = file[file['year'] != 2023]",
      image: ["/lovable-uploads/Year_curve.png", "/lovable-uploads/Year-Data-Count.png"]
    },
    {
      type: "Genre",
      color: "#FFC0CB", // Pink
      title: "Genre Impact",
      code: `Most Impacting`,
      image: ["/lovable-uploads/Genre.png", "/lovable-uploads/Genre_balanced.png", "/lovable-uploads/Genre2.png"]
    },
    {
      type: "Catgorize",
      color: "#33C3F0", // Blue
      title: "Category Encoding",
      code: `Encode categorical labels as integers`,
      image: ["/lovable-uploads/Categories.png"]
    },
    {
      type: "Result",
      color: "#5CD8B1", // Green
      title: "Model Result",
      code: `model.fit(X_train, y_train)`,
      image: ["/lovable-uploads/1stPipe.png", "/lovable-uploads/BestRes.png", "/lovable-uploads/1res_met.png"]
    },
    {
      type: "Legend Parameter",
      color: "#FFD700", // Gold
      title: "Legend Parameter",
      code: `weight = ((pr_train == 0).sum()/(pr_train == 1).sum())`,
      image: ["/lovable-uploads/2nd.png", "/lovable-uploads/Unknown.png", "/lovable-uploads/Metrics.png"]
    },
    {
      type: "Extra Result",
      color: "#5CD8B1", // Green
      title: "Model Result after changing the weight",
      code: `model.fit(X_train, y_train)`,
      image: ["/lovable-uploads/3rd.png", "/lovable-uploads/Class_0.png", "/lovable-uploads/class0_met.png"]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Custom Parallax Background */}
      {/* <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png")',
          transform: `translateY(${scrollY * 0.4}px)`,
          filter: 'brightness(0.95)',
        }}
      /> */}
      
      {/* Darkened bottom edge for depth */}
      <div 
        className="fixed bottom-0 left-0 w-full h-[20%] z-0"
        style={{
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
        }}
      />
      
      {/* Content Container */}
      <div className="min-h-screen flex flex-col relative z-10">
        <Navigation />
        
        <main className="flex-1 flex flex-col items-center pt-10 px-6 pb-20">
          <div className="max-w-6xl w-full mx-auto">
            <div className="flex flex-col items-center mb-12">
              <Level3Logo />
              <h2 className="text-3xl font-cyber font-bold mt-8">Data Preparation</h2>
              <p className="text-5CD8B1 mt-2 max-w-2xl text-center">
                Master essential techniques for transforming raw data into machine learning-ready formats
              </p>
            </div>
            
            {/* 2 cards per row grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {codeSnippets.map((snippet, index) => (
                <div key={index} className="w-full mb-6">
                  <Card 
                    className={`w-full backdrop-blur-sm bg-black/40 border border-${snippet.color}/20 text-white shadow-lg transition-transform duration-300 floating-card overflow-hidden`}
                    style={{ 
                      perspective: '1000px',
                      transform: 'perspective(1000px) rotateX(2deg)',
                      height: '280px',
                      position: 'relative',
                    }}
                  >
                    {/* Overlay that fades on hover */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300 group-hover:opacity-0 hover:opacity-0"
                      style={{ 
                        backgroundColor: `${snippet.color}30`, // 30% opacity
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      <div className="text-4xl font-bold mb-4">{snippet.type}</div>
                      <div className="text-xl">{snippet.title}</div>
                    </div>
                    
                    {/* Code preview that's visible on hover */}
                    <CardContent className="p-4 h-full">
                      <h3 className="text-xl font-bold mb-3">{snippet.title}</h3>
                      
                      <div className="rounded-md bg-black/60 p-3 font-mono text-sm mb-4 overflow-x-auto h-[calc(100%-90px)]">
                        <pre className="text-white whitespace-pre-wrap">
                          {snippet.code.split('\n').map((line, i) => (
                            <div key={i} className="leading-relaxed">
                              {line}
                              {/* {line
                                .replace(/(#.*)/g, '<span style="color: #888888">$1</span>')
                                .replace(/\b(df|np|pd)\b/g, '<span style="color: #b8b8b8">$1</span>') 
                                .replace(/\b(from|import)\b/g, '<span style="color: #ab4642">$1</span>') 
                                .replace(/\b(dropna|drop_duplicates|drop|corr|abs|quantile|fit_transform|log1p)\b/g, '<span style="color: #7cafc2">$1</span>') 
                                .replace(/\b(LabelEncoder|OneHotEncoder|MinMaxScaler|sklearn|preprocessing)\b/g, '<span style="color: #a1b56c">$1</span>')
                                .replace(/'[^']*'|"[^"]*"/g, '<span style="color: #f7ca88">$&</span>') 
                                .replace(/\b(\d+(\.\d+)?)\b/g, '<span style="color: #dc9656">$1</span>') 
                                .replace(/(\[|\])/g, '<span style="color: #ba8baf">$1</span>')
                              } */}
                            </div>
                          ))}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Show Full Snippet Button - Updated to match site green color */}
                  <Button 
                    className="mt-2 w-full bg-black/50 border border-white/20 hover:bg-black/70 flex items-center justify-center text-5CD8B1"
                    onClick={() => handleSnippetToggle(index)}
                  >
                    <Code className="mr-2" size={16} />
                    {activeSnippet === index ? 'Hide Full Snippet' : 'Show Full Snippet'}
                  </Button>
                  
                  {/* Inline Image Viewer - Updated for better image display */}
                  {activeSnippet === index && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-bold">{snippet.title} - Full Example</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setActiveSnippet(null)}
                          className="text-white hover:bg-white/10"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                      
                      <div className="relative snippet-image-container">
                        {/* Image container with updated styling for original size display */}
                        <div className="relative overflow-auto max-h-[80vh] max-w-screen overflow-x-auto rounded-md">
                          {Array.isArray(snippet.image) && snippet.image.length > 0 && (
                            <img 
                              src={snippet.image[currentImageIndex]} 
                              alt={`Full code example for ${snippet.title}`}
                              className="w-auto max-w-full h-auto object-contain mx-auto"
                              style={{ maxHeight: "80vh" }}
                            />
                          )}
                        </div>
                        
                        {/* Image navigation controls - only show if there's more than one image */}
                        {Array.isArray(snippet.image) && snippet.image.length > 1 && (
                          <div className="absolute inset-0 flex items-center justify-between px-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handlePrevImage}
                              disabled={currentImageIndex === 0}
                              className="bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
                            >
                              <ChevronLeft size={24} />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleNextImage}
                              disabled={currentImageIndex >= snippet.image.length - 1}
                              className="bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
                            >
                              <ChevronRight size={24} />
                            </Button>
                          </div>
                        )}
                        
                        {/* Image counter */}
                        {Array.isArray(snippet.image) && snippet.image.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-full text-xs text-white">
                            {currentImageIndex + 1} / {snippet.image.length}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <footer className="mt-auto py-6 text-5CD8B1/60 text-sm z-10">
          <div className="container">
            © {new Date().getFullYear()} LEVEL3. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DataPrepare;
