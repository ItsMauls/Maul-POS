import React, { useState } from 'react';
import { MdOutlinePhone } from 'react-icons/md';

const countryCodes = [
  { code: '+62', country: 'Indonesia' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  // Tambahkan kode negara lainnya sesuai kebutuhan
];

const PhoneInput = ({ label, value, onChange } : any) => {
  const [selectedCode, setSelectedCode] = useState(countryCodes[0].code);

  const handleCodeChange = (e: any) => {
    setSelectedCode(e.target.value);
  };

  return (
    <div className="mb-6">
      {label && <label className="block text-gray-700 mb-2">{label} <span className="text-red-500">*</span></label>}
      <div className="flex gap-x-4">
        <select
          value={selectedCode}
          onChange={handleCodeChange}
          className="inline-flex w-2/12 rounded-lg items-center px-3 bg-gray-100 text-gray-700 border border-r-0 border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
        >
          {countryCodes.map((code) => (
            <option key={code.code} value={code.code}>
              {code.code} ({code.country})
            </option>
          ))}
        </select>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(selectedCode + e.target.value)}
          className="flex-1 min-w-0 block w-full rounded-lg px-3 py-2 bg-gray-100 rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nomor Telepon"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
