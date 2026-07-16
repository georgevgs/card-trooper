import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import type { StoreCardType } from '@/types/storecard';

type CardCodeProps = {
  card: StoreCardType;
  mode: 'barcode' | 'qr';
  large?: boolean;
};

const CardCode = ({ card, mode, large }: CardCodeProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [barcodeFailed, setBarcodeFailed] = useState(false);

  useEffect(() => {
    if (mode !== 'barcode' || !barcodeRef.current) return;
    try {
      JsBarcode(barcodeRef.current, card.cardNumber, {
        format: 'CODE128',
        width: large ? 2 : 1.5,
        height: large ? 96 : 60,
        displayValue: false,
        margin: 0,
        marginTop: large ? 8 : 4,
        marginBottom: large ? 8 : 4,
        background: '#FFFFFF',
        lineColor: '#1A1714',
      });
      setBarcodeFailed(false);
    } catch {
      setBarcodeFailed(true);
    }
  }, [card, mode, large]);

  if (mode === 'qr') {
    return (
      <div className="flex justify-center items-center py-1">
        <QRCodeSVG value={card.cardNumber} size={large ? 184 : 100} fgColor="#262322" bgColor="#FFFFFF" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <svg
        ref={barcodeRef}
        className={large ? 'w-full max-w-[300px]' : 'max-w-full'}
        style={barcodeFailed ? { display: 'none' } : undefined}
      />
      {barcodeFailed && (
        <p className="text-[13px] font-semibold py-4 text-center" style={{ color: 'var(--text-3)' }}>
          This number can&rsquo;t be shown as a barcode
        </p>
      )}
    </div>
  );
};

export default CardCode;
