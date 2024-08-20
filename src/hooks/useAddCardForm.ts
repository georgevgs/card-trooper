import { useState } from 'react';
import type { StoreCard } from '@/types/storecard';

export const useAddCardForm = (onAddCard: (card: StoreCard) => void) => {
  const [formState, setFormState] = useState<StoreCard>({
    storeName: '',
    cardNumber: '',
    color: '#6FFFE9',
    isQRCode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue = getInputValue(type, e.target);

    if (name === 'cardNumber' && !formState.isQRCode) {
      newValue = (newValue as string).replace(/\D/g, '');
    }

    updateFormState(name, newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCard(formState);
  };

  const getInputValue = (inputType: string, target: EventTarget & HTMLInputElement) => {
    if (inputType === 'checkbox') {
      return target.checked;
    }
    return target.value;
  };

  const updateFormState = (name: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formState,
    handleInputChange,
    handleSubmit,
  };
};
