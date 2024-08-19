import type { APIRoute } from 'astro';
import { db, Users } from 'astro:db';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, email, password } = await request.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await db.insert(Users).values({
      username,
      email,
      passwordHash: hashedPassword,
    }).returning({ insertedId: Users.id });

    if (result && result[0]?.insertedId) {
      return new Response(JSON.stringify({ success: true, userId: result[0].insertedId }), {
        status: 200,
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