// File: api/blog/create.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { username, title, content } = req.body;

  if (!username || !title || !content) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await sql`
      INSERT INTO blogs (username, title, content)
      VALUES (${username}, ${title}, ${content})
      RETURNING id, username, title, content, created_at
    `;
    res.status(201).json({ blog: result.rows[0] });
  } catch (err) {
    console.error('Blog create error:', err);
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
}