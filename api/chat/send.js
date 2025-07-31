// File: api/chat/send.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ error: 'Missing username or message text.' });
  }

  try {
    await sql`
      INSERT INTO messages (username, text)
      VALUES (${username}, ${text})
    `;
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Chat send error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
}