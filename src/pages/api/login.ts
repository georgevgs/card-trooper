import type { APIRoute } from 'astro';
import { db, eq, Users } from 'astro:db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'your_fallback_secret';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    const user = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
    if (user.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = jwt.sign({ userId: user[0].id }, JWT_SECRET, { expiresIn: '1d' });

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};