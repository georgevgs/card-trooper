import type { APIRoute } from 'astro';
import { createAuth } from '@/lib/auth';

export const ALL: APIRoute = async ({ request, locals }) => {
  const { DB, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = locals.runtime.env;
  const auth = createAuth(DB, BETTER_AUTH_SECRET, [BETTER_AUTH_URL]);
  return auth.handler(request);
};
