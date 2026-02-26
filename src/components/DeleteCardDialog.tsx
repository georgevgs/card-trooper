import React from 'react';

type DeleteCardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCardDialog = ({ isOpen, onClose, onConfirm }: DeleteCardDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Action Sheet */}
      <div className="relative w-full sm:max-w-sm z-10 px-4 pb-safe pb-4 space-y-2"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {/* Main sheet */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[16px] overflow-hidden divide-y divide-[#3C3C43]/10">
          <div className="px-4 py-4 text-center">
            <p className="text-[13px] font-semibold text-[#3C3C43]/60 uppercase tracking-wide mb-1">
              Delete Card
            </p>
            <p className="text-[13px] text-[#3C3C43]/60">
              This card will be permanently deleted and cannot be recovered.
            </p>
          </div>
          <button
            onClick={onConfirm}
            className="w-full py-[17px] text-[17px] font-semibold text-[#FF3B30] active:bg-[#F2F2F7] transition-colors"
          >
            Delete Card
          </button>
        </div>

        {/* Cancel button — separate per iOS HIG */}
        <button
          onClick={onClose}
          className="w-full bg-white/90 backdrop-blur-xl rounded-[16px] py-[17px] text-[17px] font-semibold text-[#007AFF] active:bg-[#F2F2F7] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteCardDialog;
