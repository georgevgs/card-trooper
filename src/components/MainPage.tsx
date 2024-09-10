import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddCardForm from './AddCardForm';
import CardList from './CardList';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import * as AuthService from '@/services/AuthService';
import type { StoreCardType } from '@/types/storecard';

const CACHE_KEY = 'cardTrooperCards';
const AUTH_KEY = 'cardTrooperAuth';

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

  const loadCardsFromCache = (): StoreCardType[] => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  };

  const saveCardsToCache = (cardsToCache: StoreCardType[]) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cardsToCache));
  };

  const handleAddCard = async (newCardData: Omit<StoreCardType, 'id'>) => {
    setIsAddingCard(true);
    try {
      if (navigator.onLine && accessToken) {
        const addedCard = await AuthService.addCard(accessToken, newCardData);
        setCards((prevCards) => {
          const updatedCards = [...prevCards, addedCard];
          saveCardsToCache(updatedCards);
          return updatedCards;
        });
      } else {
        // Offline mode: add card locally
        const tempId = Date.now(); // Use timestamp as temporary ID
        const offlineCard: StoreCardType = { ...newCardData, id: tempId, isOffline: true };
        setCards((prevCards) => {
          const updatedCards = [...prevCards, offlineCard];
          saveCardsToCache(updatedCards);
          return updatedCards;
        });
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
      setCards((prevCards) => {
        const updatedCards = prevCards.filter((card) => card.id !== id);
        saveCardsToCache(updatedCards);
        return updatedCards;
      });
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <div className="container mx-auto min-h-screen flex flex-col p-4 sm:p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            My Store Cards
          </h1>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsAddCardOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={isAddingCard}
            >
              {isAddingCard ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Card
                </>
              )}
            </Button>
            <Button
              onClick={onLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <main className="flex-grow overflow-auto">
          {isLoadingCards ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {isOffline && (
                <div
                  className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
                  role="alert"
                >
                  <p className="font-bold">You are offline</p>
                  <p>Some features may be limited until you reconnect.</p>
                </div>
              )}
              <CardList cards={cards} onDeleteCard={handleDeleteCard} />
            </>
          )}
        </main>
        <footer className="mt-6 text-center text-sm text-gray-500">
          © 2024 Card Trooper. All rights reserved.
        </footer>
      </div>
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Add New Card</DialogTitle>
          </DialogHeader>
          <AddCardForm
            onAddCard={handleAddCard}
            onClose={() => setIsAddCardOpen(false)}
            isLoading={isAddingCard}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPage;
