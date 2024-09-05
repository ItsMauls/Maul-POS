import { formatRupiah } from '@/utils/currency';
import React from 'react';

interface MiscOption {
  value: string;
  label: string;
  price: number;
}

interface MiscModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: MiscOption) => void;
  options: MiscOption[];
}

export const MiscModal: React.FC<MiscModalProps> = ({ isOpen, onClose, onSelect, options }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Select Misc Option</h2>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
              onClick={() => onSelect(option)}
            >
              {option.label} - {formatRupiah(option.price)}
            </button>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};