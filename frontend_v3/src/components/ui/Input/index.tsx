import React from 'react';
import { InputTypes } from './type';

const Input = ({ label, type = 'text', placeholder, iconLeft, iconRight, value, onChange }: InputTypes) => {
  return (
    <div className="mb-6">
      {label && <label className="block text-gray-700 mb-2">{label} <span className="text-red-500">*</span></label>}
      <div className="relative flex items-center">
        {iconLeft && <span className="absolute inset-y-0 left-0 flex items-center pl-3">{iconLeft}</span>}
        <input 
          type={type} 
          value={value}
          onChange={onChange}
          className={`block w-full px-3 py-2 ${iconLeft ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''} bg-gray-100 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500`} 
          placeholder={placeholder} 
        />
        {iconRight && <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={iconRight.onClick}>{iconRight.icon}</button>}
      </div>
    </div>
  );
};

export default Input;
