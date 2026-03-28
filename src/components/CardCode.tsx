import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import type { StoreCardType } from '@/types/storecard';

type CardCodeProps = {
  card: StoreCardType;
  large?: boolean;
};

const CardCode = ({ card, large }: CardCodeProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!card.isQRCode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: 'CODE128',
        width: large ? 2.2 : 1.5,
        height: large ? 88 : 60,
        displayValue: true,
        fontSize: large ? 13 : 12,
        marginTop: large ? 12 : 6,
        marginBottom: large ? 12 : 6,
        textMargin: 2,
        background: large ? '#FFFFFF' : 'transparent',
        lineColor: '#111827',
      });
    }
  }, [card, large]);

  if (card.isQRCode) {
    return (
      <div className="flex justify-center items-center py-1">
        <QRCode value={card.cardNumber} size={large ? 220 : 100} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      <svg ref={barcodeRef} className={large ? 'w-full max-w-[280px]' : 'max-w-full'} />
    </div>
  );
};

export default CardCode;
