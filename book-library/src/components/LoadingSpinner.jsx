import React from 'react';
import { FiBook } from 'react-icons/fi';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-300 dark:border-gray-700 rounded-full`}></div>
        
        {/* Spinning Ring */}
        <div className={`${sizeClasses[size]} absolute top-0 left-0 border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
        
        {/* Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <FiBook className={`${size === 'xl' ? 'w-8 h-8' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} text-primary animate-pulse`} />
        </div>
      </div>
      
      {text && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
