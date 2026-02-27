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

  const clearSearch = () => setSearchTerm('');

  return (
    <>
      {/* Search bar */}
      {isSearchVisible && (
        <div className="mb-4">
          <div
            className="flex items-center rounded-[8px] px-3 gap-2 border"
            style={{
              background: 'var(--mac-input-bg)',
              borderColor: 'var(--mac-border)',
            }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--mac-section)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              autoFocus
              className="flex-1 py-2 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="rounded-full p-0.5 transition-colors"
                style={{ color: 'var(--mac-section)' }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Section header */}
      {!isSearchVisible && cards.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--mac-section)' }}>
            My Cards
          </p>
          <p className="text-[11px]" style={{ color: 'var(--mac-section)' }}>
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </p>
        </div>
      )}

      {/* Empty state */}
      {filteredCards.length === 0 && !isSearchVisible && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-4"
            style={{ background: 'var(--mac-input-bg)', border: '1px solid var(--mac-border)' }}
          >
            <svg
              className="w-7 h-7"
              style={{ color: 'var(--mac-section)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-foreground mb-1">No Cards Yet</p>
          <p className="text-[13px] text-muted-foreground">Click + to add your first card</p>
        </div>
      )}

      {filteredCards.length === 0 && isSearchVisible && searchTerm && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[15px] font-semibold text-foreground mb-1">No Results</p>
          <p className="text-[13px] text-muted-foreground">No cards matching "{searchTerm}"</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCards.map((card) => (
          <StoreCard
            key={card.id}
            card={card}
            onCardClick={setFullScreenCard}
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
