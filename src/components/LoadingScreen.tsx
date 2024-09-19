import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <LoadingSpinner />
    </div>
  );
};

export default LoadingScreen;
