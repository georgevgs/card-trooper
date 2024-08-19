import { db, Users, eq } from 'astro:db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in environment variables');
}

export async function generateToken(userId: number): Promise<string> {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(username: string, email: string, password: string): Promise<number | null> {
  const hashedPassword = await hashPassword(password);
  try {
    const result = await db.insert(Users).values({
      username,
      email,
      passwordHash: hashedPassword,
    }).returning({ insertedId: Users.id });
    return result[0].insertedId;
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<number | null> {
  const users = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
  if (users.length === 0) return null;

  const user = users[0];
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return user.id;
}