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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate form
    if (!formState.storeName || !formState.cardNumber) {
      return;
    }

    await onAddCard(formState);
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="color"
              id="color"
              name="color"
              value={formState.color}
              onChange={handleInputChange}
              className="w-16 h-16 sm:w-12 sm:h-12 p-1 rounded-lg cursor-pointer border-2 border-gray-300"
              disabled={isLoading}
              aria-label="Pick card color"
              style={{ colorScheme: 'light' }}
            />
          </div>
          <Input
            type="text"
            name="color"
            value={formState.color}
            onChange={handleInputChange}
            pattern="^#[0-9A-Fa-f]{6}$"
            placeholder="#6FFFE9"
            maxLength={7}
            className="flex-grow uppercase"
            disabled={isLoading}
            aria-label="Enter color hex code"
          />
        </div>
        <p className="text-xs text-gray-500">Tap the color square to pick a color</p>
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
