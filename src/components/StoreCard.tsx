import { QrCode, Barcode } from 'lucide-react';
import { contrastTextColor, surfaceOverlay } from '@/lib/utils';
import type { StoreCardType } from '@/types/storecard';

type StoreCardProps = {
  card: StoreCardType;
  onCardClick: (card: StoreCardType) => void;
};

const StoreCard = ({ card, onCardClick }: StoreCardProps) => {
  const textColor = contrastTextColor(card.color);
  const monogram = card.storeName.trim().charAt(0).toUpperCase() || '?';
  const CodeIcon = card.isQRCode ? QrCode : Barcode;

  return (
    <button
      type="button"
      onClick={() => onCardClick(card)}
      className="card-tile block w-full text-left select-none"
    >
      <div
        className="relative rounded-[18px] h-24 overflow-hidden p-3"
        style={{ backgroundColor: card.color, boxShadow: `0 12px 22px -14px ${card.color}` }}
      >
        <div className="absolute rounded-full" style={{ right: -24, top: -24, width: 92, height: 92, background: surfaceOverlay(card.color, 0.1) }} />
        <div
          className="relative w-[42px] h-[42px] rounded-[13px] flex items-center justify-center text-[17px] font-extrabold"
          style={{ background: surfaceOverlay(card.color, 0.18), color: textColor }}
        >
          {monogram}
        </div>
        <CodeIcon
          className="absolute right-3.5 bottom-3 w-5 h-5"
          style={{ color: textColor, opacity: 0.85 }}
          strokeWidth={1.7}
          aria-hidden
        />
      </div>
      <div className="px-1 pt-2.5">
        <div className="text-[15px] font-extrabold tracking-[-0.01em] truncate" style={{ color: 'var(--text-1)' }}>
          {card.storeName}
        </div>
        <div className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-3)' }}>
          {card.cardNumber}
        </div>
      </div>
    </button>
  );
};

export default StoreCard;
