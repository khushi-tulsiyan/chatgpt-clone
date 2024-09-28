import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ChatInterface from '../components/ChatInterface';

// Define a type for the conversation
interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
}

export default function Home() {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    createOrFetchConversation();
  }, []);

  const createOrFetchConversation = async () => {
    // In a real app, you'd get the user_id from authentication
    const user_id = 'example-user-id';

    // Check if there's an existing conversation
    const { data: existingConversations, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user_id)
      .limit(1) as { data: Pick<Conversation, 'id'>[] | null, error: any };

    if (fetchError) {
      console.error('Error fetching conversations:', fetchError);
      return;
    }

    if (existingConversations && existingConversations.length > 0) {
      setConversationId(existingConversations[0].id);
    } else {
      // Create a new conversation
      const { data: newConversation, error: insertError } = await supabase
        .from('conversations')
        .insert({ user_id })
        .single() as { data: Conversation | null, error: any };

      if (insertError) {
        console.error('Error creating conversation:', insertError);
      } else if (newConversation) {
        setConversationId(newConversation.id);
      }
    }
  };

  if (!conversationId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">ChatGPT Clone</h1>
      <ChatInterface conversationId={conversationId} />
    </div>
  );
}