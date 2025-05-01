import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'danger';
}

export const Alert: React.FC<AlertProps> = ({ children, type = 'info' }) => {
  const baseStyle = 'px-4 py-3 rounded relative border';
  let typeStyle = '';

  switch (type) {
    case 'warning':
      typeStyle = 'border-yellow-400 bg-yellow-100 text-yellow-700';
      break;
    case 'danger':
      typeStyle = 'border-red-400 bg-red-100 text-red-700';
      break;
    case 'info':
    default:
      typeStyle = 'border-blue-400 bg-blue-100 text-blue-700';
      break;
  }

  return (
    <div className={`${baseStyle} ${typeStyle}`} role="alert">
      {children}
    </div>
  );
}; 