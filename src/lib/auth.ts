import { db, Users, eq } from 'astro:db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = import.meta.env.JWT_SECRET;
const JWT_REFRESH_SECRET = import.meta.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables');
}

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const registerUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  try {
    const result = await db
      .insert(Users)
      .values({
        username,
        email,
        passwordHash: hashedPassword,
      })
      .returning({ insertedId: Users.id });

    return result[0].insertedId;
  } catch (error) {
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  const users = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
  if (users.length === 0) return null;

  const user = users[0];
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return user.id;
};
