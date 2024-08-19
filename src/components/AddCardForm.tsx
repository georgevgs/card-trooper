import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type StoreCard = {
  id: string;
  storeName: string;
  cardNumber: string;
  color: string;
  isQRCode: boolean;
};

type AddCardFormProps = {
  onAddCard: (card: StoreCard) => void;
  onClose: () => void;
};

const AddCardForm: React.FC<AddCardFormProps> = ({ onAddCard, onClose }) => {
  const [storeName, setStoreName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [color, setColor] = useState('#000000');
  const [isQRCode, setIsQRCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: StoreCard = {
      id: Date.now().toString(),
      storeName,
      cardNumber,
      color,
      isQRCode,
    };

    onAddCard(newCard);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name</Label>
        <Input
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          type={isQRCode ? 'text' : 'number'}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">Card Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-0 rounded"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-grow"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="qr-code"
          checked={isQRCode}
          onCheckedChange={setIsQRCode}
        />
        <Label htmlFor="qr-code">Use QR Code</Label>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Card</Button>
      </div>
    </form>
  );
};

export default AddCardForm;