import { useEffect, useRef, useState } from 'react';
import { QrCode } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { contrastTextColor, surfaceOverlay } from '@/lib/utils';
import type { StoreCardType } from '@/types/storecard';

type HeroCardProps = {
  card: StoreCardType;
  onClick: (card: StoreCardType) => void;
};

/** Decorative mini barcode inside the hero's white strip. */
const StripBarcode = ({ value }: { value: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    try {
      JsBarcode(ref.current, value, {
        format: 'CODE128',
        width: 1.4,
        height: 20,
        displayValue: false,
        margin: 0,
        background: 'transparent',
        lineColor: '#262322',
      });
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [value]);

  if (failed) {
    return <span className="text-[11px] font-mono truncate" style={{ color: '#262322' }}>{value}</span>;
  }
  return <svg ref={ref} className="max-w-full" />;
};

const HeroCard = ({ card, onClick }: HeroCardProps) => {
  const textColor = contrastTextColor(card.color);
  const monogram = card.storeName.trim().charAt(0).toUpperCase() || '?';

  return (
    <button
      type="button"
      onClick={() => onClick(card)}
      className="card-tile block w-full text-left rounded-3xl overflow-hidden relative select-none"
      style={{ backgroundColor: card.color, color: textColor, boxShadow: `0 18px 34px -16px ${card.color}` }}
    >
      <div className="absolute rounded-full" style={{ right: -44, top: -44, width: 180, height: 180, background: surfaceOverlay(card.color, 0.09) }} />
      <div className="absolute rounded-full" style={{ right: 34, bottom: -52, width: 120, height: 120, background: surfaceOverlay(card.color, 0.07) }} />

      <div className="relative px-5 pt-5 pb-4">
        <div className="flex justify-between items-start">
          <div
            className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[22px] font-extrabold"
            style={{ background: surfaceOverlay(card.color, 0.16) }}
          >
            {monogram}
          </div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] pt-1.5" style={{ opacity: 0.72 }}>
            {card.isQRCode ? 'QR code' : 'Barcode'}
          </span>
        </div>

        <div className="text-[23px] font-extrabold mt-5 tracking-[-0.01em] truncate">{card.storeName}</div>
        <div className="text-[13px] font-medium mt-0.5 truncate" style={{ opacity: 0.8 }}>
          Member · {card.cardNumber}
        </div>

        <div className="mt-4 h-[34px] rounded-lg px-3 flex items-center justify-center gap-2 overflow-hidden" style={{ background: '#FFFFFF' }}>
          {card.isQRCode ? (
            <>
              <QrCode className="w-4 h-4 shrink-0" style={{ color: '#262322' }} aria-hidden />
              <span className="text-[11px] font-mono truncate" style={{ color: '#262322' }}>{card.cardNumber}</span>
            </>
          ) : (
            <StripBarcode value={card.cardNumber} />
          )}
        </div>
      </div>
    </button>
  );
};

export default HeroCard;
