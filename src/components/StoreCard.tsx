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
      className="rounded-xl overflow-hidden cursor-pointer select-none card-interactive flex"
      onClick={() => { if (!isMenuOpen) onCardClick(card); }}
    >
      {/* Left color bar */}
      <div className="w-[4px] shrink-0" style={{ backgroundColor: card.color }} />

      <div className="flex-1 min-w-0">
        <div className="px-3.5 pt-3 pb-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: card.color }} />
              <h2 className="text-[15px] font-semibold truncate leading-tight" style={{ color: 'var(--text-1)' }}>
                {card.storeName}
              </h2>
            </div>
            <CardMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} onDeleteClick={onDeleteClick} />
          </div>

          <div className="rounded-lg p-3" style={{ background: 'var(--bg)' }}>
            <CardCode card={card} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
