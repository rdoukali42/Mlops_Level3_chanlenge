import { toast } from "@/components/ui/sonner";
import { MessageActionResult, FileUploadActionResult } from "./types";

const MESSAGE_API_ENDPOINT = "https://your-n8n-instance.app.n8n.cloud/webhook-test/your-webhook-id";
const FILE_API_ENDPOINT = "https://your-n8n-instance.app.n8n.cloud/webhook-test/your-file-webhook-id";
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
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return { 
        status: 'error', 
        message: `Request failed with status ${response.status}: ${errorText}` 
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error sending message:', error);
    
    if (error.name === 'AbortError') {
      return { 
        status: 'error', 
        message: 'Request timed out. Please try again with a shorter message or check your connection.' 
      };
    }
    
    return { 
      status: 'error', 
      message: error.message || 'Failed to send message. Please try again.' 
    };
  }
}

export async function uploadFileToChat(file: File): Promise<FileUploadActionResult> {
  if (!file) {
    return { status: 'error', message: 'No file selected.' };
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { 
      status: 'error', 
      message: 'File size must be less than 10MB. Please choose a smaller file.' 
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(FILE_API_ENDPOINT, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('File Upload API Error:', errorText);
      return { 
        status: 'error', 
        message: `Upload failed with status ${response.status}: ${errorText}` 
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error uploading file:', error);
    
    if (error.name === 'AbortError') {
      return { 
        status: 'error', 
        message: 'Upload timed out. Please try again with a smaller file or check your connection.' 
      };
    }
    
    return { 
      status: 'error', 
      message: error.message || 'Failed to upload file. Please try again.' 
    };
  }
}

export async function handleFileInputChange(
  event: React.ChangeEvent<HTMLInputElement>
): Promise<FileUploadActionResult> {
  const file = event.target.files?.[0];
  if (!file) {
    return { status: 'error', message: 'No file selected.' };
  }

  // Show uploading toast
  const toastId = toast.loading('Uploading file...', {
    description: `Uploading ${file.name}...`,
  });

  try {
    const result = await uploadFileToChat(file);
    
    if (result.status === 'success') {
      toast.success('File uploaded successfully!', {
        id: toastId,
        description: result.message || 'Your file has been processed.',
      });
    } else {
      toast.error('Upload failed', {
        id: toastId,
        description: result.message,
      });
    }
    
    return result;
  } catch (error: any) {
    toast.error('Upload failed', {
      id: toastId,
      description: error.message || 'An unexpected error occurred.',
    });
    
    return { 
      status: 'error', 
      message: error.message || 'Failed to upload file.' 
    };
  }
}

export async function handleSendMessage(
  message: string,
  onSuccess?: (result: MessageActionResult) => void,
  onError?: (error: string) => void
): Promise<void> {
  if (!message || message.trim() === '') {
    onError?.('Message cannot be empty.');
    return;
  }

  // Show sending toast
  const toastId = toast.loading('Sending message...', {
    description: 'Processing your request...',
  });

  try {
    const result = await sendChatMessage(message);
    
    if (result.status === 'success') {
      toast.success('Message sent!', {
        id: toastId,
        description: 'Your message has been processed.',
      });
      onSuccess?.(result);
    } else {
      toast.error('Failed to send message', {
        id: toastId,
        description: result.message,
      });
      onError?.(result.message);
    }
  } catch (error: any) {
    toast.error('Failed to send message', {
      id: toastId,
      description: error.message || 'An unexpected error occurred.',
    });
    onError?.(error.message || 'Failed to send message.');
  }
}
