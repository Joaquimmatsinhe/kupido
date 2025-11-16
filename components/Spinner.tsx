
import React from 'react';

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  return (
    <i className={`fa-solid fa-spinner fa-spin ${sizeClasses[size]}`}></i>
  );
};

export default Spinner;
