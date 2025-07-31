// File: api/auth/login.js
import { compare } from 'bcryptjs';
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Compare password hash
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Return user (excluding password)
    const { id, username } = user;
    res.status(200).json({ user: { id, username, email } });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}