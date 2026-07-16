import { useEffect, useState } from 'react';
import { ChevronLeft, Trash2, CreditCard, QrCode, Barcode, Sun, type LucideIcon } from 'lucide-react';
import CardCode from './CardCode';
import { contrastTextColor, surfaceOverlay } from '@/lib/utils';
import type { StoreCardType } from '@/types/storecard';

type FullScreenCardProps = {
  card: StoreCardType;
  onClose: () => void;
  onDelete: () => void;
};

const InfoRow = ({ icon: Icon, label, value, divider }: { icon: LucideIcon; label: string; value: string; divider?: boolean }) => (
  <div className="flex items-center gap-3.5 px-[18px] py-4" style={{ borderBottom: divider ? '1px solid #F4EFE8' : 'none' }}>
    <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text-3)' }}>{label}</div>
      <div className="text-[15px] font-bold mt-px break-all" style={{ color: 'var(--text-1)' }}>{value}</div>
    </div>
  </div>
);

const FullScreenCard = ({ card, onClose, onDelete }: FullScreenCardProps) => {
  const [mode, setMode] = useState<'barcode' | 'qr'>(card.isQRCode ? 'qr' : 'barcode');
  const textColor = contrastTextColor(card.color);
  const monogram = card.storeName.trim().charAt(0).toUpperCase() || '?';
  // Long values (URLs on QR cards) don't survive the wide letter-spaced treatment
  const isSpacedNumber = card.cardNumber.length <= 16;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keep the screen awake while the code is shown — the OS releases the lock
  // when the tab is hidden, so re-acquire it on return.
  useEffect(() => {
    if (!('wakeLock' in navigator)) return;

    let wakeLock: WakeLockSentinel | null = null;
    let active = true;

    const acquire = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        if (!active) await wakeLock.release();
      } catch {
        // Denied or unsupported — not critical
      }
    };

    acquire();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      active = false;
      document.removeEventListener('visibilitychange', onVisibility);
      wakeLock?.release().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto anim-fade-in" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md mx-auto px-5 pb-10" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <div className="flex justify-between items-center py-2.5">
          <button onClick={onClose} className="icon-circle" aria-label="Back">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.4} />
          </button>
          <button onClick={onDelete} className="icon-circle" style={{ color: 'var(--red)' }} aria-label="Delete card">
            <Trash2 className="w-[18px] h-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div
          className="rounded-[26px] overflow-hidden relative mt-2 anim-slide-up"
          style={{ backgroundColor: card.color, color: textColor, boxShadow: `0 20px 38px -18px ${card.color}` }}
        >
          <div className="absolute rounded-full" style={{ right: -50, top: -50, width: 190, height: 190, background: surfaceOverlay(card.color, 0.1) }} />
          <div className="absolute rounded-full" style={{ left: -40, bottom: -60, width: 150, height: 150, background: surfaceOverlay(card.color, 0.07) }} />
          <div className="relative px-6 pt-6 pb-7">
            <div className="flex justify-between items-start">
              <div
                className="w-[58px] h-[58px] rounded-[18px] flex items-center justify-center text-[25px] font-extrabold"
                style={{ background: surfaceOverlay(card.color, 0.18) }}
              >
                {monogram}
              </div>
              <span className="text-[12px] font-bold uppercase tracking-[0.1em] pt-2" style={{ opacity: 0.75 }}>
                {card.isQRCode ? 'QR code' : 'Barcode'}
              </span>
            </div>
            <div className="text-[26px] font-extrabold mt-5 tracking-[-0.01em] truncate">{card.storeName}</div>
            <div className="text-[13.5px] font-medium mt-0.5 truncate" style={{ opacity: 0.82 }}>
              Member · {card.cardNumber}
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl p-5 mt-4 anim-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)', animationDelay: '50ms' }}
        >
          <div className="seg-track">
            <button className={`seg-tab ${mode === 'barcode' ? 'seg-tab-active' : ''}`} onClick={() => setMode('barcode')}>
              Barcode
            </button>
            <button className={`seg-tab ${mode === 'qr' ? 'seg-tab-active' : ''}`} onClick={() => setMode('qr')}>
              QR code
            </button>
          </div>

          <div className="flex flex-col items-center pt-5">
            <CardCode card={card} mode={mode} large />
            <div
              className={`mt-4 text-center ${isSpacedNumber ? 'text-[16px] font-bold tracking-[0.32em] pl-[0.32em]' : 'text-[13px] font-mono break-all'}`}
              style={{ color: 'var(--text-1)' }}
            >
              {card.cardNumber}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--surface-2)', color: 'var(--text-3)' }}>
            <Sun className="w-[17px] h-[17px]" strokeWidth={2} />
            <span className="text-[13px] font-semibold">Screen stays awake for scanning</span>
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden mt-4 anim-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', animationDelay: '100ms' }}
        >
          <InfoRow icon={CreditCard} label="Member number" value={card.cardNumber} divider />
          <InfoRow icon={card.isQRCode ? QrCode : Barcode} label="Code type" value={card.isQRCode ? 'QR code' : 'Barcode'} />
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
