import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { StoreCardType } from '@/types/storecard';

type AddCardFormProps = {
  onAddCard: (card: Omit<StoreCardType, 'id'>) => void;
  onClose: () => void;
  isLoading: boolean;
};

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
    <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
      {/* Store Name + Card Number */}
      <div className="bg-white rounded-[12px] overflow-hidden divide-y divide-[#E5E5EA]">
        <div className="flex items-center px-4">
          <label className="text-[15px] text-[#1C1C1E] w-28 shrink-0 py-3">Store Name</label>
          <input
            name="storeName"
            placeholder="e.g. Starbucks"
            value={formState.storeName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
          />
        </div>
        <div className="flex items-center px-4">
          <label className="text-[15px] text-[#1C1C1E] w-28 shrink-0 py-3">Card Number</label>
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
            className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Color */}
      <div className="bg-white rounded-[12px] overflow-hidden">
        <div className="flex items-center px-4 py-3 gap-4">
          <label className="text-[15px] text-[#1C1C1E] flex-1">Card Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="color"
              value={formState.color}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-label="Pick card color"
              style={{ colorScheme: 'light' }}
              className="w-10 h-10 rounded-[8px] cursor-pointer border-0 p-0.5 bg-transparent"
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
              className="w-24 text-[14px] text-[#3C3C43] text-right bg-transparent outline-none uppercase font-mono"
            />
          </div>
        </div>
      </div>

      {/* QR Code toggle */}
      <div className="bg-white rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[15px] text-[#1C1C1E]">Use QR Code</p>
            <p className="text-[12px] text-[#3C3C43]/60 mt-0.5">Instead of a barcode</p>
          </div>
          {/* iOS-style toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={formState.isQRCode}
            disabled={isLoading}
            onClick={() =>
              setFormState((prev) => ({ ...prev, isQRCode: !prev.isQRCode }))
            }
            className={`relative inline-flex h-[31px] w-[51px] items-center rounded-full transition-colors duration-200 focus:outline-none ${
              formState.isQRCode ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'
            }`}
          >
            <span
              className={`inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                formState.isQRCode ? 'translate-x-[22px]' : 'translate-x-[2px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Actions */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#007AFF] text-white text-[17px] font-semibold py-[14px] rounded-[14px] disabled:opacity-50 transition-opacity active:opacity-80 flex items-center justify-center gap-2"
      >
        {isLoading ? <><LoadingSpinner /> <span>Adding…</span></> : 'Add Card'}
      </button>

      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="w-full text-[#007AFF] text-[17px] font-medium py-3 transition-opacity active:opacity-60"
      >
        Cancel
      </button>
    </form>
  );
};

export default AddCardForm;
