import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
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
        <div className="mb-4 relative">
          <div className="flex items-center bg-white rounded-[12px] border border-[#E5E5EA] px-3 gap-2">
            <Search className="w-4 h-4 text-[#C7C7CC] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              autoFocus
              className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="text-[#C7C7CC] active:text-[#8E8E93]">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {filteredCards.length === 0 && !isSearchVisible && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-[#E5E5EA] rounded-[18px] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <p className="text-[17px] font-semibold text-[#1C1C1E] mb-1">No Cards Yet</p>
          <p className="text-[15px] text-[#3C3C43]/60">Tap + to add your first card</p>
        </div>
      )}

      {filteredCards.length === 0 && isSearchVisible && searchTerm && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[17px] font-semibold text-[#1C1C1E] mb-1">No Results</p>
          <p className="text-[15px] text-[#3C3C43]/60">No cards matching "{searchTerm}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
