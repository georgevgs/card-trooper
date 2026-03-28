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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 overlay anim-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-[300px] rounded-xl z-10 overflow-hidden text-center anim-scale-in" style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-overlay)' }}>
        <div className="px-6 pt-6 pb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#FEF2F2' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--red)' }} />
          </div>
          <h3 className="text-[17px] font-semibold mb-1.5" style={{ color: 'var(--text-1)' }}>Delete card?</h3>
          <p className="text-[13px] leading-snug" style={{ color: 'var(--text-2)' }}>This can't be undone.</p>
        </div>

        <div className="flex" style={{ borderTop: '1px solid var(--border-default)' }}>
          <button onClick={onClose} className="flex-1 py-3 text-[14px] font-medium btn-ghost" style={{ color: 'var(--text-2)', borderRight: '1px solid var(--border-default)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 text-[14px] btn-danger-text">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCardDialog;
