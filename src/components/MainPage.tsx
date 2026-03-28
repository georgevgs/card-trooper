import React, { useState, useEffect } from 'react';
import * as AuthService from '@/services/AuthService';
import type { StoreCardType } from '@/types/storecard';
import Header from './Header';
import CardList from './CardList';
import OfflineAlert from './OfflineAlert';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import AddCardDialog from './AddCardDialog';

const CACHE_KEY = 'cardTrooperCards';

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

  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => { loadCards(); }, []);

  useEffect(() => {
    if (isOffline) return;
    const syncOfflineCards = async () => {
      const offlineCards = cards.filter(c => c.isOffline);
      if (offlineCards.length === 0) return;
      for (const card of offlineCards) {
        try {
          const { storeName, cardNumber, color, isQRCode } = card;
          const synced = await AuthService.addCard({ storeName, cardNumber, color, isQRCode });
          setCards(prev => { const u = prev.map(c => c.id === card.id ? synced : c); saveCardsToCache(u); return u; });
        } catch (e) { console.error('Failed to sync offline card:', e); }
      }
    };
    syncOfflineCards();
  }, [isOffline]);

  const loadCardsFromCache = (): StoreCardType[] => {
    try { const c = localStorage.getItem(CACHE_KEY); return c ? JSON.parse(c) : []; }
    catch { return []; }
  };

  const saveCardsToCache = (c: StoreCardType[]) => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
  };

  const loadCards = async () => {
    setIsLoadingCards(true);
    setCards(loadCardsFromCache());
    if (navigator.onLine) {
      try { const f = await AuthService.fetchCards(); setCards(f); saveCardsToCache(f); }
      catch (e) { console.error('Failed to fetch cards:', e); }
    }
    setIsLoadingCards(false);
  };

  const handleAddCard = async (data: Omit<StoreCardType, 'id'>) => {
    setIsAddingCard(true);
    try {
      if (navigator.onLine) {
        const added = await AuthService.addCard(data);
        setCards(prev => { const u = [...prev, added]; saveCardsToCache(u); return u; });
      } else {
        const offline = { ...data, id: Date.now(), isOffline: true };
        setCards(prev => { const u = [...prev, offline]; saveCardsToCache(u); return u; });
      }
      setIsAddCardOpen(false);
    } catch (e) { console.error('Failed to add card:', e); }
    finally { setIsAddingCard(false); }
  };

  const handleDeleteCard = async (id: number) => {
    try {
      if (navigator.onLine) await AuthService.deleteCard(id);
      setCards(prev => { const u = prev.filter(c => c.id !== id); saveCardsToCache(u); return u; });
    } catch (e) { console.error('Failed to delete card:', e); }
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
