import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineAlert: React.FC<{ isOffline: boolean }> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg px-4 py-3 mb-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
      <WifiOff className="w-4 h-4 shrink-0" style={{ color: 'var(--amber)' }} />
      <div>
        <p className="text-[13px] font-medium" style={{ color: '#92400E' }}>You're offline</p>
        <p className="text-[12px]" style={{ color: '#B45309' }}>Showing cached cards</p>
      </div>
    </div>
  );
};

export default OfflineAlert;
