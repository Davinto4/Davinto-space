// File: api/blog/list.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end('Method Not Allowed');

  try {
    const result = await sql`
      SELECT id, username, title, content, created_at
      FROM blogs
      ORDER BY created_at DESC
      LIMIT 50
    `;

    res.status(200).json({ blogs: result.rows });
  } catch (err) {
    console.error('Blog list error:', err);
    res.status(500).json({ error: 'Failed to load blog posts.' });
  }
}