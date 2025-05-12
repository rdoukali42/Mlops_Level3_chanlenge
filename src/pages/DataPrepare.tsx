
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Code, Database, FileCode } from "lucide-react";
import '../App.css';

const DataPrepare = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSnippet, setActiveSnippet] = useState<number | null>(null);

  // Handle scroll for parallax effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSnippetToggle = (index: number) => {
    setActiveSnippet(activeSnippet === index ? null : index);
  };

  const codeSnippets = [
    {
      type: "Drop",
      color: "#ea384c", // Red
      title: "Drop Missing Values",
      code: `# Drop rows with missing values\ndf = df.dropna()\n# or for specific columns\ndf = df.dropna(subset=['column1', 'column2'])`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "ADD",
      color: "#5CD8B1", // Green
      title: "Add New Features",
      code: `# Create new feature from existing ones\ndf['new_feature'] = df['feature1'] + df['feature2']\n# Apply mathematical transformation\ndf['log_feature'] = np.log1p(df['numeric_feature'])`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "Encode",
      color: "#33C3F0", // Blue
      title: "One-Hot Encoding",
      code: `# One-hot encode categorical variables\ndf_encoded = pd.get_dummies(df, columns=['category_col'])\n# or using scikit-learn\nfrom sklearn.preprocessing import OneHotEncoder`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "Encode",
      color: "#33C3F0", // Blue
      title: "Label Encoding",
      code: `# Encode categorical labels as integers\nfrom sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\ndf['encoded_col'] = le.fit_transform(df['category_col'])`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "Drop",
      color: "#ea384c", // Red
      title: "Drop Duplicates",
      code: `# Remove duplicate rows\ndf = df.drop_duplicates()\n# Based on specific columns\ndf = df.drop_duplicates(subset=['col1', 'col2'])`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "ADD",
      color: "#5CD8B1", // Green
      title: "Normalize Data",
      code: `# Min-max scaling\nfrom sklearn.preprocessing import MinMaxScaler\nscaler = MinMaxScaler()\ndf[['feat1', 'feat2']] = scaler.fit_transform(df[['feat1', 'feat2']])`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "Drop",
      color: "#ea384c", // Red
      title: "Drop Outliers",
      code: `# Remove outliers using IQR\nQ1 = df['column'].quantile(0.25)\nQ3 = df['column'].quantile(0.75)\nIQR = Q3 - Q1\ndf = df[(df['column'] >= Q1 - 1.5 * IQR) & (df['column'] <= Q3 + 1.5 * IQR)]`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    },
    {
      type: "Drop",
      color: "#ea384c", // Red
      title: "Drop Unnecessary Features",
      code: `# Drop columns that are not needed\ndf = df.drop(['unused_column1', 'unused_column2'], axis=1)\n# Drop columns with high correlation\ncorr_matrix = df.corr().abs()\nhigh_corr_var = np.where(corr_matrix > 0.8)`,
      image: "/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Custom Parallax Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("/lovable-uploads/6b52ffb9-d78f-4eb8-9ecb-4544f135ba94.png")',
          transform: `translateY(${scrollY * 0.4}px)`,
          filter: 'brightness(0.95)',
        }}
      />
      
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
              <h2 className="text-3xl font-cyber font-bold text-white mt-8">Data Preparation</h2>
              <p className="text-5CD8B1 mt-2 max-w-2xl text-center">
                Master essential techniques for transforming raw data into machine learning-ready formats
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {codeSnippets.map((snippet, index) => (
                <Card 
                  key={index} 
                  className={`w-full backdrop-blur-sm bg-black/40 border border-${snippet.color}/20 text-white shadow-lg transform hover:translate-y-[-5px] transition-transform duration-300 floating-card overflow-hidden`}
                  style={{ 
                    perspective: '1000px',
                    transform: 'perspective(1000px) rotateX(2deg)',
                    height: activeSnippet === index ? 'auto' : '280px',
                    position: 'relative',
                  }}
                >
                  {activeSnippet !== index && (
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300"
                      style={{ 
                        backgroundColor: `${snippet.color}30`, // 30% opacity
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      <div className="text-4xl font-bold mb-4">{snippet.type}</div>
                      <div className="text-xl">{snippet.title}</div>
                      <Button 
                        onClick={() => handleSnippetToggle(index)} 
                        className="mt-4 bg-black/50 border border-white/20 hover:bg-black/70"
                      >
                        <Code className="mr-2" size={16} />
                        Show Code Snippet
                      </Button>
                    </div>
                  )}
                  
                  <CardContent className={`p-4 ${activeSnippet === index ? 'block' : 'hidden'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl text-white font-bold">{snippet.title}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSnippetToggle(index)}
                        className="text-white hover:bg-white/10"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                    
                    <div className="rounded-md bg-black/60 p-3 font-mono text-sm mb-4 overflow-x-auto">
                      <pre className="text-white whitespace-pre-wrap">
                        {snippet.code.split('\n').map((line, i) => (
                          <div key={i} className="leading-relaxed">
                            {line.replace(/(#.*)/g, '<span style="color: #888">$1</span>')
                              .replace(/\b(df|np|pd|from|import|sklearn|preprocessing)\b/g, '<span style="color: #5CD8B1">$1</span>')
                              .replace(/\b(fit_transform|dropna|drop_duplicates|drop|corr|abs|quantile)\b/g, '<span style="color: #f59e0b">$1</span>')
                              .replace(/\b(LabelEncoder|OneHotEncoder|MinMaxScaler)\b/g, '<span style="color: #818cf8">$1</span>')
                            }
                          </div>
                        ))}
                      </pre>
                    </div>
                    
                    <Button 
                      className="w-full bg-black/50 border border-white/20 hover:bg-black/70 flex items-center justify-center"
                      onClick={() => window.open(snippet.image, '_blank')}
                    >
                      <FileCode className="mr-2" size={16} />
                      Show Full Code Example
                    </Button>
                  </CardContent>
                </Card>
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
