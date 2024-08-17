import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddCardForm: React.FC = () => {
  const [storeName, setStoreName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [color, setColor] = useState('#0000FF'); // Default blue color

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard = {
      id: Date.now().toString(),
      storeName,
      cardNumber,
      color,
    };

    const storedCards = localStorage.getItem('storeCards');
    const cards = storedCards ? JSON.parse(storedCards) : [];
    cards.push(newCard);
    localStorage.setItem('storeCards', JSON.stringify(cards));

    setStoreName('');
    setCardNumber('');
    setColor('#0000FF');

    // Trigger a page reload to update the CardList
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Card</CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button type="submit">Add Card</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCardForm;