import React from 'react';

interface OfflineAlertProps {
  isOffline: boolean;
}

const OfflineAlert: React.FC<OfflineAlertProps> = ({ isOffline }) => {
  if (!isOffline) {
    return null;
  }

  return (
    <div
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
      role="alert"
    >
      <p className="font-bold">You are offline</p>
      <p>Some features may be limited until you reconnect.</p>
    </div>
  );
};

export default OfflineAlert;
