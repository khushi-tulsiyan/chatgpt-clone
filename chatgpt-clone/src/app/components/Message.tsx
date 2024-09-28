import React, { useState } from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  onEdit: (messageId: string, newContent: string) => void;
  onSelect: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onEdit, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleEdit = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className={`p-2 mb-2 rounded ${message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleEdit} className="mt-2 px-2 py-1 bg-blue-500 text-white rounded">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="mt-2 ml-2 px-2 py-1 bg-gray-500 text-white rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>{message.content}</p>
          {message.role === 'user' && (
            <div className="mt-2">
              <button onClick={() => setIsEditing(true)} className="mr-2 text-sm text-blue-500">
                Edit
              </button>
              <button onClick={onSelect} className="text-sm text-blue-500">
                View Branches
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;