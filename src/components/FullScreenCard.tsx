import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';

type StoreCard = {
  id: number;
  storeName: string;
  cardNumber: string;
  color: string;
  isQRCode: boolean;
};

type FullScreenCardProps = {
  card: StoreCard;
  onClose: () => void;
};

const FullScreenCard: React.FC<FullScreenCardProps> = ({ card, onClose }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!card.isQRCode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        margin: 10,
      });
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [card.cardNumber, card.isQRCode]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F2F2F7]">
      {/* Navigation bar */}
      <div
        className="flex items-center justify-center px-4 py-4 relative"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="absolute left-4 w-9 h-9 flex items-center justify-center text-[#007AFF] active:opacity-60 transition-opacity"
          aria-label="Close"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <h2 className="text-[17px] font-semibold text-[#1C1C1E]">{card.storeName}</h2>
      </div>

      {/* Card visual */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 gap-6">
        {/* Card chip with color accent */}
        <div className="w-full max-w-sm bg-white rounded-[20px] overflow-hidden shadow-lg">
          <div className="h-2 w-full" style={{ backgroundColor: card.color }} />
          <div className="px-6 py-5">
            <p className="text-[13px] font-medium text-[#3C3C43]/60 mb-1 uppercase tracking-wider">
              {card.storeName}
            </p>
            <p className="text-[13px] text-[#3C3C43]/40 font-mono">{card.cardNumber}</p>
          </div>
        </div>

        {/* Code */}
        <div className="w-full max-w-sm bg-white rounded-[20px] p-6 shadow-sm flex justify-center items-center">
          {card.isQRCode ? (
            <QRCode value={card.cardNumber} size={220} />
          ) : (
            <svg ref={barcodeRef} className="w-full max-w-[280px]"></svg>
          )}
        </div>
      </div>

      <div
        className="pb-safe pb-8 text-center text-[13px] text-[#3C3C43]/40"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        Tap the code for scanner
      </div>
    </div>
  );
};

export default FullScreenCard;
