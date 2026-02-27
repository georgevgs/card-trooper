import React from 'react';
import { AlertTriangle } from 'lucide-react';

type DeleteCardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCardDialog = ({ isOpen, onClose, onConfirm }: DeleteCardDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      />

      {/* macOS Alert Dialog */}
      <div
        className="relative w-full max-w-[280px] mac-sheet rounded-[12px] z-10 overflow-hidden text-center"
        style={{ border: '1px solid var(--mac-border-strong)', boxShadow: 'var(--mac-shadow-dialog)' }}
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex justify-center mb-3">
            <div className="w-11 h-11 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
            </div>
          </div>
          <p className="text-[15px] font-semibold text-foreground mb-1.5">Delete Card?</p>
          <p className="text-[13px] text-muted-foreground leading-snug">
            This card will be permanently deleted and cannot be recovered.
          </p>
        </div>

        {/* Buttons */}
        <div
          className="flex border-t"
          style={{ borderColor: 'var(--mac-border)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 text-[14px] font-medium text-[#007AFF] transition-colors border-r"
            style={{ borderColor: 'var(--mac-border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-[14px] font-semibold text-[#FF3B30] transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCardDialog;
