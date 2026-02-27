import React, { useState } from 'react';
import CardMenu from '@/components/CardMenu';
import CardCode from '@/components/CardCode';
import type { StoreCardType } from '@/types/storecard';

type StoreCardProps = {
  card: StoreCardType;
  onCardClick: (card: StoreCardType) => void;
  onDeleteClick: () => void;
};

const StoreCard = ({ card, onCardClick, onDeleteClick }: StoreCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-[14px] overflow-hidden cursor-pointer select-none"
      style={{
        background: 'var(--c-white)',
        border: '1px solid var(--c-border)',
        boxShadow: hovered
          ? '0 8px 24px var(--c-shadow-warm-md), 0 2px 6px var(--c-shadow-warm)'
          : '0 1px 3px var(--c-shadow-warm), 0 2px 8px rgba(28,25,23,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onClick={() => { if (!isMenuOpen) onCardClick(card); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Color accent strip */}
      <div className="h-[3.5px] w-full" style={{ backgroundColor: card.color }} />

      <div className="px-3.5 pt-3 pb-3.5">
        {/* Card name row */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-[14px] font-semibold truncate pr-1 leading-tight"
            style={{ color: 'var(--c-ink)' }}
          >
            {card.storeName}
          </h2>
          <CardMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            onDeleteClick={onDeleteClick}
          />
        </div>

        {/* Barcode / QR area */}
        <div
          className="rounded-[9px] p-3"
          style={{ background: 'var(--c-cream-2)' }}
        >
          <CardCode card={card} />
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
