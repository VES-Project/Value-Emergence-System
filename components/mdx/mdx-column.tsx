import React from 'react';

interface ColumnProps {
  children: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ children }) => {
  // flex-1 でカラムが利用可能なスペースを均等に分け合うようにする
  // (必要に応じて幅を固定することも可能 e.g., md:w-1/2)
  return (
    <div className="flex-1">
      {children}
    </div>
  );
}; 