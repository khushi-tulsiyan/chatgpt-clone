export interface User {
    id: string;
    email: string;
  }
  
  export interface Conversation {
    id: string;
    created_at: string;
    user_id: string;
  }
  
  export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
    parent_id: string | null;
    version: number;
  }
  
  export interface Branch {
    id: string;
    message_id: string;
    parent_branch_id: string | null;
    created_at: string;
  }