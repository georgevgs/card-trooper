import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus } from 'lucide-react';
import * as AuthService from '@/services/AuthService';
import * as OfflineStore from '@/services/OfflineStore';
import type { StoreCardType } from '@/types/storecard';
import Header from './Header';
import CardList from './CardList';
import OfflineAlert from './OfflineAlert';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import AddCardDialog from './AddCardDialog';

interface MainPageProps {
  onLogout: () => Promise<void>;
}

// Overlay queued-but-unsynced operations on the server's card list, so a
// failed sync never makes an offline-added card vanish (or a queued delete
// resurrect). Offline cards use negative ids derived from their queue entry.
async function mergePendingOps(serverCards: StoreCardType[]): Promise<StoreCardType[]> {
  const ops = await OfflineStore.getPendingOps();
  if (ops.length === 0) return serverCards;

  const pendingDeletes = new Set(
    ops.filter(op => op.type === 'delete').map(op => op.payload as number)
  );
  const pendingAdds = ops
    .filter(op => op.type === 'add')
    .map(op => ({ ...(op.payload as Omit<StoreCardType, 'id'>), id: -op.id, isOffline: true }));

  return [...serverCards.filter(c => !pendingDeletes.has(c.id)), ...pendingAdds];
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cards, setCards] = useState<StoreCardType[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const isSyncing = useRef(false);
  const wasOffline = useRef(isOffline);

  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const syncPendingOps = useCallback(async () => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      const ops = await OfflineStore.getPendingOps();
      for (const op of ops) {
        try {
          if (op.type === 'add') {
            await AuthService.addCard(op.payload as Omit<StoreCardType, 'id'>);
          } else {
            await AuthService.deleteCard(op.payload as number);
          }
          await OfflineStore.removePendingOp(op.id);
        } catch (e) {
          console.error(`Failed to sync ${op.type} operation:`, e);
          // Leave the op (and the rest of the queue) for the next retry
          break;
        }
      }
    } finally {
      isSyncing.current = false;
    }
  }, []);

  // Flush the queue, then reconcile state and cache with the server. Any ops
  // that still failed to sync are merged back on top of the server list.
  const refreshFromServer = useCallback(async () => {
    await syncPendingOps();
    const fresh = await mergePendingOps(await AuthService.fetchCards());
    setCards(fresh);
    await OfflineStore.setCachedCards(fresh);
  }, [syncPendingOps]);

  useEffect(() => {
    const loadCards = async () => {
      // Migrate from localStorage on first run
      await OfflineStore.migrateFromLocalStorage();

      // Show cached cards immediately — the server refresh below runs after,
      // so a slow connection never blocks the checkout moment.
      const cached = await OfflineStore.getCachedCards();
      if (cached.length > 0) {
        setCards(cached);
        setIsLoadingCards(false);
      }

      if (navigator.onLine) {
        try {
          await refreshFromServer();
        } catch (e) {
          console.error('Failed to fetch cards:', e);
          // Fall back to cached data (already set above)
        }
      }

      setIsLoadingCards(false);
    };

    loadCards();
  }, [refreshFromServer]);

  // Sync pending operations when the connection is restored. Transition-only:
  // the on-mount sync is handled inside the load effect above.
  useEffect(() => {
    if (wasOffline.current && !isOffline) {
      refreshFromServer().catch(e => console.error('Failed to sync after reconnect:', e));
    }
    wasOffline.current = isOffline;
  }, [isOffline, refreshFromServer]);

  const handleAddCard = async (data: Omit<StoreCardType, 'id'>) => {
    setIsAddingCard(true);
    try {
      if (navigator.onLine) {
        try {
          const added = await AuthService.addCard(data);
          setCards(prev => [...prev, added]);
          await OfflineStore.addCachedCard(added);
          setIsAddCardOpen(false);
          return;
        } catch (e) {
          console.error('Failed to add card, saving locally for retry:', e);
        }
      }
      // Offline, or the server call failed — keep the card locally and queue it
      const opId = await OfflineStore.queueOp('add', data);
      const offlineCard: StoreCardType = { ...data, id: -opId, isOffline: true };
      setCards(prev => [...prev, offlineCard]);
      await OfflineStore.addCachedCard(offlineCard);
      setIsAddCardOpen(false);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteCard = async (id: number) => {
    // Remove from UI and cache immediately
    setCards(prev => prev.filter(c => c.id !== id));
    await OfflineStore.removeCachedCard(id);

    // A card that never synced has no server record — just cancel its queued add
    if (id < 0) {
      await OfflineStore.removePendingOp(-id);
      return;
    }

    if (!navigator.onLine) {
      await OfflineStore.queueOp('delete', id);
      return;
    }

    try {
      await AuthService.deleteCard(id);
    } catch (e) {
      // Server call failed — queue so the card doesn't resurrect on next sync
      console.error('Failed to delete card, queued for retry:', e);
      await OfflineStore.queueOp('delete', id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <main className="max-w-5xl mx-auto px-5 sm:px-6 pb-4 flex-1 w-full pt-safe">
        <div className="pt-7">
          <Header cardCount={cards.length} onLogout={onLogout} />
        </div>
        {isLoadingCards ? <LoadingScreen /> : (
          <div className="mt-5">
            <OfflineAlert isOffline={isOffline} />
            <CardList cards={cards} onDeleteCard={handleDeleteCard} />
          </div>
        )}
      </main>
      <Footer />
      <button
        className="fab"
        onClick={() => setIsAddCardOpen(true)}
        disabled={isAddingCard}
        aria-label="Add card"
      >
        <Plus className="w-7 h-7" strokeWidth={2.2} />
      </button>
      <AddCardDialog isOpen={isAddCardOpen} onOpenChange={setIsAddCardOpen} onAddCard={handleAddCard} isLoading={isAddingCard} />
    </div>
  );
};

export default MainPage;
