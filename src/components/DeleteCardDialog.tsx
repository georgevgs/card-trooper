import React from 'react';
import { ICONS } from '@/lib/icons';

type DeleteCardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCardDialog = ({ isOpen, onClose, onConfirm }: DeleteCardDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 backdrop-warm anim-fade-in" onClick={onClose} />

      <div
        className="relative w-full max-w-[288px] rounded-[16px] z-10 overflow-hidden text-center anim-scale-in"
        style={{
          background: 'var(--c-white)',
          border: '1px solid var(--c-border)',
          boxShadow: '0 24px 64px rgba(28,25,23,0.16), 0 6px 16px rgba(28,25,23,0.08)',
        }}
      >
        <div className="px-6 pt-6 pb-5">
          <img
            src={ICONS.giftCard}
            alt=""
            className="w-14 h-14 object-contain mx-auto mb-3 opacity-40"
          />
          <h3
            className="font-display italic text-[22px] mb-1.5"
            style={{ color: 'var(--c-ink)', letterSpacing: '-0.01em' }}
          >
            Delete card?
          </h3>
          <p className="text-[13px] leading-snug" style={{ color: 'var(--c-ink-2)' }}>
            This card will be permanently deleted and cannot be recovered.
          </p>
        </div>

        <div className="flex" style={{ borderTop: '1px solid var(--c-border)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-[14px] font-medium transition-colors"
            style={{ color: 'var(--c-ink-2)', borderRight: '1px solid var(--c-border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 text-[14px] font-semibold transition-colors"
            style={{ color: 'var(--c-red)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCardDialog;
