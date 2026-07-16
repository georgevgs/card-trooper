import React from 'react';
import { X } from 'lucide-react';
import AddCardForm from './AddCardForm';
import type { StoreCardType } from '@/types/storecard';

interface AddCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCard: (data: Omit<StoreCardType, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({ isOpen, onOpenChange, onAddCard, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={e => { if (e.target === e.currentTarget) onOpenChange(false); }}>
      <div className="absolute inset-0 overlay anim-fade-in" onClick={() => onOpenChange(false)} />

      <div
        className="relative w-full sm:max-w-[380px] rounded-t-[28px] sm:rounded-xl z-10 max-h-[92vh] overflow-y-auto anim-slide-up"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-overlay)' }}
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em]" style={{ color: 'var(--text-1)' }}>Add a card</h2>
          <button onClick={() => onOpenChange(false)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-2)', color: 'var(--text-1)' }} aria-label="Close">
            <X className="w-[18px] h-[18px]" strokeWidth={2.4} />
          </button>
        </div>

        <AddCardForm onAddCard={onAddCard} onClose={() => onOpenChange(false)} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AddCardDialog;
