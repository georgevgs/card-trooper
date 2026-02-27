import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-6 w-6"
        style={{
          border: '2px solid var(--c-border)',
          borderTopColor: 'var(--c-blue)',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
