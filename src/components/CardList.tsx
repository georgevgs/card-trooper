import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import StoreCard from '@/components/StoreCard';
import DeleteCardDialog from '@/components/DeleteCardDialog';
import FullScreenCard from '@/components/FullScreenCard';
import type { StoreCardType } from '@/types/storecard';
import { ICONS } from '@/lib/icons';

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
    setFilteredCards(cards.filter(c =>
      c.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, cards]);

  const handleDeleteCard = (id: number) => { onDeleteCard(id); setDeleteCardId(null); };

  return (
    <>
      {/* Search bar */}
      {isSearchVisible && (
        <div className="mb-5 anim-fade-up">
          <div
            className="flex items-center rounded-[10px] px-3.5 gap-2.5"
            style={{ background: 'var(--c-white)', border: '1px solid var(--c-border)', boxShadow: '0 1px 3px var(--c-shadow-warm)' }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--c-ink-3)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search cards…"
              autoFocus
              className="flex-1 py-3 bg-transparent outline-none"
              style={{ color: 'var(--c-ink)', fontSize: '15px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'var(--c-ink-4)' }}
              >
                <X className="w-3 h-3" style={{ color: 'var(--c-ink-2)' }} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Section header */}
      {!isSearchVisible && cards.length > 0 && (
        <div className="mb-4 flex items-center justify-between anim-fade-up">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: 'var(--c-ink-3)' }}
          >
            My Cards
          </span>
          <span className="text-[11px] font-medium tabular-nums" style={{ color: 'var(--c-ink-3)' }}>
            {cards.length}
          </span>
        </div>
      )}

      {/* Empty state */}
      {filteredCards.length === 0 && !isSearchVisible && (
        <div className="flex flex-col items-center justify-center py-20 text-center anim-fade-up">
          <img
            src={ICONS.wallet}
            alt="Empty wallet"
            className="w-24 h-24 object-contain mb-5"
            style={{ filter: 'drop-shadow(0 8px 16px rgba(28,25,23,0.12))' }}
          />
          <h3
            className="font-display italic text-[26px] mb-2"
            style={{ color: 'var(--c-ink)', letterSpacing: '-0.01em' }}
          >
            No cards yet.
          </h3>
          <p className="text-[14px] leading-relaxed max-w-[220px]" style={{ color: 'var(--c-ink-2)' }}>
            Tap the + button to add your first loyalty card
          </p>
        </div>
      )}

      {filteredCards.length === 0 && isSearchVisible && searchTerm && (
        <div className="flex flex-col items-center justify-center py-20 text-center anim-fade-up">
          <img
            src={ICONS.shoppingBag}
            alt=""
            className="w-16 h-16 object-contain mb-4 opacity-60"
          />
          <h3
            className="font-display italic text-[22px] mb-1"
            style={{ color: 'var(--c-ink)', letterSpacing: '-0.01em' }}
          >
            No results.
          </h3>
          <p className="text-[14px]" style={{ color: 'var(--c-ink-2)' }}>
            No cards matching "{searchTerm}"
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCards.map(card => (
          <div key={card.id} className="card-item">
            <StoreCard
              card={card}
              onCardClick={setFullScreenCard}
              onDeleteClick={() => setDeleteCardId(card.id)}
            />
          </div>
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
