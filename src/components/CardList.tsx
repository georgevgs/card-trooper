import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import StoreCard from '@/components/StoreCard';
import DeleteCardDialog from '@/components/DeleteCardDialog';
import FullScreenCard from '@/components/FullScreenCard';
import type { StoreCardType } from '@/types/storecard';

type CardListProps = {
  cards: StoreCardType[];
  onDeleteCard: (id: number) => void;
  isSearchVisible: boolean;
};

const CardList = ({ cards, onDeleteCard, isSearchVisible }: CardListProps) => {
  const [deleteCardId, setDeleteCardId] = useState<number | null>(null);
  const [fullScreenCard, setFullScreenCard] = useState<StoreCardType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCards, setFilteredCards] = useState<StoreCardType[]>(cards);

  useEffect(() => {
    const filtered = cards.filter((card) =>
      card.storeName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCards(filtered);
  }, [searchTerm, cards]);

  const handleDeleteCard = (id: number) => {
    onDeleteCard(id);
    setDeleteCardId(null);
  };

  const handleCardClick = (card: StoreCardType) => {
    setFullScreenCard(card);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
      {isSearchVisible && (
        <div className="mb-6 relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cards..."
            className="pl-4 pr-10 py-2 w-full rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none transition duration-300 ease-in-out"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <StoreCard
            key={card.id}
            card={card}
            onCardClick={handleCardClick}
            onDeleteClick={() => setDeleteCardId(card.id)}
          />
        ))}
      </div>
      <DeleteCardDialog
        isOpen={deleteCardId !== null}
        onClose={() => setDeleteCardId(null)}
        onConfirm={() => deleteCardId && handleDeleteCard(deleteCardId)}
      />
      {fullScreenCard && (
        <FullScreenCard card={fullScreenCard} onClose={() => setFullScreenCard(null)} />
      )}
    </>
  );
};

export default CardList;
