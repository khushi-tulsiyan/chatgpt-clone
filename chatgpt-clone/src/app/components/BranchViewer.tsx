import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Branch, Message } from '../types';

interface BranchViewerProps {
  messageId: string;
  branches: Branch[];
  onClose: () => void;
}

const BranchViewer: React.FC<BranchViewerProps> = ({ messageId, branches, onClose }) => {
  const [versions, setVersions] = useState<Message[]>([]);

  useEffect(() => {
    fetchVersions();
  }, [messageId]);

  const fetchVersions = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .order('version', { ascending: false });

    if (error) console.error('Error fetching versions:', error);
    else setVersions(data || []);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Message Versions</h2>
        {versions.map((version) => (
          <div key={version.id} className="mb-2 p-2 border rounded">
            <p>Version {version.version}</p>
            <p>{version.content}</p>
          </div>
        ))}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default BranchViewer;