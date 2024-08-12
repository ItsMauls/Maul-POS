import React from 'react';
import { FaSpinner } from 'react-icons/fa';

import { cn } from '../../../lib/cn';
import { ButtonTypes } from './type';

const Button = ({
  children,
  onClick,
  hasIcon,
  icon,
  isLoading,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: ButtonTypes) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={cn(
        'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none',
        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:none text-black',
        className
      )}
      {...props}
    >
      {isLoading && <FaSpinner className="mr-2 animate-spin" />}
      <span className='mr-2'>
        {hasIcon && icon && !isLoading && iconPosition === 'left' && icon}
      </span>
      {children}
      <span className='ml-2'>
        {hasIcon && icon && !isLoading && iconPosition === 'right' && icon}
      </span>
    </button>
  );
};


export default Button;
