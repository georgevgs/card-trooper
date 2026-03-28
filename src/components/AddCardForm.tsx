import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { StoreCardType } from '@/types/storecard';
import { ICONS } from '@/lib/icons';

type AddCardFormProps = {
  onAddCard: (card: Omit<StoreCardType, 'id'>) => void;
  onClose: () => void;
  isLoading: boolean;
};

const BRAND_COLORS = ['#FF2D78', '#4DA6FF', '#00C9A7', '#FF6B35', '#7B2FF2', '#E8FF00'];

const Row: React.FC<{ label: string; children: React.ReactNode; last?: boolean }> = ({ label, children, last }) => (
  <div className="flex items-center px-4 gap-3" style={{ borderBottom: last ? 'none' : '1px solid var(--border-default)' }}>
    <label className="text-[13px] font-medium w-24 shrink-0 py-3 select-none" style={{ color: 'var(--text-2)' }}>{label}</label>
    {children}
  </div>
);

const AddCardForm = ({ onAddCard, onClose, isLoading }: AddCardFormProps) => {
  const [form, setForm] = useState<Omit<StoreCardType, 'id'>>({
    storeName: '', cardNumber: '', color: '#FF2D78', isQRCode: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!form.storeName || !form.cardNumber) return;
    await onAddCard(form);
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pt-4 pb-5 space-y-3">
      <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border-default)' }}>
        <Row label="Store Name">
          <input placeholder="e.g. Starbucks" value={form.storeName} onChange={e => set('storeName', e.target.value)}
            required disabled={isLoading} className="flex-1 py-3 bg-transparent outline-none disabled:opacity-50" style={{ color: 'var(--text-1)' }} />
        </Row>
        <Row label="Card Number" last>
          <input type={form.isQRCode ? 'text' : 'tel'} inputMode={form.isQRCode ? 'text' : 'numeric'}
            pattern={form.isQRCode ? undefined : '[0-9]*'} placeholder={form.isQRCode ? 'Any text or URL' : '1234567890'}
            value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)}
            required disabled={isLoading} className="flex-1 py-3 bg-transparent outline-none disabled:opacity-50" style={{ color: 'var(--text-1)' }} />
        </Row>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border-default)' }}>
        <div className="px-4 py-3">
          <span className="text-[13px] font-medium select-none block mb-2.5" style={{ color: 'var(--text-2)' }}>Card Color</span>
          <div className="flex items-center gap-2">
            {BRAND_COLORS.map(c => (
              <button key={c} type="button" disabled={isLoading}
                onClick={() => set('color', c)}
                className="w-7 h-7 rounded-full transition-all duration-150"
                style={{
                  background: c,
                  outline: form.color === c ? `2px solid ${c}` : '2px solid transparent',
                  outlineOffset: '2px',
                  opacity: isLoading ? 0.5 : 1,
                }}
              />
            ))}
            <div className="ml-auto flex items-center gap-2">
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                disabled={isLoading} aria-label="Custom color" className="w-7 h-7 rounded-md cursor-pointer border-0 p-0.5 bg-transparent" />
              <input type="text" value={form.color} onChange={e => set('color', e.target.value)}
                pattern="^#[0-9A-Fa-f]{6}$" placeholder="#FF2D78" maxLength={7} disabled={isLoading}
                className="w-[72px] text-right bg-transparent outline-none uppercase font-mono text-[12px]" style={{ color: 'var(--text-2)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img src={ICONS.qrCode} alt="" className="w-7 h-7 object-contain" />
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>QR Code</p>
              <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>Instead of a barcode</p>
            </div>
          </div>
          <button type="button" role="switch" aria-checked={form.isQRCode} disabled={isLoading}
            onClick={() => set('isQRCode', !form.isQRCode)}
            className="relative inline-flex h-[24px] w-[44px] items-center rounded-full transition-colors duration-200 disabled:opacity-40"
            style={{ background: form.isQRCode ? 'var(--brand-pink)' : 'var(--border-strong)' }}>
            <span className="inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: form.isQRCode ? 'translateX(23px)' : 'translateX(3px)' }} />
          </button>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full text-[14px] py-2.5 rounded-lg btn-primary flex items-center justify-center gap-2">
        {isLoading ? <><LoadingSpinner /><span>Adding&hellip;</span></> : 'Add Card'}
      </button>
      <button type="button" onClick={onClose} disabled={isLoading} className="w-full text-[14px] font-medium py-2.5 rounded-lg btn-ghost disabled:opacity-40" style={{ color: 'var(--text-2)' }}>
        Cancel
      </button>
    </form>
  );
};

export default AddCardForm;
