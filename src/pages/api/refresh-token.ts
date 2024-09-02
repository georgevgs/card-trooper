import type { APIRoute } from 'astro';
import { verifyRefreshToken, generateTokens } from '@/lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  console.log('Refresh token request received');

  const refreshTokenCookie = cookies.get('refreshToken');
  console.log('Refresh token cookie:', refreshTokenCookie);

  if (!refreshTokenCookie) {
    console.log('No refresh token provided in cookies');
    return new Response(JSON.stringify({ error: 'No refresh token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = verifyRefreshToken(refreshTokenCookie.value);
    console.log('Refresh token payload:', payload);

    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId);

    // Set the new refresh token as a cookie
    cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: import.meta.env.PROD, // Use secure in production
      sameSite: 'lax', // Changed to 'lax' for debugging
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('New access token generated, new refresh token set in cookie');

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return new Response(JSON.stringify({ error: 'Invalid or expired refresh token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
