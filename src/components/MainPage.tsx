import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddCardForm from './AddCardForm';
import CardList from './CardList';
import WelcomePage from './WelcomePage';

type StoreCard = {
  id: string;
  storeName: string;
  cardNumber: string;
  color: string;
  isQRCode: boolean;
};

const MainPage = () => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cards, setCards] = useState<StoreCard[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedCards = localStorage.getItem('storeCards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleAddCard = (newCard: StoreCard) => {
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem('storeCards', JSON.stringify(updatedCards));
    setIsAddCardOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return <WelcomePage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0B132B] via-[#3A506B] to-[#5BC0BE] text-white">
      <div className="container mx-auto min-h-screen flex flex-col p-4 sm:p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">My Store Cards</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddCardOpen(true)} className="bg-[#6FFFE9] text-[#0B132B] hover:bg-[#5BC0BE] hover:text-white transition-colors">
              <Plus className="mr-2 h-4 w-4" /> Add Card
            </Button>
            <Button onClick={handleLogout} variant="outline" className="text-[#6FFFE9] border-[#6FFFE9] hover:bg-[#6FFFE9] hover:text-[#0B132B] transition-colors">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <main className="flex-grow overflow-auto">
          <CardList cards={cards} setCards={setCards} />
        </main>

        <footer className="mt-6 text-center text-sm opacity-70">
          © 2024 Card Trooper. All rights reserved.
        </footer>
      </div>

      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1C2541] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#6FFFE9]">Add New Card</DialogTitle>
            <DialogDescription className="text-[#5BC0BE]">
              Enter the details for your new store card.
            </DialogDescription>
          </DialogHeader>
          <AddCardForm onAddCard={handleAddCard} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPage;