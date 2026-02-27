import React from 'react';
import { X } from 'lucide-react';
import AddCardForm from './AddCardForm';
import type { StoreCardType } from '@/types/storecard';

interface AddCardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddCard: (newCardData: Omit<StoreCardType, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddCard,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className="relative w-full sm:max-w-sm mac-sheet rounded-t-[14px] sm:rounded-[14px] z-10 max-h-[90vh] overflow-y-auto"
        style={{ border: '1px solid var(--mac-border-strong)', boxShadow: 'var(--mac-shadow-dialog)' }}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-8 h-1 rounded-full" style={{ background: 'var(--mac-border-strong)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-3 border-b"
          style={{ borderColor: 'var(--mac-border)' }}
        >
          <h2 className="text-[15px] font-semibold text-foreground">Add Card</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-muted-foreground"
            style={{ background: 'var(--mac-input-bg)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--mac-input-bg)')}
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
