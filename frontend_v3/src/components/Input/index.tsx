// InputField.tsx
import React, { FC } from 'react';
import { InputFieldProps } from './type';

export const InputField: FC<InputFieldProps> = ({ label, name, register, error, readOnly = false, suffix, labelPosition = 'top', type = 'text' }) => {
  return (
    <div className={`mb-4 ${labelPosition === 'left' ? 'flex items-center' : ''}`}>
      <label className={`block text-gray-700 text-sm font-bold ${labelPosition === 'left' ? 'mr-2 w-1/4' : 'mb-2'}`}>
        {label}
      </label>
      <div className="relative flex-1">
        <input
          type={type}
          {...register(name)}
          readOnly={readOnly}
          className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
        />
        {suffix && (
          <span className="absolute right-2 top-2.5 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs italic">{error.message}</p>}
    </div>
  );
};
