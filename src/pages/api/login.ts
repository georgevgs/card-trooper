import type { APIRoute } from 'astro';
import { loginUser, generateTokens } from '@/lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  try {
    const userId = await loginUser(email, password);
    if (!userId) {
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = generateTokens(userId);

    cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
