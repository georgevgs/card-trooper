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
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-sm bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] z-10 max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-9 h-1 bg-[#3C3C43]/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-[20px] font-bold text-[#1C1C1E]">Add Card</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 bg-[#E5E5EA] rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-[#3C3C43]" />
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
