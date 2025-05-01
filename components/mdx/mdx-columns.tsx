import React from 'react';

interface ColumnsProps {
  children: React.ReactNode;
}

export const Columns: React.FC<ColumnsProps> = ({ children }) => {
  // Tailwind CSS の Flexbox を使用して横並びにする
  // gap-8 でカラム間のスペースを設ける
  return (
    <div className="flex flex-col md:flex-row gap-8 my-6">
      {children}
    </div>
  );
}; 