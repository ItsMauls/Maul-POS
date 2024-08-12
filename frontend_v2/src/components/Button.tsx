import { ButtonProps } from '@/types';
import React from 'react';

const Button: React.FC<ButtonProps> = ({ label, onClick, className, shortcut, icon }) => {
  return (
    <button
      className={`text-white px-4 py-2 rounded-lg ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon && icon}
        <span className=''>{label}</span>
        {shortcut && (
          <span className="text-xs bg-gray-500 px-2 py-1 rounded-lg">
            {shortcut}
          </span>
        )}
      </div>
    </button>
  );
};

export default Button;
