import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineAlertProps {
  isOffline: boolean;
}

const OfflineAlert: React.FC<OfflineAlertProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="flex items-center gap-3 bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-[8px] px-3 py-2.5 mb-4">
      <WifiOff className="w-4 h-4 text-[#FF9500] shrink-0" />
      <div>
        <p className="text-[14px] font-semibold text-[#FF9500]">You're offline</p>
        <p className="text-[12px] text-[#FF9500]/70">Showing cached cards</p>
      </div>
    </div>
  );
};

export default OfflineAlert;
