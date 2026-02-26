import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-7 w-7 border-[2.5px] border-[#E5E5EA] border-t-[#007AFF]"></div>
    </div>
  );
};

export default LoadingSpinner;
