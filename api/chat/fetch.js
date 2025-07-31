// File: api/chat/fetch.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end('Method Not Allowed');

  try {
    const result = await sql`
      SELECT username, text, created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const messages = result.rows.reverse(); // so newest at bottom
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ error: 'Failed to load messages.' });
  }
}