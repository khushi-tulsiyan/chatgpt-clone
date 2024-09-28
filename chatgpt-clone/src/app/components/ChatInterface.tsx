import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import Message from './Message';
import BranchViewer from './BranchViewer';

interface ChatInterfaceProps {
  conversationId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const { messages, branches, sendMessage, editMessage } = useChat(conversationId);
  const [inputValue, setInputValue] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onEdit={handleEditMessage}
            onSelect={() => setSelectedMessageId(message.id)}
          />
        ))}
      </div>
      {selectedMessageId && (
        <BranchViewer
          messageId={selectedMessageId}
          branches={branches}
          onClose={() => setSelectedMessageId(null)}
        />
      )}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Type your message..."
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;