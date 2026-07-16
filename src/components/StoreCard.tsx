import React from 'react';
import { QrCode, Barcode } from 'lucide-react';
import { contrastTextColor } from '@/lib/utils';
import type { StoreCardType } from '@/types/storecard';

type StoreCardProps = {
  card: StoreCardType;
  onCardClick: (card: StoreCardType) => void;
};

const StoreCard = ({ card, onCardClick }: StoreCardProps) => {
  const textColor = contrastTextColor(card.color);
  const CodeIcon = card.isQRCode ? QrCode : Barcode;

  return (
    <button
      type="button"
      onClick={() => onCardClick(card)}
      className="card-tile rounded-xl aspect-[8/5] w-full p-3.5 flex flex-col justify-between items-start text-left select-none"
      style={{ backgroundColor: card.color, color: textColor }}
    >
      <span className="text-[15px] font-bold leading-tight truncate w-full">
        {card.storeName}
      </span>
      <span className="flex items-end justify-between w-full gap-2">
        <span className="text-[11px] font-mono truncate" style={{ opacity: 0.75 }}>
          {card.cardNumber}
        </span>
        <CodeIcon className="w-3.5 h-3.5 shrink-0" style={{ opacity: 0.6 }} aria-hidden />
      </span>
    </button>
  );
};

export default StoreCard;
