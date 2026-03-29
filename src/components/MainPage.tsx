import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cards, setCards] = useState<StoreCardType[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isSyncing = useRef(false);

  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => { loadCards(); }, []);

  // Sync pending operations when coming back online
  useEffect(() => {
    if (!isOffline) {
      syncPendingOps();
    }
  }, [isOffline]);

  const syncPendingOps = useCallback(async () => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      const ops = await OfflineStore.getPendingOps();
      if (ops.length === 0) return;

      for (const op of ops) {
        try {
          if (op.type === 'add') {
            const data = op.payload as Omit<StoreCardType, 'id'>;
            const synced = await AuthService.addCard(data);

            // Replace the temp offline card with the synced one in IndexedDB and state
            setCards(prev => {
              const updated = prev.map(c =>
                c.isOffline && c.storeName === data.storeName && c.cardNumber === data.cardNumber
                  ? synced
                  : c
              );
              OfflineStore.setCachedCards(updated);
              return updated;
            });
          } else if (op.type === 'delete') {
            const cardId = op.payload as number;
            await AuthService.deleteCard(cardId);
          }

          await OfflineStore.removePendingOp(op.id);
        } catch (e) {
          console.error(`Failed to sync ${op.type} operation:`, e);
          // Leave the op in the queue for next retry
          break;
        }
      }
    } finally {
      isSyncing.current = false;
    }
  }, []);

  const loadCards = async () => {
    setIsLoadingCards(true);

    // Migrate from localStorage on first run
    await OfflineStore.migrateFromLocalStorage();

    // Load cached cards from IndexedDB immediately
    const cached = await OfflineStore.getCachedCards();
    setCards(cached);

    // If online, fetch fresh data from server
    if (navigator.onLine) {
      try {
        const fresh = await AuthService.fetchCards();
        setCards(fresh);
        await OfflineStore.setCachedCards(fresh);
      } catch (e) {
        console.error('Failed to fetch cards:', e);
        // Fall back to cached data (already set above)
      }
    }

    setIsLoadingCards(false);
  };

  const handleAddCard = async (data: Omit<StoreCardType, 'id'>) => {
    setIsAddingCard(true);
    try {
      if (navigator.onLine) {
        const added = await AuthService.addCard(data);
        setCards(prev => [...prev, added]);
        await OfflineStore.addCachedCard(added);
      } else {
        const offlineCard: StoreCardType = { ...data, id: Date.now(), isOffline: true };
        setCards(prev => [...prev, offlineCard]);
        await OfflineStore.addCachedCard(offlineCard);
        await OfflineStore.queueOp('add', data);
      }
      setIsAddCardOpen(false);
    } catch (e) {
      console.error('Failed to add card:', e);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteCard = async (id: number) => {
    // Remove from UI and cache immediately
    setCards(prev => prev.filter(c => c.id !== id));
    await OfflineStore.removeCachedCard(id);

    try {
      if (navigator.onLine) {
        await AuthService.deleteCard(id);
      } else {
        await OfflineStore.queueOp('delete', id);
      }
    } catch (e) {
      console.error('Failed to delete card:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Header onAddCard={() => setIsAddCardOpen(true)} onLogout={onLogout} onToggleSearch={() => setIsSearchVisible(v => !v)} isAddingCard={isAddingCard} />
      <main className="max-w-5xl mx-auto px-4 pt-6 pb-4 sm:px-6 flex-1 w-full">
        {isLoadingCards ? <LoadingScreen /> : (
          <>
            <OfflineAlert isOffline={isOffline} />
            <CardList cards={cards} onDeleteCard={handleDeleteCard} isSearchVisible={isSearchVisible} />
          </>
        )}
      </main>
      <Footer />
      <AddCardDialog isOpen={isAddCardOpen} onOpenChange={setIsAddCardOpen} onAddCard={handleAddCard} isLoading={isAddingCard} />
    </div>
  );
};

export default MainPage;
