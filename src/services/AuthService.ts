import { z } from 'zod';
import type { StoreCardType } from '@/types/storecard';

const addCardResponseSchema = z.object({ id: z.number() });

export const fetchCards = async (): Promise<StoreCardType[]> => {
  const response = await fetch('/api/cards', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }

  return response.json();
};

export const addCard = async (cardData: Omit<StoreCardType, 'id'>): Promise<StoreCardType> => {
  const response = await fetch('/api/cards', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });

  if (!response.ok) {
    throw new Error('Failed to add card');
  }

  const parsed = addCardResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Invalid response from server');
  }

  return {
    id: parsed.data.id,
    ...cardData,
  };
};

export const deleteCard = async (cardId: number): Promise<void> => {
  const response = await fetch('/api/cards', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: cardId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete card');
  }
};
