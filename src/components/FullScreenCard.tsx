import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode.react';

type StoreCard = {
  id: string;
  storeName: string;
  cardNumber: string;
  color: string;
  isQRCode: boolean;
};

type FullScreenCardProps = {
  card: StoreCard;
  onClose: () => void;
};

const FullScreenCard = ({ card, onClose }: FullScreenCardProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!card.isQRCode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        margin: 10
      });
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [card.cardNumber, card.isQRCode]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: card.color }}
    >
      <div className="p-4 flex items-center relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white absolute left-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-white w-full text-center">
          {card.storeName}
        </h2>
      </div>
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-2xl w-full max-w-md flex justify-center items-center">
          {card.isQRCode ? (
            <QRCode value={card.cardNumber} size={256} />
          ) : (
            <svg ref={barcodeRef} className="w-full"></svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;