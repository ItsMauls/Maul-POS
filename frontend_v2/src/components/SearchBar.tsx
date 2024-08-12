import { SearchBarProps } from '@/types';
import React from 'react';

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Cari disini"
      className="bg-[#FFFFFF] border border-gray-200 rounded-lg p-2"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchBar;