
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', type: 'assistant', content: 'Hello! I am your AI assistant. You can chat with me or upload files for analysis.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    const newUserMessage = { id: Date.now().toString(), type: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Post the user message to the endpoint
      const response = await fetch("https://rofex2.app.n8n.cloud/webhook-test/b4c4dc8d-5f18-43f8-a2e3-45f45074dcb6", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setIsListening(true);
      
      // Poll for response
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes (5 * 60) with 5-second intervals
      
      const checkResponse = async () => {
        try {
          const getResponse = await fetch("https://rofex2.app.n8n.cloud/webhook-test/b4c4dc8d-5f18-43f8-a2e3-45f45074dcb6", {
            method: 'GET'
          });
          
          if (getResponse.ok) {
            const data = await getResponse.text();
            if (data && data !== 'Processing') {
              setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: data }]);
              setIsListening(false);
              setIsLoading(false);
              return;
            }
          }
          
          attempts++;
          
          if (attempts < maxAttempts) {
            setTimeout(checkResponse, 5000); // Check every 5 seconds
          } else {
            setIsListening(false);
            setIsLoading(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: 'Sorry, I didn\'t receive a response in time.' }]);
          }
        } catch (error) {
          console.error("Error checking response:", error);
          setIsListening(false);
          setIsLoading(false);
          toast.error("Error receiving response from the model");
        }
      };
      
      checkResponse();
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      toast.error("Failed to send your message");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: `Uploading file: ${file.name}` }]);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Upload the file with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = async () => {
        if (xhr.status === 200) {
          toast.success("File uploaded successfully");
          setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: 'File uploaded. Processing...' }]);
          setIsUploading(false);
          setUploadProgress(0);
          
          // Start polling for response
          setIsListening(true);
          
          let attempts = 0;
          const maxAttempts = 120; // 10 minutes with 5-second intervals
          
          const checkUploadResponse = async () => {
            try {
              const getResponse = await fetch("https://rofex2.app.n8n.cloud/webhook-test/f821caa1-159d-4354-a7f2-b639c34f0b72", {
                method: 'GET'
              });
              
              if (getResponse.ok) {
                const data = await getResponse.text();
                if (data && data !== 'Processing') {
                  setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: data }]);
                  setIsListening(false);
                  return;
                }
              }
              
              attempts++;
              
              if (attempts < maxAttempts) {
                setTimeout(checkUploadResponse, 5000); // Check every 5 seconds
              } else {
                setIsListening(false);
                setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: 'Sorry, processing your file took longer than expected.' }]);
              }
            } catch (error) {
              console.error("Error checking file processing:", error);
              setIsListening(false);
              toast.error("Error receiving file analysis");
            }
          };
          
          checkUploadResponse();
        } else {
          handleUploadError();
        }
      };
      
      xhr.onerror = handleUploadError;
      
      xhr.open('POST', 'https://rofex2.app.n8n.cloud/webhook-test/f821caa1-159d-4354-a7f2-b639c34f0b72', true);
      xhr.send(formData);
    } catch (error) {
      handleUploadError();
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUploadError = () => {
    console.error("Error uploading file");
    setIsUploading(false);
    setUploadProgress(0);
    toast.error("Failed to upload file");
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-12 bg-black/40 border border-cyber-green/30 rounded-lg overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-cyber-green/30">
        <h2 className="text-cyber-green text-xl font-cyber">AI Assistant</h2>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-cyber-green/20 text-white border border-cyber-green/40'
                  : 'bg-black/60 text-cyber-green border border-cyber-green/20'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-black/60 text-cyber-green border border-cyber-green/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div 
              className="bg-cyber-green h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-cyber-green/30">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUploadClick}
            disabled={isUploading || isLoading}
            className="border border-cyber-green/50 text-cyber-green hover:bg-cyber-green/20"
          >
            <Upload size={18} />
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading || isUploading}
            className="flex-1 bg-transparent border-cyber-green/50 text-white focus-visible:ring-cyber-green/30 focus-visible:border-cyber-green"
          />
          
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading || isUploading}
            variant="outline"
            size="icon"
            className="border border-cyber-green/50 text-cyber-green hover:bg-cyber-green/20"
          >
            <Send size={18} />
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-cyber-green/50 flex justify-between">
          {isListening && <span>Listening for response...</span>}
          {(isUploading || uploadProgress > 0) && <span>Upload: {uploadProgress}%</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
