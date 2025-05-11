
import { toast } from "@/components/ui/sonner";
import { MessageActionResult, FileUploadActionResult } from "./types";

const MESSAGE_API_ENDPOINT = "https://rofex2.app.n8n.cloud/webhook-test/b4c4dc8d-5f18-43f8-a2e3-45f45074dcb6";
const FILE_API_ENDPOINT = "https://rofex2.app.n8n.cloud/webhook-test/f821caa1-159d-4354-a7f2-b639c34f0b72";
const FETCH_TIMEOUT = 300000; // 5 minutes in milliseconds

export async function sendChatMessage(message: string): Promise<MessageActionResult> {
  if (!message || message.trim() === '') {
    return { status: 'error', message: 'Message cannot be empty.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(MESSAGE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error response.');
      console.error(`API Error ${response.status}: ${errorText}`);
      return { status: 'error', message: `API Error: ${response.status}. ${errorText}`, userMessage: message };
    }
    
    return { status: 'success', userMessage: message };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Request timed out in sendChatMessage:', error);
      return { status: 'error', message: 'The request timed out. Please try again.', userMessage: message };
    }
    console.error('Network or unexpected error in sendChatMessage:', error);
    return { status: 'error', message: error instanceof Error ? error.message : 'An unknown error occurred.', userMessage: message };
  }
}

export async function checkChatResponse(): Promise<string | null> {
  try {
    const response = await fetch(MESSAGE_API_ENDPOINT, { method: 'GET' });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    if (data && data !== 'Processing') {
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(data);
        
        // Handle array format
        if (Array.isArray(jsonData)) {
          if (jsonData[0]?.output) {
            return jsonData[0].output;
          }
        } 
        
        // Handle object format
        if (typeof jsonData === 'object') {
          const content = jsonData.output || jsonData.message || jsonData.generatedText || jsonData.text;
          if (content) {
            return content;
          }
        }
        
        // If we couldn't extract content from JSON, return the stringified JSON
        return JSON.stringify(jsonData);
      } catch (e) {
        // If parsing fails, return the raw text
        return data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error checking response:", error);
    throw error;
  }
}

export async function uploadFile(file: File): Promise<FileUploadActionResult> {
  if (!file) {
    return { status: 'error', message: 'No file provided.' };
  }

  const formData = new FormData();
  formData.append('file', file, file.name);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(FILE_API_ENDPOINT, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // Content-Type is automatically set by fetch for FormData
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error response.');
      console.error(`Upload API Error ${response.status}: ${errorText}`);
      return { status: 'error', message: `Upload API Error: ${response.status}. ${errorText}`, fileName: file.name };
    }
    
    toast.success(`File "${file.name}" uploaded successfully`);
    return { 
      status: 'success', 
      message: `File "${file.name}" uploaded successfully. The AI will process it shortly.`, 
      fileName: file.name 
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Upload request timed out in uploadFile:', error);
      return { status: 'error', message: 'The file upload request timed out. Please try again.', fileName: file.name };
    }
    console.error('Network or unexpected error in uploadFile:', error);
    return { status: 'error', message: error instanceof Error ? error.message : 'An unknown upload error occurred.', fileName: file.name };
  }
}

export async function checkFileUploadResponse(): Promise<string | null> {
  try {
    const response = await fetch(FILE_API_ENDPOINT, { method: 'GET' });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    if (data && data !== 'Processing') {
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(data);
        
        // Handle array format
        if (Array.isArray(jsonData)) {
          if (jsonData[0]?.output) {
            return jsonData[0].output;
          }
        } 
        
        // Handle object format
        if (typeof jsonData === 'object') {
          const content = jsonData.output || jsonData.message || jsonData.generatedText || jsonData.text;
          if (content) {
            return content;
          }
        }
        
        // If we couldn't extract content from JSON, return the stringified JSON
        return JSON.stringify(jsonData);
      } catch (e) {
        // If parsing fails, return the raw text
        return data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error checking file upload response:", error);
    throw error;
  }
}
