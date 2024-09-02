import type { APIRoute } from 'astro';
import { db, Users, eq } from 'astro:db';
import { hashPassword, generateTokens } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already exists
    const existingUser = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const result = await db
      .insert(Users)
      .values({
        username,
        email,
        passwordHash: hashedPassword,
      })
      .returning({ insertedId: Users.id });

    if (result && result[0]?.insertedId) {
      // Generate tokens for the new user
      const { accessToken, refreshToken } = generateTokens(result[0].insertedId);

      return new Response(JSON.stringify({ success: true, accessToken, refreshToken }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Failed to insert user');
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Determine if it's a known error or an unexpected one
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
