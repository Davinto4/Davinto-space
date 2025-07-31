// File: api/auth/signup.js
import { hash } from 'bcryptjs';
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if user already exists (by email or username)
    const check = await sql`
      SELECT * FROM users WHERE email = ${email} OR username = ${username}
    `;

    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already taken.' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert new user
    const result = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${hashedPassword})
      RETURNING id, username, email
    `;

    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error. Try again later.' });
  }
}