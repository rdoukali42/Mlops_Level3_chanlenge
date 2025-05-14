
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  disabled: boolean;
}

const MessageInput = ({ inputMessage, setInputMessage, handleSendMessage, disabled }: MessageInputProps) => {
  return (
    <form onSubmit={handleSendMessage} className="flex space-x-2">
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 bg-transparent border-5CD8B1/50 text-5CD8B1 focus-visible:ring-5CD8B1/30 focus-visible:border-5CD8B1"
      />
      
      <Button
        type="submit"
        disabled={!inputMessage.trim() || disabled}
        variant="outline"
        size="icon"
        className="border border-5CD8B1/50 text-5CD8B1 hover:bg-5CD8B1/20"
        title="Send message"
      >
        <Send size={18} />
      </Button>
    </form>
  );
};

export default MessageInput;
