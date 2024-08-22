import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddCardForm from './AddCardForm';
import CardList from './CardList';

type StoreCard = {
  id: number;
  storeName: string;
  cardNumber: string;
  color: string;
  isQRCode: boolean;
};

interface MainPageProps {
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cards, setCards] = useState<StoreCard[]>([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/cards', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const fetchedCards = await response.json();
      setCards(fetchedCards);
    }
  };

  const handleAddCard = async (newCard: Omit<StoreCard, 'id'>) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCard),
    });
    if (response.ok) {
      const { id } = await response.json();
      setCards([...cards, { ...newCard, id }]);
      setIsAddCardOpen(false);
    }
  };

  const handleDeleteCard = async (id: number) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/cards', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

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
