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

const EmptyBolt: React.FC = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
    <path d="M30 3L10 28h12l-4 17 22-26H27z" fill="var(--brand-blue)" opacity="0.5" />
    <path d="M28 5L9 29h11l-3 15 20-24H26z" fill="var(--brand-pink)" opacity="0.45" />
  </svg>
);

const CardList = ({ cards, onDeleteCard, isSearchVisible }: CardListProps) => {
  const [deleteCardId, setDeleteCardId] = useState<number | null>(null);
  const [fullScreenCard, setFullScreenCard] = useState<StoreCardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState<StoreCardType[]>(cards);

  useEffect(() => {
    setFilteredCards(cards.filter(c => c.storeName.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, cards]);

  return (
    <>
      {isSearchVisible && (
        <div className="mb-5">
          <div
            className="flex items-center rounded-lg px-3.5 gap-2.5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-3)' }} />
            <input
              type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search cards\u2026" autoFocus
              className="flex-1 py-3 bg-transparent outline-none" style={{ color: 'var(--text-1)' }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-active)' }}>
                <X className="w-3 h-3" style={{ color: 'var(--text-2)' }} />
              </button>
            )}
          </div>
        </div>
      )}

      {!isSearchVisible && cards.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>My Cards</span>
          <span className="text-[11px] font-medium tabular-nums" style={{ color: 'var(--text-3)' }}>{cards.length}</span>
        </div>
      )}

      {filteredCards.length === 0 && !isSearchVisible && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5">
            <EmptyBolt />
          </div>
          <h3 className="text-[20px] font-semibold mb-1.5" style={{ color: 'var(--text-1)' }}>No cards yet</h3>
          <p className="text-[14px] leading-relaxed max-w-[220px]" style={{ color: 'var(--text-2)' }}>
            Tap <span style={{ color: 'var(--brand-pink)' }}>+</span> to add your first loyalty card
          </p>
        </div>
      )}

      {filteredCards.length === 0 && isSearchVisible && searchTerm && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-10 h-10 mb-4" style={{ color: 'var(--text-3)' }} />
          <h3 className="text-[18px] font-semibold mb-1" style={{ color: 'var(--text-1)' }}>No results</h3>
          <p className="text-[14px]" style={{ color: 'var(--text-2)' }}>Nothing matching &ldquo;{searchTerm}&rdquo;</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCards.map(card => (
          <div key={card.id} className="card-item">
            <StoreCard card={card} onCardClick={setFullScreenCard} onDeleteClick={() => setDeleteCardId(card.id)} />
          </div>
        ))}
      </div>

      <DeleteCardDialog isOpen={deleteCardId !== null} onClose={() => setDeleteCardId(null)} onConfirm={() => { if (deleteCardId) { onDeleteCard(deleteCardId); setDeleteCardId(null); } }} />
      {fullScreenCard && <FullScreenCard card={fullScreenCard} onClose={() => setFullScreenCard(null)} />}
    </>
  );
};

export default CardList;
