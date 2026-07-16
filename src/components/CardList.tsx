import { useState } from 'react';
import { X, Search } from 'lucide-react';
import StoreCard from '@/components/StoreCard';
import HeroCard from '@/components/HeroCard';
import DeleteCardDialog from '@/components/DeleteCardDialog';
import FullScreenCard from '@/components/FullScreenCard';
import type { StoreCardType } from '@/types/storecard';

const LAST_USED_KEY = 'cardTrooperLastUsed';

type CardListProps = {
  cards: StoreCardType[];
  onDeleteCard: (id: number) => void;
};

const CardList = ({ cards, onDeleteCard }: CardListProps) => {
  const [deleteCardId, setDeleteCardId] = useState<number | null>(null);
  const [fullScreenCard, setFullScreenCard] = useState<StoreCardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUsedId, setLastUsedId] = useState<number | null>(() => {
    const stored = localStorage.getItem(LAST_USED_KEY);
    return stored ? Number(stored) : null;
  });

  const openCard = (card: StoreCardType) => {
    setFullScreenCard(card);
    setLastUsedId(card.id);
    localStorage.setItem(LAST_USED_KEY, String(card.id));
  };

  const isSearching = searchTerm.trim().length > 0;
  const filteredCards = cards.filter(c => c.storeName.toLowerCase().includes(searchTerm.toLowerCase()));
  const heroCard = !isSearching && cards.length > 0
    ? (cards.find(c => c.id === lastUsedId) ?? cards[0])
    : null;
  const gridCards = isSearching ? filteredCards : cards.filter(c => c.id !== heroCard?.id);

  return (
    <>
      {cards.length > 0 && (
        <div className="flex items-center gap-2.5 rounded-2xl px-4 py-3.5" style={{ background: 'var(--surface-2)' }}>
          <Search className="w-[19px] h-[19px] shrink-0" style={{ color: 'var(--text-3)' }} strokeWidth={2.2} />
          <input
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search your cards"
            className="flex-1 bg-transparent outline-none font-medium"
            style={{ color: 'var(--text-1)' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-active)' }} aria-label="Clear search">
              <X className="w-3 h-3" style={{ color: 'var(--text-2)' }} />
            </button>
          )}
        </div>
      )}

      {cards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5">
            <svg width="48" height="70" viewBox="0 0 60 88" fill="none">
              <path d="M44 0L16 48h28z" fill="#F0553D" opacity="0.55" />
              <path d="M16 40h28L16 88z" fill="#8B5E3C" opacity="0.5" />
              <path d="M21 40h23L39 48H16z" fill="#262322" opacity="0.35" />
            </svg>
          </div>
          <h3 className="text-[20px] font-extrabold mb-1.5" style={{ color: 'var(--text-1)' }}>No cards yet</h3>
          <p className="text-[14px] font-medium leading-relaxed max-w-[220px]" style={{ color: 'var(--text-2)' }}>
            Tap <span className="font-extrabold" style={{ color: 'var(--accent)' }}>+</span> to add your first loyalty card
          </p>
        </div>
      )}

      {isSearching && filteredCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-10 h-10 mb-4" style={{ color: 'var(--text-3)' }} />
          <h3 className="text-[18px] font-extrabold mb-1" style={{ color: 'var(--text-1)' }}>No results</h3>
          <p className="text-[14px] font-medium" style={{ color: 'var(--text-2)' }}>Nothing matching &ldquo;{searchTerm}&rdquo;</p>
        </div>
      )}

      {heroCard && (
        <>
          <div className="text-[14px] font-bold tracking-[0.02em] mt-6 mb-3 px-0.5" style={{ color: 'var(--text-2)' }}>
            Recently used
          </div>
          <div className="max-w-sm">
            <HeroCard card={heroCard} onClick={openCard} />
          </div>
        </>
      )}

      {gridCards.length > 0 && (
        <>
          <div className="flex justify-between items-baseline mt-7 mb-3.5 px-0.5">
            <span className="text-[14px] font-bold tracking-[0.02em]" style={{ color: 'var(--text-2)' }}>
              {isSearching ? 'Results' : 'All cards'}
            </span>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {isSearching ? filteredCards.length : cards.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gridCards.map(card => (
              <div key={card.id} className="card-item">
                <StoreCard card={card} onCardClick={openCard} />
              </div>
            ))}
          </div>
        </>
      )}

      {fullScreenCard && (
        <FullScreenCard
          card={fullScreenCard}
          onClose={() => setFullScreenCard(null)}
          onDelete={() => setDeleteCardId(fullScreenCard.id)}
        />
      )}
      <DeleteCardDialog
        isOpen={deleteCardId !== null}
        onClose={() => setDeleteCardId(null)}
        onConfirm={() => {
          if (deleteCardId) {
            onDeleteCard(deleteCardId);
            if (fullScreenCard?.id === deleteCardId) setFullScreenCard(null);
            setDeleteCardId(null);
          }
        }}
      />
    </>
  );
};

export default CardList;
