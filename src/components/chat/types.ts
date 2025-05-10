
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
