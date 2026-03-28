import React, { useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
import { ICONS } from '@/lib/icons';

type FullScreenCardProps = {
  card: { id: number; storeName: string; cardNumber: string; color: string; isQRCode: boolean };
  onClose: () => void;
};

const FullScreenCard: React.FC<FullScreenCardProps> = ({ card, onClose }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!card.isQRCode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: 'CODE128', width: 2.2, height: 88,
        displayValue: true, fontSize: 13, margin: 12,
        background: '#FFFFFF', lineColor: '#111827',
      });
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [card.cardNumber, card.isQRCode]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col anim-fade-in" style={{ background: 'var(--bg)' }}>
      <div
        className="flex items-center justify-between px-4"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: '12px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <button onClick={onClose} className="flex items-center gap-1 btn-ghost-accent rounded-lg px-2 py-1" aria-label="Close">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[14px] font-medium">Back</span>
        </button>
        <span className="text-[15px] font-semibold absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--text-1)' }}>
          {card.storeName}
        </span>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 gap-4">
        <div
          className="w-full max-w-sm rounded-xl overflow-hidden anim-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', animationDelay: '50ms' }}
        >
          <div className="h-[3px] w-full" style={{ backgroundColor: card.color }} />
          <div className="px-5 py-4 flex items-center gap-3">
            <img src={card.isQRCode ? ICONS.qrCode : ICONS.barcode} alt="" className="w-10 h-10 object-contain" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-3)' }}>{card.storeName}</p>
              <p className="text-[13px] font-mono" style={{ color: 'var(--text-2)' }}>{card.cardNumber}</p>
            </div>
          </div>
        </div>

        <div
          className="w-full max-w-sm rounded-xl p-5 flex justify-center anim-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)', animationDelay: '100ms' }}
        >
          {card.isQRCode ? <QRCode value={card.cardNumber} size={220} /> : <svg ref={barcodeRef} className="w-full max-w-[280px]" />}
        </div>
      </div>

      <div className="text-center text-[12px] py-6" style={{ color: 'var(--text-3)', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        Hold up to scanner
      </div>
    </div>
  );
};

export default FullScreenCard;
