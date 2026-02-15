import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';
import { getUserIdFromRequest } from '@/lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { data: cards, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Map snake_case columns to camelCase for frontend compatibility
    const mappedCards = cards.map((card) => ({
      id: card.id,
      userId: card.user_id,
      storeName: card.store_name,
      cardNumber: card.card_number,
      color: card.color,
      isQRCode: card.is_qr_code,
    }));

    return new Response(JSON.stringify(mappedCards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch cards' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { storeName, cardNumber, color, isQRCode } = await request.json();

    const { data, error } = await supabase
      .from('cards')
      .insert({
        user_id: userId,
        store_name: storeName,
        card_number: cardNumber,
        color: color,
        is_qr_code: isQRCode,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create card' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete card' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
