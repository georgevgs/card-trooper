import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import JsBarcode from 'jsbarcode';

type StoreCard = {
  id: string;
  storeName: string;
  cardNumber: string;
  color: string;
};

type FullScreenCardProps = {
  card: StoreCard;
  onClose: () => void;
};

const FullScreenCard = ({ card, onClose }: FullScreenCardProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true
      });
    }

    // Set maximum brightness
    const prevBrightness = document.body.style.filter;
    document.body.style.filter = 'brightness(100%)';

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Revert brightness and unlock scroll on component unmount
    return () => {
      document.body.style.filter = prevBrightness;
      document.body.style.overflow = 'auto';
    };
  }, [card.cardNumber]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4"
      style={{ backgroundColor: card.color }}
    >
      <div className="w-full flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold text-white">{card.storeName}</h2>
        <div className="w-12"></div> {/* Spacer for alignment */}
      </div>
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white p-8 rounded-lg max-w-full">
          <svg ref={barcodeRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;