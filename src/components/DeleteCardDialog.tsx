import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DeleteCardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCardDialog = ({ isOpen, onClose, onConfirm }: DeleteCardDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="mx-auto w-[calc(100%-2rem)] sm:max-w-[425px] p-6 rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this card?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the card.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-row sm:justify-end">
          <AlertDialogCancel className="mb-2 sm:mb-0">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCardDialog;
