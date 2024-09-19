import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Add New Card</DialogTitle>
        </DialogHeader>
        <AddCardForm
          onAddCard={onAddCard}
          onClose={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
