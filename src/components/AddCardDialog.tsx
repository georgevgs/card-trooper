import React from 'react';
import { X } from 'lucide-react';
import AddCardForm from './AddCardForm';
import type { StoreCardType } from '@/types/storecard';
import { ICONS } from '@/lib/icons';

interface AddCardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddCard: (newCardData: Omit<StoreCardType, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({
  isOpen, onOpenChange, onAddCard, isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={e => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div className="absolute inset-0 backdrop-warm anim-fade-in" onClick={() => onOpenChange(false)} />

      <div
        className="relative w-full sm:max-w-[380px] rounded-t-[20px] sm:rounded-[16px] z-10 max-h-[92vh] overflow-y-auto anim-sheet"
        style={{
          background: 'var(--c-white)',
          border: '1px solid var(--c-border)',
          boxShadow: '0 24px 64px rgba(28,25,23,0.16), 0 6px 16px rgba(28,25,23,0.08)',
        }}
      >
        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full" style={{ background: 'var(--c-border-2)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-4 pb-3"
          style={{ borderBottom: '1px solid var(--c-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <img src={ICONS.giftCard} alt="" className="w-8 h-8 object-contain" />
            <h2
              className="font-display italic text-[22px]"
              style={{ color: 'var(--c-ink)', letterSpacing: '-0.01em' }}
            >
              Add card.
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'var(--c-cream-2)', color: 'var(--c-ink-2)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <AddCardForm
          onAddCard={onAddCard}
          onClose={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AddCardDialog;
