import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createAuth } from '@/lib/auth';
import { createDb } from '@/db/index';
import { cards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const cardSchema = z.object({
  storeName: z.string().min(1).max(100),
  cardNumber: z.string().min(1).max(200),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  isQRCode: z.boolean(),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ request, locals }) => {
  const { DB, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = locals.runtime.env;
  const auth = createAuth(DB, BETTER_AUTH_SECRET, [BETTER_AUTH_URL]);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const db = createDb(DB);
    const rows = await db.select().from(cards).where(eq(cards.userId, session.user.id));

    const result = rows.map((card) => ({
      id: card.id,
      userId: card.userId,
      storeName: card.storeName,
      cardNumber: card.cardNumber,
      color: card.color,
      isQRCode: card.isQRCode,
    }));

    return json(result);
  } catch {
    return json({ error: 'Failed to fetch cards' }, 500);
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const { DB, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = locals.runtime.env;
  const auth = createAuth(DB, BETTER_AUTH_SECRET, [BETTER_AUTH_URL]);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const parsed = cardSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.flatten() }, 400);
  }

  try {
    const db = createDb(DB);
    const [inserted] = await db
      .insert(cards)
      .values({
        userId: session.user.id,
        storeName: parsed.data.storeName,
        cardNumber: parsed.data.cardNumber,
        color: parsed.data.color,
        isQRCode: parsed.data.isQRCode,
        createdAt: new Date(),
      })
      .returning({ id: cards.id });

    return json({ id: inserted.id }, 201);
  } catch {
    return json({ error: 'Failed to create card' }, 500);
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const { DB, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = locals.runtime.env;
  const auth = createAuth(DB, BETTER_AUTH_SECRET, [BETTER_AUTH_URL]);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const parsed = z.object({ id: z.number() }).safeParse(body);
  if (!parsed.success) {
    return json({ error: 'Invalid id' }, 400);
  }

  try {
    const db = createDb(DB);
    await db
      .delete(cards)
      .where(and(eq(cards.id, parsed.data.id), eq(cards.userId, session.user.id)));

    return json({ success: true });
  } catch {
    return json({ error: 'Failed to delete card' }, 500);
  }
};
