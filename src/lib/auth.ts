import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Extract and verify user from Authorization header
 * Returns the user object if valid, null otherwise
 */
export async function getUserFromRequest(request: Request): Promise<User | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Extract user ID from request
 * Returns the user ID if valid, null otherwise
 */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const user = await getUserFromRequest(request);
  return user?.id ?? null;
}
