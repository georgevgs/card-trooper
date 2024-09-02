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

    console.log('Generated refresh token:', refreshToken);

    // Set the refresh token as a cookie
    cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: import.meta.env.PROD, // Use secure in production
      sameSite: 'lax', // Changed to 'lax' for debugging
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('Login successful, refresh token set in cookie');
    console.log('Refresh token cookie:', cookies.get('refreshToken'));

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
