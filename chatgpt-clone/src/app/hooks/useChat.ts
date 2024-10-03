import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Message, Branch } from '../types';

export const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchBranches();
  }, [conversationId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching messages:', error);
    else setMessages(data || []);
  };

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('conversation_id', conversationId);

    if (error) console.error('Error fetching branches:', error);
    else setBranches(data || []);
  };

  const sendMessage = async (content: string, parentId: string | null = null) => {
    const newMessage = {
      conversation_id: conversationId,
      content,
      role: 'user' as const,
      parent_id: parentId,
      version: 1,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .single();

    if (error) console.error('Error sending message:', error);
    else if (data) {
      setMessages([...messages, data]);
      // Simulate assistant response (replace with actual AI integration)
      setTimeout(() => {
        sendAssistantMessage('This is a simulated response.');
      }, 1000);
    }
  };

  const sendAssistantMessage = async (content: string) => {
    const assistantMessage = {
      conversation_id: conversationId,
      content,
      role: 'assistant' as const,
      parent_id: null,
      version: 1,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(assistantMessage)
      .single();

    if (error) console.error('Error sending assistant message:', error);
    else if (data) setMessages([...messages, data]);
  };

  const editMessage = async (messageId: string, newContent: string) => {
    const { data: oldMessage, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (fetchError) {
      console.error('Error fetching message:', fetchError);
      return;
    }

    if (oldMessage) {
      const newMessage = {
        ...oldMessage,
        content: newContent,
        version: oldMessage.version + 1,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage) as { data: Message[] | null, error: any };

      if (error) {
        console.error('Error editing message:', error);
      } else if (data && data.length > 0) {
        setMessages(messages.map(m => m.id === messageId ? data[0] : m));
        createBranch(messageId);
      }
    }
  };

  const createBranch = async (messageId: string) => {
    const newBranch = {
      message_id: messageId,
      parent_branch_id: null,
    };

    const { data, error } = await supabase
      .from('branches')
      .insert(newBranch)
      .single();

    if (error) console.error('Error creating branch:', error);
    else if (data) setBranches([...branches, data]);
  };

  return {
    messages,
    branches,
    sendMessage,
    editMessage,
  };
}; 