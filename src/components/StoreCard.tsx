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

  const handleClick = () => {
    if (!isMenuOpen) {
      onCardClick(card);
    }
  };

  return (
    <div
      className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#E5E5EA]/60 cursor-pointer active:scale-[0.98] transition-transform duration-100"
      onClick={handleClick}
    >
      {/* Color accent strip */}
      <div className="h-1.5 w-full" style={{ backgroundColor: card.color }} />

      <div className="px-4 pt-3 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[16px] font-semibold text-[#1C1C1E] leading-tight">{card.storeName}</h2>
          <CardMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            onDeleteClick={onDeleteClick}
          />
        </div>
        <div className="bg-[#F2F2F7] rounded-[10px] p-3">
          <CardCode card={card} />
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
