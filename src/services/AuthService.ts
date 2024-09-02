export const fetchCards = async (accessToken: string) => {
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

export const addCard = async (accessToken: string, cardData: any) => {
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

  return response.json();
};

export const deleteCard = async (accessToken: string, cardId: number) => {
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

  return response.json();
};

export const login = async (email: string, password: string): Promise<{ accessToken: string }> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
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
): Promise<void> => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }
};

export const refreshToken = async (): Promise<string> => {
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const { accessToken } = await response.json();
  return accessToken;
};

export const logout = async (): Promise<void> => {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
