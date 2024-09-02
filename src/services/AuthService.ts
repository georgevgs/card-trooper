type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type RegisterResponse = LoginResponse;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await sendRequest('/api/login', { email, password });
  return parseResponse<LoginResponse>(response);
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const response = await sendRequest('/api/register', { username, email, password });
  return parseResponse<RegisterResponse>(response);
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await sendRequest('/api/refresh-token', { refreshToken });
  const { accessToken } = await parseResponse<{ accessToken: string }>(response);
  return accessToken;
};

const sendRequest = async (url: string, data: object): Promise<Response> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  return (await response.json()) as T;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData.error || 'Request failed';
  } catch {
    return 'An unexpected error occurred';
  }
};

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
