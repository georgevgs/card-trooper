import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddCardForm from './AddCardForm';
import CardList from './CardList';
import { useAuth } from '@/hooks/useAuth';
import * as AuthService from '@/services/AuthService';

type StoreCard = {
  id: number;
  storeName: string;
  cardNumber: string;
  color: string;
  isQRCode: boolean;
};

// Define the type for MainPage props including the onLogout function
type MainPageProps = {
  onLogout: () => Promise<void>;
};

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const { isAuthenticated, accessToken, isLoading } = useAuth();
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cards, setCards] = useState<StoreCard[]>([]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchCards();
    }
  }, [isAuthenticated, accessToken]);

  const fetchCards = async () => {
    if (!accessToken) return;
    try {
      const fetchedCards = await AuthService.fetchCards(accessToken);
      setCards(fetchedCards);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }
  };

  const handleAddCard = async (newCard: Omit<StoreCard, 'id'>) => {
    if (!accessToken) return;
    try {
      const addedCard = await AuthService.addCard(accessToken, newCard);
      setCards([...cards, addedCard]);
      setIsAddCardOpen(false);
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (!accessToken) return;
    try {
      await AuthService.deleteCard(accessToken, id);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this content.</div>;
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
            >
              <Plus className="mr-2 h-4 w-4" /> Add Card
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
          <CardList cards={cards} onDeleteCard={handleDeleteCard} />
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
          <AddCardForm onAddCard={handleAddCard} onClose={() => setIsAddCardOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPage;
