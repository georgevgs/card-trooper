import type { APIRoute } from 'astro';
import { db, Cards, eq, and } from 'astro:db';
import { verifyToken } from '@/lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  const cards = await db.select().from(Cards).where(eq(Cards.userId, payload.userId));

  return new Response(JSON.stringify(cards), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  const { storeName, cardNumber, color, isQRCode } = await request.json();
  const result = await db
    .insert(Cards)
    .values({
      userId: payload.userId,
      storeName,
      cardNumber,
      color,
      isQRCode,
    })
    .returning({ insertedId: Cards.id });

  return new Response(JSON.stringify({ id: result[0].insertedId }), { status: 201 });
};

export const DELETE: APIRoute = async ({ request }) => {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  const { id } = await request.json();

  await db.delete(Cards).where(and(eq(Cards.id, id), eq(Cards.userId, payload.userId)));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
