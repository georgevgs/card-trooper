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
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isMenuOpen) onCardClick(card);
  };

  return (
    <div
      className="rounded-[10px] overflow-hidden cursor-pointer transition-all duration-150 mac-card"
      style={{
        background: isHovered ? 'var(--mac-hover)' : 'hsl(var(--card))',
        border: '1px solid var(--mac-border)',
        boxShadow: 'var(--mac-shadow-card)',
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Color accent strip */}
      <div className="h-[3px] w-full" style={{ backgroundColor: card.color }} />

      <div className="px-3 pt-2.5 pb-3">
        <div className="flex justify-between items-center mb-2.5">
          <h2 className="text-[13px] font-medium text-foreground leading-tight">{card.storeName}</h2>
          <CardMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            onDeleteClick={onDeleteClick}
          />
        </div>
        <div
          className="rounded-[7px] p-2.5"
          style={{ background: 'var(--mac-input-bg)' }}
        >
          <CardCode card={card} />
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
