import { FilterGudangProps } from "@/types";
import { Icon } from "@iconify/react";
import React from "react";

const FilterGudang: React.FC<FilterGudangProps> = ({
  options,
  selected,
  onChange,
}) => {
  return (
    <div className="relative inline-block w-full">
      <Icon icon="ic:baseline-other-houses" className="absolute left-2 top-[13px] text-[#1166D8] text-lg" />
      <select
        className="block w-full appearance-none bg-white border border-gray-200 rounded-lg pl-7 pr-4 py-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        value={selected}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>      
    </div>
  );
};

export default FilterGudang;
