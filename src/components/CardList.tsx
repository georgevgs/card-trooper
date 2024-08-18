import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';
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
import FullScreenCard from './FullScreenCard';

type StoreCard = {
    id: string;
    storeName: string;
    cardNumber: string;
    color: string;
    isQRCode: boolean;
};

type CardListProps = {
    cards: StoreCard[];
    setCards: React.Dispatch<React.SetStateAction<StoreCard[]>>;
};

const CardList = ({ cards, setCards }: CardListProps) => {
    const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
    const [fullScreenCard, setFullScreenCard] = useState<StoreCard | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        cards.forEach(card => {
            if (!card.isQRCode) {
                JsBarcode(`#barcode-${card.id}`, card.cardNumber, {
                    format: "CODE128",
                    width: 2,
                    height: 100,
                    displayValue: true
                });
            }
        });
    }, [cards]);

    const deleteCard = (id: string) => {
        const updatedCards = cards.filter(card => card.id !== id);
        setCards(updatedCards);
        localStorage.setItem('storeCards', JSON.stringify(updatedCards));
        setDeleteCardId(null);
    };

    const handleCardClick = (card: StoreCard) => {
        if (!isMenuOpen && deleteCardId === null) {
            setFullScreenCard(card);
        }
    };

    const handleCloseFullScreen = () => {
        setFullScreenCard(null);
    };

    const renderCard = (card: StoreCard) => (
      <Card
        key={card.id}
        className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={() => handleCardClick(card)}
      >
          <div className="h-6" style={{ backgroundColor: card.color }} />
          <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{card.storeName}</h2>
                  <DropdownMenu onOpenChange={setIsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                              <MoreVertical className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setDeleteCardId(card.id);
                          }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
              <div className="flex justify-center mb-4">
                  {card.isQRCode ? (
                    <QRCode value={card.cardNumber} size={128} />
                  ) : (
                    <svg id={`barcode-${card.id}`}></svg>
                  )}
              </div>
          </CardContent>
      </Card>
    );

    return (
      <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(renderCard)}
          </div>
          <AlertDialog open={deleteCardId !== null} onOpenChange={(open) => {
              if (!open) setDeleteCardId(null);
          }}>
              <AlertDialogContent className="mx-auto w-[calc(100%-2rem)] sm:max-w-[425px] p-6 rounded-2xl">
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this card?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the card.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:flex-row sm:justify-end">
                      <AlertDialogCancel className="mb-2 sm:mb-0">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCardId && deleteCard(deleteCardId)}>
                          Delete
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
          {fullScreenCard && (
            <FullScreenCard
              card={fullScreenCard}
              onClose={handleCloseFullScreen}
            />
          )}
      </>
    );
};

export default CardList;