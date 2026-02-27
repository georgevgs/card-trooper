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
  const [isAddCardOpen, setIsAddCardOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<StoreCardType[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState<boolean>(true);
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => { loadCards(); }, []);

  const loadCardsFromCache = (): StoreCardType[] => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  };

  const saveCardsToCache = (c: StoreCardType[]) =>
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));

  const loadCards = async () => {
    setIsLoadingCards(true);
    setCards(loadCardsFromCache());
    if (navigator.onLine) {
      try {
        const fetched = await AuthService.fetchCards();
        setCards(fetched);
        saveCardsToCache(fetched);
      } catch (e) {
        console.error('Failed to fetch cards:', e);
      }
    }
    setIsLoadingCards(false);
  };

  const handleAddCard = async (newCardData: Omit<StoreCardType, 'id'>) => {
    setIsAddingCard(true);
    try {
      if (navigator.onLine) {
        const added = await AuthService.addCard(newCardData);
        setCards(prev => { const u = [...prev, added]; saveCardsToCache(u); return u; });
      } else {
        const offline = { ...newCardData, id: Date.now(), isOffline: true };
        setCards(prev => { const u = [...prev, offline]; saveCardsToCache(u); return u; });
      }
      setIsAddCardOpen(false);
    } catch (e) {
      console.error('Failed to add card:', e);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteCard = async (id: number) => {
    try {
      if (navigator.onLine) await AuthService.deleteCard(id);
      setCards(prev => { const u = prev.filter(c => c.id !== id); saveCardsToCache(u); return u; });
    } catch (e) {
      console.error('Failed to delete card:', e);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-cream)' }}>
      <Header
        onAddCard={() => setIsAddCardOpen(true)}
        onLogout={onLogout}
        onToggleSearch={() => setIsSearchVisible(v => !v)}
        isAddingCard={isAddingCard}
      />
      <main className="max-w-5xl mx-auto px-4 pt-6 pb-4 sm:px-6">
        {isLoadingCards ? (
          <LoadingScreen />
        ) : (
          <>
            <OfflineAlert isOffline={isOffline} />
            <CardList
              cards={cards}
              onDeleteCard={handleDeleteCard}
              isSearchVisible={isSearchVisible}
            />
          </>
        )}
      </main>
      <Footer />
      <AddCardDialog
        isOpen={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        onAddCard={handleAddCard}
        isLoading={isAddingCard}
      />
    </div>
  );
};

export default MainPage;
