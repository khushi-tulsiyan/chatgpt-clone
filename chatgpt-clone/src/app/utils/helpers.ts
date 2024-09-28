import { Conversation, Message, Branch } from '../types';

// Type guard for Conversation
export function isConversation(obj: any): obj is Conversation {
  return obj && typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.user_id === 'string' &&
    typeof obj.created_at === 'string';
}

// Type guard for Message
export function isMessage(obj: any): obj is Message {
  return obj && typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.conversation_id === 'string' &&
    typeof obj.content === 'string' &&
    (obj.role === 'user' || obj.role === 'assistant') &&
    typeof obj.created_at === 'string' &&
    (obj.parent_id === null || typeof obj.parent_id === 'string') &&
    typeof obj.version === 'number';
}

// Type guard for Branch
export function isBranch(obj: any): obj is Branch {
  return obj && typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.message_id === 'string' &&
    (obj.parent_branch_id === null || typeof obj.parent_branch_id === 'string') &&
    typeof obj.created_at === 'string';
}

// Function to safely access nested properties
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

// Function to generate a unique ID (useful for temporary IDs before server response)
export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Function to format a date string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(); 
}

// Function to truncate long strings
export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// Debounce function for performance optimization
export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}