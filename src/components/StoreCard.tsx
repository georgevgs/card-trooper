import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card
      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-6" style={{ backgroundColor: card.color }} />
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{card.storeName}</h2>
          <CardMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            onDeleteClick={onDeleteClick}
          />
        </div>
        <CardCode card={card} />
      </CardContent>
    </Card>
  );
};

export default StoreCard;
