
import React, { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import MessageList from './chat/MessageList';
import FileUploader from './chat/FileUploader';
import MessageInput from './chat/MessageInput';
import { MessageItem } from './chat/types';
import { 
  sendChatMessage, 
  checkChatResponse, 
  uploadFile, 
  checkFileUploadResponse 
} from './chat/apiService';

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageItem[]>([
    { id: '0', type: 'assistant', content: 'Hello! I am your AI assistant. You can chat with me or upload files for analysis.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    const newUserMessage = { id: Date.now().toString(), type: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const result = await sendChatMessage(inputMessage);
      
      if (result.status === 'error') {
        toast.error(result.message || "Failed to send message");
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          type: 'system', 
          content: `⚠️ ${result.message || "Connection error: Could not reach the assistant. Please try again in a moment."}` 
        }]);
        setIsLoading(false);
        return;
      }
      
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
        const responseContent = await checkChatResponse();
        
        if (responseContent) {
          setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: responseContent }]);
          setIsListening(false);
          setIsLoading(false);
          return;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadProgress(20); // Initial progress for better UX
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: `Uploading file: ${file.name}` }]);
    
    try {
      // Update progress for UX purposes
      const updateProgress = () => {
        const progressSteps = [40, 60, 80];
        let currentStep = 0;
        
        const interval = setInterval(() => {
          if (currentStep < progressSteps.length) {
            setUploadProgress(progressSteps[currentStep]);
            currentStep++;
          } else {
            clearInterval(interval);
          }
        }, 800);
        
        return () => clearInterval(interval);
      };
      
      const progressUpdater = updateProgress();
      
      // Upload the file
      const result = await uploadFile(file);
      
      // Set final progress regardless of outcome
      setUploadProgress(100);
      
      // Clear the progress updater
      progressUpdater();
      
      // Handle file upload result
      if (result.status === 'error') {
        toast.error(result.message);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          type: 'system', 
          content: `⚠️ Upload failed: ${result.message}` 
        }]);
        setIsUploading(false);
        setUploadProgress(0);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          type: 'assistant', 
          content: result.message 
        }]);
        
        // Start polling for response
        setIsListening(true);
        startPollingForFileResponse();
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        type: 'system', 
        content: `⚠️ Upload failed: ${error instanceof Error ? error.message : "Could not upload your file. The service might be unavailable."}` 
      }]);
      setIsUploading(false);
      setUploadProgress(0);
    }
    
    // Reset the file input
    e.target.value = '';
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
        const responseContent = await checkFileUploadResponse();
        
        if (responseContent) {
          setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: responseContent }]);
          setIsListening(false);
          setIsUploading(false);
          setUploadProgress(0);
          return;
        }
        
        attempts++;
        setTimeout(checkUploadResponse, 5000); // Check every 5 seconds
      } catch (error) {
        console.error("Error checking file processing:", error);
        attempts++;
        
        // If we've had multiple failures, stop polling
        if (attempts > 3) {
          setIsListening(false);
          setIsUploading(false);
          setUploadProgress(0);
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

  return (
    <div className="max-w-2xl w-full mx-auto mt-12 bg-black/40 border border-5CD8B1/30 rounded-lg overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-5CD8B1/30">
        <h2 className="text-5CD8B1 text-xl font-cyber">AI Assistant</h2>
      </div>
      
      <MessageList 
        messages={messages}
        isLoading={isLoading}
      />
      
      <div className="p-4 border-t border-5CD8B1/30">
        <div className="flex space-x-2">
          <FileUploader
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            disabled={isLoading || isUploading}
          />
          
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            disabled={isLoading || isUploading}
          />
        </div>
        
        <div className="mt-2 text-xs text-5CD8B1/50 flex justify-between">
          {isListening && <span>Waiting for response...</span>}
          {connectionRetries > 0 && <span>Connection issues detected. Retrying...</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
