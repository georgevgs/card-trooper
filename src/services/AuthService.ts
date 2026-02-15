import type { StoreCardType } from '@/types/storecard';

export const fetchCards = async (accessToken: string): Promise<StoreCardType[]> => {
  const response = await fetch('/api/cards', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }

  return response.json();
};

export const addCard = async (
  accessToken: string,
  cardData: Omit<StoreCardType, 'id'>,
): Promise<StoreCardType> => {
  const response = await fetch('/api/cards', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cardData),
  });

  if (!response.ok) {
    throw new Error('Failed to add card');
  }

  const responseData = await response.json();

  const newCard: StoreCardType = {
    id: responseData.id,
    ...cardData,
  };

  return newCard;
};

export const deleteCard = async (accessToken: string, cardId: number): Promise<void> => {
  const response = await fetch('/api/cards', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: cardId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete card');
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<{
  success: boolean;
  emailConfirmationRequired: boolean;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}> => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
};

export const refreshToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
};

export const logout = async (accessToken: string | null): Promise<void> => {
  await fetch('/api/logout', {
    method: 'POST',
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });
};
