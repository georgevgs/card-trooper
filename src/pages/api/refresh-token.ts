import type { APIRoute } from 'astro';
import { verifyRefreshToken, generateTokens } from '@/lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  const refreshTokenCookie = cookies.get('refreshToken');

  if (!refreshTokenCookie) {
    return new Response(JSON.stringify({ error: 'No refresh token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = verifyRefreshToken(refreshTokenCookie.value);

    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId);

    // Set the new refresh token as a cookie
    cookies.set('refreshToken', newRefreshToken, {
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
    return new Response(JSON.stringify({ error: 'Invalid or expired refresh token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
