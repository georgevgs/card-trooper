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
};

const AddCardForm = ({ onAddCard }: AddCardFormProps) => {
  const [storeName, setStoreName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [color, setColor] = useState('#0000FF'); // Default blue color
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

    setStoreName('');
    setCardNumber('');
    setColor('#0000FF');
    setIsQRCode(false);
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
        <Label htmlFor="cardNumber">Card Number / Barcode</Label>
        <Input
          id="cardNumber"
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
            className="w-12 h-12 p-1 rounded"
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
      <Button type="submit" className="w-full">Add Card</Button>
    </form>
  );
};

export default AddCardForm;