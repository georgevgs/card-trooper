import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  const { isAuthenticated, accessToken, isLoading: authLoading } = useAuth();
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

  useEffect(() => {
    if (isAuthenticated) {
      loadCards();
    }
  }, [isAuthenticated, accessToken]);

  const loadCardsFromCache = (): StoreCardType[] => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  };

  const saveCardsToCache = (cardsToCache: StoreCardType[]) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cardsToCache));
  };

  const loadCards = async () => {
    setIsLoadingCards(true);
    const cachedCards = loadCardsFromCache();
    setCards(cachedCards);

    if (navigator.onLine && accessToken) {
      try {
        const fetchedCards = await AuthService.fetchCards(accessToken);
        setCards(fetchedCards);
        saveCardsToCache(fetchedCards);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      }
    }
    setIsLoadingCards(false);
  };

  const handleAddCard = async (newCardData: Omit<StoreCardType, 'id'>) => {
    setIsAddingCard(true);
    try {
      if (navigator.onLine && accessToken) {
        const addedCard = await AuthService.addCard(accessToken, newCardData);
        updateCardsState(addedCard);
      } else {
        const offlineCard = createOfflineCard(newCardData);
        updateCardsState(offlineCard);
      }
      setIsAddCardOpen(false);
    } catch (error) {
      console.error('Failed to add card:', error);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDeleteCard = async (id: number) => {
    try {
      if (navigator.onLine && accessToken) {
        await AuthService.deleteCard(accessToken, id);
      }
      removeCardFromState(id);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const updateCardsState = (newCard: StoreCardType) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards, newCard];
      saveCardsToCache(updatedCards);
      return updatedCards;
    });
  };

  const removeCardFromState = (id: number) => {
    setCards((prevCards) => {
      const updatedCards = prevCards.filter((card) => card.id !== id);
      saveCardsToCache(updatedCards);
      return updatedCards;
    });
  };

  const createOfflineCard = (cardData: Omit<StoreCardType, 'id'>): StoreCardType => ({
    ...cardData,
    id: Date.now(),
    isOffline: true,
  });

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <div className="container mx-auto min-h-screen flex flex-col p-4 sm:p-6">
        <Header
          onAddCard={() => setIsAddCardOpen(true)}
          onLogout={onLogout}
          onToggleSearch={toggleSearch}
          isAddingCard={isAddingCard}
        />
        <main className="flex-grow overflow-auto">
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
      </div>
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
