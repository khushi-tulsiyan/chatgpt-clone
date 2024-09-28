import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { user_id } = req.body;
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id })
      .single();

    if (error) res.status(400).json({ error: error.message });
    else res.status(201).json(data);
  } else if (req.method === 'GET') {
    const { user_id } = req.query;
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user_id);

    if (error) res.status(400).json({ error: error.message });
    else res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}