
export interface MessageItem {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ApiResponse {
  output?: string;
  message?: string;
  generatedText?: string;
  text?: string;
  [key: string]: any;
}

export interface MessageActionResult {
  status: 'success' | 'error';
  message?: string;
  modelResponse?: string;
  userMessage?: string;
}

export interface FileUploadActionResult {
  status: 'success' | 'error';
  message: string;
  fileName?: string;
}
