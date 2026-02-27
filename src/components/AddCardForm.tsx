import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { StoreCardType } from '@/types/storecard';
import { ICONS } from '@/lib/icons';

type AddCardFormProps = {
  onAddCard: (card: Omit<StoreCardType, 'id'>) => void;
  onClose: () => void;
  isLoading: boolean;
};

const Row: React.FC<{ label: string; children: React.ReactNode; last?: boolean }> = ({ label, children, last }) => (
  <div className="flex items-center px-4 gap-3" style={{ borderBottom: last ? 'none' : '1px solid var(--c-border)' }}>
    <label className="text-[13px] font-medium w-24 shrink-0 py-3 select-none" style={{ color: 'var(--c-ink-2)' }}>
      {label}
    </label>
    {children}
  </div>
);

const AddCardForm = ({ onAddCard, onClose, isLoading }: AddCardFormProps) => {
  const [form, setForm] = useState<Omit<StoreCardType, 'id'>>({
    storeName: '', cardNumber: '', color: '#6FFFE9', isQRCode: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!form.storeName || !form.cardNumber) return;
    await onAddCard(form);
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pt-4 pb-5 space-y-3">
      {/* Name + Number */}
      <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--c-cream)', border: '1px solid var(--c-border)' }}>
        <Row label="Store Name">
          <input
            placeholder="e.g. Starbucks"
            value={form.storeName}
            onChange={e => set('storeName', e.target.value)}
            required disabled={isLoading}
            className="flex-1 py-3 bg-transparent outline-none disabled:opacity-50"
            style={{ color: 'var(--c-ink)', fontSize: '15px' }}
          />
        </Row>
        <Row label="Card Number" last>
          <input
            type={form.isQRCode ? 'text' : 'tel'}
            inputMode={form.isQRCode ? 'text' : 'numeric'}
            pattern={form.isQRCode ? undefined : '[0-9]*'}
            placeholder={form.isQRCode ? 'Any text or URL' : '1234567890'}
            value={form.cardNumber}
            onChange={e => set('cardNumber', e.target.value)}
            required disabled={isLoading}
            className="flex-1 py-3 bg-transparent outline-none disabled:opacity-50"
            style={{ color: 'var(--c-ink)', fontSize: '15px' }}
          />
        </Row>
      </div>

      {/* Color */}
      <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--c-cream)', border: '1px solid var(--c-border)' }}>
        <div className="flex items-center px-4 py-3 gap-3">
          <span className="text-[13px] font-medium flex-1 select-none" style={{ color: 'var(--c-ink-2)' }}>
            Card Color
          </span>
          <div className="flex items-center gap-2.5">
            <input
              type="color" name="color" value={form.color}
              onChange={e => set('color', e.target.value)}
              disabled={isLoading} aria-label="Pick card color"
              style={{ colorScheme: 'light' }}
              className="w-9 h-9 rounded-[7px] cursor-pointer border-0 p-0.5 bg-transparent"
            />
            <input
              type="text" value={form.color}
              onChange={e => set('color', e.target.value)}
              pattern="^#[0-9A-Fa-f]{6}$" placeholder="#6FFFE9" maxLength={7}
              disabled={isLoading}
              className="w-20 text-right bg-transparent outline-none uppercase"
              style={{ color: 'var(--c-ink-2)', fontSize: '13px', fontFamily: 'ui-monospace, monospace' }}
            />
          </div>
        </div>
      </div>

      {/* QR Code toggle */}
      <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--c-cream)', border: '1px solid var(--c-border)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img src={ICONS.qrCode} alt="" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--c-ink)' }}>Use QR Code</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--c-ink-3)' }}>Instead of a barcode</p>
            </div>
          </div>
          <button
            type="button" role="switch" aria-checked={form.isQRCode}
            disabled={isLoading}
            onClick={() => set('isQRCode', !form.isQRCode)}
            className="relative inline-flex h-[26px] w-[46px] items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40"
            style={{ background: form.isQRCode ? '#34C759' : 'var(--c-border-2)' }}
          >
            <span
              className="inline-block h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: form.isQRCode ? 'translateX(22px)' : 'translateX(3px)' }}
            />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit" disabled={isLoading}
        className="w-full text-white text-[14px] font-semibold py-[12px] rounded-[10px] disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: 'var(--c-blue)' }}
      >
        {isLoading ? <><LoadingSpinner /><span>Adding…</span></> : 'Add Card'}
      </button>

      <button
        type="button" onClick={onClose} disabled={isLoading}
        className="w-full text-[14px] font-medium py-3 rounded-[10px] transition-colors disabled:opacity-40"
        style={{ color: 'var(--c-ink-2)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        Cancel
      </button>
    </form>
  );
};

export default AddCardForm;
