import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
import { ICONS } from '@/lib/icons';

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
        width: 2.2,
        height: 88,
        displayValue: true,
        fontSize: 13,
        margin: 12,
        background: '#FFFFFF',
        lineColor: '#1C1917',
      });
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [card.cardNumber, card.isQRCode]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col anim-fade-in"
      style={{ background: 'var(--c-cream)' }}
    >
      {/* Nav */}
      <div
        className="flex items-center justify-between px-4 bg-white"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ color: 'var(--c-blue)' }}
          aria-label="Close"
        >
          <ChevronDown className="w-5 h-5" />
          <span className="text-[15px] font-medium">Back</span>
        </button>

        <h2
          className="font-display italic text-[18px] absolute left-1/2 -translate-x-1/2"
          style={{ color: 'var(--c-ink)', letterSpacing: '-0.01em' }}
        >
          {card.storeName}
        </h2>

        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 gap-4">
        {/* Card info panel */}
        <div
          className="w-full max-w-sm rounded-[16px] overflow-hidden anim-fade-up"
          style={{
            background: 'var(--c-white)',
            border: '1px solid var(--c-border)',
            boxShadow: '0 4px 20px var(--c-shadow-warm-md)',
            animationDelay: '60ms',
          }}
        >
          <div className="h-[3px] w-full" style={{ backgroundColor: card.color }} />
          <div className="px-5 py-4 flex items-center gap-3">
            <img
              src={card.isQRCode ? ICONS.qrCode : ICONS.barcode}
              alt=""
              className="w-10 h-10 object-contain"
            />
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-0.5"
                style={{ color: 'var(--c-ink-3)' }}
              >
                {card.storeName}
              </p>
              <p
                className="text-[13px]"
                style={{ color: 'var(--c-ink-3)', fontFamily: 'ui-monospace, monospace' }}
              >
                {card.cardNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Barcode / QR code */}
        <div
          className="w-full max-w-sm rounded-[16px] p-5 flex justify-center items-center anim-fade-up"
          style={{
            background: 'var(--c-white)',
            border: '1px solid var(--c-border)',
            boxShadow: '0 2px 10px var(--c-shadow-warm)',
            animationDelay: '120ms',
          }}
        >
          {card.isQRCode ? (
            <QRCode value={card.cardNumber} size={220} />
          ) : (
            <svg ref={barcodeRef} className="w-full max-w-[280px]" />
          )}
        </div>
      </div>

      <div
        className="text-center text-[12px] anim-fade-up"
        style={{
          color: 'var(--c-ink-3)',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          animationDelay: '180ms',
        }}
      >
        Hold up to scanner
      </div>
    </div>
  );
};

export default FullScreenCard;
