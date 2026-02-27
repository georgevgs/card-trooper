import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineAlertProps {
  isOffline: boolean;
}

const OfflineAlert: React.FC<OfflineAlertProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div
      className="flex items-center gap-3 rounded-[10px] px-4 py-3 mb-5 anim-fade-up"
      style={{
        background: 'rgba(217,119,6,0.08)',
        border: '1px solid rgba(217,119,6,0.2)',
      }}
    >
      <WifiOff className="w-4 h-4 shrink-0" style={{ color: '#D97706' }} />
      <div>
        <p className="text-[13px] font-semibold" style={{ color: '#92400E' }}>
          You're offline
        </p>
        <p className="text-[12px]" style={{ color: '#B45309' }}>
          Showing cached cards
        </p>
      </div>
    </div>
  );
};

export default OfflineAlert;
