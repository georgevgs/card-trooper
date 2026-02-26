import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDb } from '@/db/index';
import * as schema from '@/db/schema';

export function createAuth(db: D1Database, secret: string, trustedOrigins?: string[]) {
  const drizzleDb = createDb(db);

  return betterAuth({
    database: drizzleAdapter(drizzleDb, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret,
    trustedOrigins: trustedOrigins ?? [],
    emailAndPassword: {
      enabled: true,
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
