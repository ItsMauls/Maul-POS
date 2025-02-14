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
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  className,
  label,
  name,
  register,
  error,
  options,
  placeholder = 'Select an option',
  onChange,
  value,
  ...props
}) => {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select 
        {...register(name)} 
        className={cn("w-full p-2 border rounded", className)}
        onChange={onChange}
        value={value}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};