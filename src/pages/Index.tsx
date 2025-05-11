
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Level3Logo from '../components/Level3Logo';
import GridBackground from '../components/GridBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import '../App.css';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        
        <main className="flex-1 flex flex-col items-center pt-10 pb-32 px-6">
          <div className="max-w-4xl w-full mx-auto">
            <Level3Logo />
            
            {/* Content Cards */}
            <div className="mt-24 space-y-12 pb-20">
              {/* Regression Methods Card */}
              <Card className="w-full backdrop-blur-sm bg-black/40 border border-5CD8B1/20 text-white shadow-lg transform hover:translate-y-[-5px] transition-transform duration-300" 
                    style={{ 
                      boxShadow: '0 10px 25px -5px rgba(92, 216, 177, 0.2)',
                      perspective: '1000px',
                      transform: 'perspective(1000px) rotateX(2deg)'
                    }}>
                <CardHeader>
                  <CardTitle className="text-5CD8B1">Regression Methods</CardTitle>
                  <CardDescription className="text-white/80">Understanding predictive modeling techniques</CardDescription>
                </CardHeader>
                <CardContent className="text-white/90 leading-relaxed">
                  <p>
                    Regression analysis forms the backbone of predictive modeling, enabling us to understand relationships between variables and make predictions. Linear regression establishes a straight-line relationship between input and output variables, serving as a foundation for more complex approaches. Polynomial regression extends this by fitting curves to data using polynomial equations, capturing non-linear patterns that simple linear models miss.
                  </p>
                  <p className="mt-3">
                    Ridge and Lasso regression introduce regularization techniques to prevent overfitting, particularly valuable with high-dimensional data. Multiple regression incorporates numerous variables simultaneously, while quantile regression focuses on predicting specific percentiles of the response variable distribution rather than just the mean. These methodologies collectively provide data scientists with powerful tools to model continuous outcomes across diverse domains from finance to climate science.
                  </p>
                </CardContent>
              </Card>
              
              {/* Classification & Language Modeling Card */}
              <Card className="w-full backdrop-blur-sm bg-black/40 border border-5CD8B1/20 text-white shadow-lg transform hover:translate-y-[-5px] transition-transform duration-300" 
                    style={{ 
                      boxShadow: '0 10px 25px -5px rgba(92, 216, 177, 0.2)',
                      perspective: '1000px',
                      transform: 'perspective(1000px) rotateX(2deg)'
                    }}>
                <CardHeader>
                  <CardTitle className="text-5CD8B1">Classification & Language Modeling</CardTitle>
                  <CardDescription className="text-white/80">From simple categorization to complex NLP</CardDescription>
                </CardHeader>
                <CardContent className="text-white/90 leading-relaxed">
                  <p>
                    Classification algorithms power countless applications that categorize data into discrete classes. Logistic regression, despite its name, handles binary classification by modeling probability distributions. Decision trees partition data through a series of branching decisions, offering interpretability that more complex algorithms often lack. Random forests and gradient-boosted trees enhance accuracy by combining multiple decision trees into powerful ensemble models.
                  </p>
                  <p className="mt-3">
                    Language modeling has been revolutionized by transformer architectures, which have largely supplanted earlier RNN and LSTM approaches. Transformers use self-attention mechanisms to process entire sequences simultaneously rather than sequentially, enabling unprecedented performance in translation, summarization, and text generation. Models like BERT and GPT leverage these architectures with billions of parameters trained on massive text corpora, capturing nuanced semantic relationships and generating increasingly human-like responses.
                  </p>
                </CardContent>
              </Card>
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

export default Index;
