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
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        textMargin: 0,
      });
    }
  }, [card]);

  if (card.isQRCode) {
    return (
      <div className="flex justify-center items-center">
        <QRCode value={card.cardNumber} size={128} />
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
