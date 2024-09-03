import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import LoadingSpinner from './LoadingSpinner';
import type { StoreCardType } from '@/types/storecard';

type AddCardFormProps = {
  onAddCard: (card: Omit<StoreCardType, 'id'>) => void;
  onClose: () => void;
  isLoading: boolean;
};

const AddCardForm = ({ onAddCard, onClose, isLoading }: AddCardFormProps) => {
  const [formState, setFormState] = useState<Omit<StoreCardType, 'id'>>({
    storeName: '',
    cardNumber: '',
    color: '#6FFFE9',
    isQRCode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCard(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name</Label>
        <Input
          id="storeName"
          name="storeName"
          value={formState.storeName}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          type={formState.isQRCode ? 'text' : 'tel'}
          inputMode={formState.isQRCode ? 'text' : 'numeric'}
          pattern={formState.isQRCode ? undefined : '[0-9]*'}
          value={formState.cardNumber}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">Card Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="color"
            id="color"
            name="color"
            value={formState.color}
            onChange={handleInputChange}
            className="w-10 h-10 p-0 rounded"
            disabled={isLoading}
          />
          <Input
            type="text"
            name="color"
            value={formState.color}
            onChange={handleInputChange}
            className="flex-grow"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isQRCode"
          name="isQRCode"
          checked={formState.isQRCode}
          onCheckedChange={(checked) =>
            handleInputChange({
              target: { name: 'isQRCode', type: 'checkbox', checked },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          disabled={isLoading}
        />
        <Label htmlFor="isQRCode">Use QR Code</Label>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Add Card'}
        </Button>
      </div>
    </form>
  );
};

export default AddCardForm;
