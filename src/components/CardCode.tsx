import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import type { StoreCardType } from '@/types/storecard';

type CardCodeProps = {
  card: StoreCardType;
};

const CardCode = ({ card }: CardCodeProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!card.isQRCode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: 'CODE128',
        width: 1.5,
        height: 60,
        displayValue: true,
        fontSize: 12,
        marginTop: 6,
        marginBottom: 6,
        textMargin: 2,
        background: 'transparent',
        lineColor: '#1C1C1E',
      });
    }
  }, [card]);

  if (card.isQRCode) {
    return (
      <div className="flex justify-center items-center py-1">
        <QRCode value={card.cardNumber} size={100} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      <svg ref={barcodeRef} className="max-w-full"></svg>
    </div>
  );
};

export default CardCode;
