
import { toast } from "@/components/ui/sonner";
import { ApiResponse } from "./types";

const MESSAGE_API_ENDPOINT = "https://rofex2.app.n8n.cloud/webhook-test/b4c4dc8d-5f18-43f8-a2e3-45f45074dcb6";
const FILE_API_ENDPOINT = "https://rofex2.app.n8n.cloud/webhook-test/f821caa1-159d-4354-a7f2-b639c34f0b72";

export const sendChatMessage = async (message: string): Promise<Response> => {
  const response = await fetch(MESSAGE_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};

export const checkChatResponse = async (): Promise<string | null> => {
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
};

export const uploadFile = (
  file: File, 
  onProgress: (progress: number) => void, 
  onSuccess: (data: string) => void,
  onError: (error: Error) => void
): void => {
  const formData = new FormData();
  formData.append('file', file);
  
  const xhr = new XMLHttpRequest();
  
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    }
  };
  
  xhr.onload = () => {
    if (xhr.status === 200) {
      toast.success("File uploaded successfully");
      onSuccess('File uploaded. Processing...');
    } else {
      onError(new Error(`Upload failed: ${xhr.statusText}`));
    }
  };
  
  xhr.onerror = () => onError(new Error("Network error during upload"));
  xhr.ontimeout = () => onError(new Error("Upload timed out"));
  
  xhr.open('POST', FILE_API_ENDPOINT, true);
  xhr.timeout = 30000; // 30 seconds timeout
  xhr.send(formData);
};

export const checkFileUploadResponse = async (): Promise<string | null> => {
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
};
