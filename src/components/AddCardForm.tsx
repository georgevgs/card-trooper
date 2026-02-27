import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { StoreCardType } from '@/types/storecard';

type AddCardFormProps = {
  onAddCard: (card: Omit<StoreCardType, 'id'>) => void;
  onClose: () => void;
  isLoading: boolean;
};

const FormRow: React.FC<{
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}> = ({ label, children, isLast }) => (
  <div
    className={`flex items-center px-3 gap-3 ${!isLast ? 'border-b' : ''}`}
    style={{ borderColor: 'var(--mac-border)' }}
  >
    <label className="text-[13px] text-foreground w-24 shrink-0 py-2.5 select-none">
      {label}
    </label>
    {children}
  </div>
);

const AddCardForm = ({ onAddCard, onClose, isLoading }: AddCardFormProps) => {
  const [formState, setFormState] = useState<Omit<StoreCardType, 'id'>>({
    storeName: '',
    cardNumber: '',
    color: '#6FFFE9',
    isQRCode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formState.storeName || !formState.cardNumber) return;
    await onAddCard(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4 pt-3 space-y-3">
      {/* Store Name + Card Number */}
      <div
        className="rounded-[8px] overflow-hidden border"
        style={{ background: 'hsl(var(--card))', borderColor: 'var(--mac-border)' }}
      >
        <FormRow label="Store Name">
          <input
            name="storeName"
            placeholder="e.g. Starbucks"
            value={formState.storeName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="flex-1 py-2.5 bg-transparent outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
        </FormRow>
        <FormRow label="Card Number" isLast>
          <input
            name="cardNumber"
            type={formState.isQRCode ? 'text' : 'tel'}
            inputMode={formState.isQRCode ? 'text' : 'numeric'}
            pattern={formState.isQRCode ? undefined : '[0-9]*'}
            placeholder={formState.isQRCode ? 'Any text or URL' : '1234567890'}
            value={formState.cardNumber}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="flex-1 py-2.5 bg-transparent outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
        </FormRow>
      </div>

      {/* Color */}
      <div
        className="rounded-[8px] overflow-hidden border"
        style={{ background: 'hsl(var(--card))', borderColor: 'var(--mac-border)' }}
      >
        <div className="flex items-center px-3 py-2.5 gap-3">
          <label className="text-[13px] text-foreground flex-1 select-none">Card Color</label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              name="color"
              value={formState.color}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-label="Pick card color"
              style={{ colorScheme: 'light' }}
              className="w-8 h-8 rounded-[6px] cursor-pointer border-0 p-0.5 bg-transparent"
            />
            <input
              type="text"
              name="color"
              value={formState.color}
              onChange={handleInputChange}
              pattern="^#[0-9A-Fa-f]{6}$"
              placeholder="#6FFFE9"
              maxLength={7}
              disabled={isLoading}
              aria-label="Enter color hex code"
              className="w-20 text-[12px] text-muted-foreground text-right bg-transparent outline-none uppercase font-mono"
            />
          </div>
        </div>
      </div>

      {/* QR Code toggle */}
      <div
        className="rounded-[8px] overflow-hidden border"
        style={{ background: 'hsl(var(--card))', borderColor: 'var(--mac-border)' }}
      >
        <div className="flex items-center justify-between px-3 py-2.5">
          <div>
            <p className="text-[13px] text-foreground">Use QR Code</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Instead of a barcode</p>
          </div>
          {/* macOS-style toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={formState.isQRCode}
            disabled={isLoading}
            onClick={() => setFormState((prev) => ({ ...prev, isQRCode: !prev.isQRCode }))}
            className="relative inline-flex h-[22px] w-[38px] items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2 disabled:opacity-40"
            style={{ background: formState.isQRCode ? '#34C759' : 'var(--mac-input-bg)' }}
          >
            <span
              className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                formState.isQRCode ? 'translate-x-[18px]' : 'translate-x-[2px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Actions */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#007AFF] text-white text-[14px] font-semibold py-[9px] rounded-[8px] disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
      >
        {isLoading ? <><LoadingSpinner /><span>Adding…</span></> : 'Add Card'}
      </button>

      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="w-full text-[#007AFF] text-[14px] font-medium py-2.5 rounded-[8px] transition-colors disabled:opacity-40"
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        Cancel
      </button>
    </form>
  );
};

export default AddCardForm;
