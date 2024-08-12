import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  options: Option[];
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  register,
  error,
  options,
  placeholder = 'Select an option',
}) => {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select {...register(name)} className="w-full p-2 border rounded">
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