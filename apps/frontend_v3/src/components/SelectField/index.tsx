import { cn } from '@/lib/cn';
import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  className?: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  options: Option[];
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  className,
  label,
  name,
  register,
  error,
  options,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select {...props} {...register(name)} className={cn("w-full p-2 border rounded", className)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
          key={option.value} 
          value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};