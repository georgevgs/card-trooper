import React from 'react';
import CardMenu from '@/components/CardMenu';
import CardCode from '@/components/CardCode';
import type { StoreCardType } from '@/types/storecard';

type StoreCardProps = {
  card: StoreCardType;
  onCardClick: (card: StoreCardType) => void;
  onDeleteClick: () => void;
};

const StoreCard = ({ card, onCardClick, onDeleteClick }: StoreCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer select-none card-interactive"
      onClick={() => { if (!isMenuOpen) onCardClick(card); }}
    >
      <div className="h-[3px] w-full" style={{ backgroundColor: card.color }} />

      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold truncate pr-1 leading-tight" style={{ color: 'var(--text-1)' }}>
            {card.storeName}
          </h2>
          <CardMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} onDeleteClick={onDeleteClick} />
        </div>

        <div className="rounded-lg p-3" style={{ background: 'var(--bg)' }}>
          <CardCode card={card} />
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
