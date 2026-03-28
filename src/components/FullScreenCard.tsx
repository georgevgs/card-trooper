import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import CardCode from './CardCode';

type FullScreenCardProps = {
  card: { id: number; storeName: string; cardNumber: string; color: string; isQRCode: boolean };
  onClose: () => void;
};

const FullScreenCard: React.FC<FullScreenCardProps> = ({ card, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col anim-fade-in" style={{ background: 'var(--bg)' }}>
      {/* Header with card color accent */}
      <div
        style={{
          paddingTop: 'max(0px, env(safe-area-inset-top))',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="h-[3px] w-full" style={{ backgroundColor: card.color }} />
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onClose} className="flex items-center gap-1 btn-ghost-accent rounded-lg px-2 py-1" aria-label="Close">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[14px] font-medium">Back</span>
          </button>
          <span className="text-[15px] font-semibold absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--text-1)' }}>
            {card.storeName}
          </span>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 gap-5">
        {/* Card info */}
        <div
          className="w-full max-w-sm rounded-xl overflow-hidden anim-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', animationDelay: '50ms' }}
        >
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '18' }}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: card.color }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{card.storeName}</p>
              <p className="text-[12px] font-mono" style={{ color: 'var(--text-3)' }}>{card.cardNumber}</p>
            </div>
          </div>
        </div>

        {/* Barcode / QR */}
        <div
          className="w-full max-w-sm rounded-xl p-5 flex justify-center anim-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)', animationDelay: '100ms' }}
        >
          <CardCode card={card} large />
        </div>
      </div>

      <div className="text-center text-[12px] py-6" style={{ color: 'var(--text-3)', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        Hold up to scanner
      </div>
    </div>
  );
};

export default FullScreenCard;
