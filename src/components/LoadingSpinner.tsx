import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5" style={{ border: '2px solid var(--border-default)', borderTopColor: 'var(--accent)' }} />
  </div>
);

export default LoadingSpinner;
