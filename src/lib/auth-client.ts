import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  fetchOptions: {
    credentials: 'include',
  },
});

export type Session = typeof authClient.$Infer.Session;
