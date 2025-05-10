
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
      await sendChatMessage(inputMessage);
      
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
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: `Uploading file: ${file.name}` }]);
    
    // Upload the file with progress tracking
    uploadFile(
      file,
      (progress) => setUploadProgress(progress),
      (successMessage) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', content: successMessage }]);
        setIsUploading(false);
        setUploadProgress(0);
        
        // Start polling for response
        setIsListening(true);
        startPollingForFileResponse();
      },
      (error) => handleUploadError(error)
    );
    
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
  
  const handleUploadError = (error: Error) => {
    console.error("Error uploading file:", error);
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
      
      <MessageList 
        messages={messages}
        isLoading={isLoading}
      />
      
      <div className="p-4 border-t border-cyber-green/30">
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
        
        <div className="mt-2 text-xs text-cyber-green/50 flex justify-between">
          {isListening && <span>Waiting for response...</span>}
          {connectionRetries > 0 && <span>Connection issues detected. Retrying...</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
