import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { conversation_id, content, role, parent_id } = req.body;
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, content, role, parent_id, version: 1 })
      .single();

    if (error) res.status(400).json({ error: error.message });
    else res.status(201).json(data);
  } else if (req.method === 'GET') {
    const { conversation_id } = req.query;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    if (error) res.status(400).json({ error: error.message });
    else res.status(200).json(data);
  } else if (req.method === 'PUT') {
    const { id, content } = req.body;
    const { data: oldMessage } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (oldMessage) {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...oldMessage,
          content,
          version: oldMessage.version + 1,
        })
        .single();

      if (error) res.status(400).json({ error: error.message });
      else res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}