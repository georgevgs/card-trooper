import type { APIRoute } from 'astro';
import { db, eq, Users } from 'astro:db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

const JWT_SECRET = import.meta.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in environment variables');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await db.insert(Users).values({
      username,
      email,
      passwordHash: hashedPassword,
    }).returning({ insertedId: Users.id });

    if (result && result[0]?.insertedId) {
      // Generate a token for the new user
      const token = await generateToken(result[0].insertedId);

      return new Response(JSON.stringify({ success: true, token }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Failed to insert user');
    }
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};