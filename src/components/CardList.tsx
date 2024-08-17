import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import JsBarcode from 'jsbarcode';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StoreCard {
    id: string;
    storeName: string;
    cardNumber: string;
    color: string;
}

const CardList: React.FC = () => {
    const [cards, setCards] = useState<StoreCard[]>([]);
    const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

    useEffect(() => {
        const storedCards = localStorage.getItem('storeCards');
        if (storedCards) {
            setCards(JSON.parse(storedCards));
        }
    }, []);

    useEffect(() => {
        cards.forEach(card => {
            JsBarcode(`#barcode-${card.id}`, card.cardNumber, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true
            });
        });
    }, [cards]);

    const deleteCard = (id: string) => {
        const updatedCards = cards.filter(card => card.id !== id);
        setCards(updatedCards);
        localStorage.setItem('storeCards', JSON.stringify(updatedCards));
        setDeleteCardId(null);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {cards.map(card => (
            <Card key={card.id} className="relative overflow-hidden">
                <CardContent className="p-6">
                    <div className={`text-white p-4 -mx-6 -mt-6 mb-4`} style={{ backgroundColor: card.color }}>
                        <h2 className="text-xl font-semibold">{card.storeName}</h2>
                    </div>
                    <div className="flex justify-center mb-4">
                        <svg id={`barcode-${card.id}`}></svg>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setDeleteCardId(card.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
            </Card>
          ))}
          <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this card?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the card.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCardId && deleteCard(deleteCardId)}>
                          Delete
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
    );
};

export default CardList;