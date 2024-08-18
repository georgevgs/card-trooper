import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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

type StoreCard = {
  id: string;
  storeName: string;
  cardNumber: string;
  color: string;
};

type MainPageProps = {};

const MainPage = ({}: MainPageProps) => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cards, setCards] = useState<StoreCard[]>([]);

  useEffect(() => {
    const storedCards = localStorage.getItem('storeCards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  const handleAddCard = (newCard: StoreCard) => {
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem('storeCards', JSON.stringify(updatedCards));
    setIsAddCardOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Store Cards</h1>
        <Button onClick={() => setIsAddCardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Card
        </Button>
      </div>

      <CardList cards={cards} setCards={setCards} />

      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
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