import { openDB, type IDBPDatabase } from 'idb';
import type { StoreCardType } from '@/types/storecard';

const DB_NAME = 'card-trooper';
const DB_VERSION = 1;
const CARDS_STORE = 'cards';
const PENDING_OPS_STORE = 'pendingOps';

interface PendingOp {
  id: number;
  type: 'add' | 'delete';
  payload: Omit<StoreCardType, 'id'> | number; // card data for add, card id for delete
  createdAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CARDS_STORE)) {
          db.createObjectStore(CARDS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(PENDING_OPS_STORE)) {
          db.createObjectStore(PENDING_OPS_STORE, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

// --- Cards ---

export async function getCachedCards(): Promise<StoreCardType[]> {
  const db = await getDB();
  return db.getAll(CARDS_STORE);
}

export async function setCachedCards(cards: StoreCardType[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(CARDS_STORE, 'readwrite');
  await tx.store.clear();
  for (const card of cards) {
    await tx.store.put(card);
  }
  await tx.done;
}

export async function addCachedCard(card: StoreCardType): Promise<void> {
  const db = await getDB();
  await db.put(CARDS_STORE, card);
}

export async function removeCachedCard(id: number): Promise<void> {
  const db = await getDB();
  await db.delete(CARDS_STORE, id);
}

// --- Pending Operations Queue ---

export async function queueOp(type: PendingOp['type'], payload: PendingOp['payload']): Promise<void> {
  const db = await getDB();
  await db.add(PENDING_OPS_STORE, { type, payload, createdAt: Date.now() });
}

export async function getPendingOps(): Promise<PendingOp[]> {
  const db = await getDB();
  return db.getAll(PENDING_OPS_STORE);
}

export async function clearPendingOps(): Promise<void> {
  const db = await getDB();
  await db.clear(PENDING_OPS_STORE);
}

export async function removePendingOp(id: number): Promise<void> {
  const db = await getDB();
  await db.delete(PENDING_OPS_STORE, id);
}

// --- Migration from localStorage ---

const LEGACY_CACHE_KEY = 'cardTrooperCards';

export async function migrateFromLocalStorage(): Promise<void> {
  try {
    const raw = localStorage.getItem(LEGACY_CACHE_KEY);
    if (!raw) return;

    const cards: StoreCardType[] = JSON.parse(raw);
    if (!Array.isArray(cards) || cards.length === 0) return;

    const existing = await getCachedCards();
    if (existing.length === 0) {
      await setCachedCards(cards);
    }

    localStorage.removeItem(LEGACY_CACHE_KEY);
  } catch {
    // Migration is best-effort
  }
}
