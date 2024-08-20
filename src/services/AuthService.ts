type LoginResponse = {
  token: string;
};

type RegisterResponse = {
  success: boolean;
};

export const login = async (email: string, password: string): Promise<string> => {
  const response = await sendRequest('/api/login', { email, password });
  const { token } = await parseResponse<LoginResponse>(response);
  return token;
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<void> => {
  const response = await sendRequest('/api/register', { username, email, password });
  await parseResponse<RegisterResponse>(response);
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
