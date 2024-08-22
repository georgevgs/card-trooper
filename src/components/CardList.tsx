import React, { useState } from 'react';
import StoreCard from '@/components/StoreCard';
import DeleteCardDialog from '@/components/DeleteCardDialog';
import FullScreenCard from '@/components/FullScreenCard';
import type { StoreCardType } from '@/types/storecard';

type CardListProps = {
  cards: StoreCardType[];
  onDeleteCard: (id: number) => void;
};

const CardList = ({ cards, onDeleteCard }: CardListProps) => {
  const [deleteCardId, setDeleteCardId] = useState<number | null>(null);
  const [fullScreenCard, setFullScreenCard] = useState<StoreCardType | null>(null);

  const handleDeleteCard = (id: number) => {
    onDeleteCard(id);
    setDeleteCardId(null);
  };

  const handleCardClick = (card: StoreCardType) => {
    setFullScreenCard(card);
  };

  const renderCards = () => {
    return cards.map((card) => (
      <StoreCard
        key={card.id}
        card={card}
        onCardClick={handleCardClick}
        onDeleteClick={() => setDeleteCardId(card.id)}
      />
    ));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderCards()}</div>
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
