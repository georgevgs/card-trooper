import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <LoadingSpinner />
    </div>
  );
};

export default LoadingScreen;
