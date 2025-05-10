
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Upload, Mic } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
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
  const [connectionRetries, setConnectionRetries] = useState(0);
  
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
      
      // The response was successful, now listen for a response
      setConnectionRetries(0);
      setIsListening(true);
      startPollingForResponse();
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      toast.error("Failed to send your message. The API service might be unavailable.");
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        type: 'system', 
        content: "⚠️ Connection error: Could not reach the assistant. Please try again in a moment." 
      }]);
    }
  };

  const startPollingForResponse = async () => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    const checkResponse = async () => {
      if (attempts >= maxAttempts) {
        handlePollingTimeout();
        return;
      }

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
        setTimeout(checkResponse, 5000); // Check every 5 seconds
      } catch (error) {
        console.error("Error checking response:", error);
        attempts++;
        
        // If we've had multiple failures, stop polling
        if (attempts > 3) {
          setIsListening(false);
          setIsLoading(false);
          toast.error("Error receiving response from the model");
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            type: 'system', 
            content: "⚠️ Connection lost: Could not retrieve the response. The assistant might be unavailable." 
          }]);
        } else {
          // Try again after a delay
          setTimeout(checkResponse, 5000);
        }
      }
    };
    
    checkResponse();
  };

  const handlePollingTimeout = () => {
    setIsListening(false);
    setIsLoading(false);
    toast.error("Response time exceeded, please try again");
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'system', 
      content: "⏱️ Timeout: The assistant took too long to respond. Please try again." 
    }]);
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
          startPollingForFileResponse();
        } else {
          handleUploadError();
        }
      };
      
      xhr.onerror = handleUploadError;
      xhr.ontimeout = handleUploadError;
      
      xhr.open('POST', 'https://rofex2.app.n8n.cloud/webhook-test/f821caa1-159d-4354-a7f2-b639c34f0b72', true);
      xhr.timeout = 30000; // 30 seconds timeout
      xhr.send(formData);
    } catch (error) {
      handleUploadError();
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const startPollingForFileResponse = async () => {
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    
    const checkUploadResponse = async () => {
      if (attempts >= maxAttempts) {
        handlePollingTimeout();
        return;
      }

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
        setTimeout(checkUploadResponse, 5000); // Check every 5 seconds
      } catch (error) {
        console.error("Error checking file processing:", error);
        attempts++;
        
        // If we've had multiple failures, stop polling
        if (attempts > 3) {
          setIsListening(false);
          toast.error("Error receiving file analysis");
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            type: 'system', 
            content: "⚠️ Connection issue: Could not retrieve the file analysis. The service might be unavailable." 
          }]);
        } else {
          // Try again after a delay
          setTimeout(checkUploadResponse, 5000);
        }
      }
    };
    
    checkUploadResponse();
  };
  
  const handleUploadError = () => {
    console.error("Error uploading file");
    setIsUploading(false);
    setUploadProgress(0);
    toast.error("Failed to upload file");
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'system', 
      content: "⚠️ Upload failed: Could not upload your file. The service might be unavailable." 
    }]);
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
                  : message.type === 'system'
                  ? 'bg-orange-950/60 text-orange-200 border border-orange-500/40'
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
          <div className="w-full space-y-2">
            <Progress value={uploadProgress} className="h-2 bg-gray-800 border border-cyber-green/20">
              <div 
                className="h-full bg-cyber-green rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </Progress>
            <span className="text-xs text-cyber-green/70">Uploading: {uploadProgress}%</span>
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
            title="Upload file"
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
            title="Send message"
          >
            <Send size={18} />
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-cyber-green/50 flex justify-between">
          {isListening && <span>Waiting for response...</span>}
          {connectionRetries > 0 && <span>Connection issues detected. Retrying...</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
