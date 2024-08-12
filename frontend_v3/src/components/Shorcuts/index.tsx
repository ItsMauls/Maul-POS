import React from 'react';
import { FaPlus, FaEdit, FaCalendarAlt, FaRedo, FaCheck } from 'react-icons/fa';
import Button from '../ui/Button';

const shortcuts = [
  { name: 'Tambah', shortcut: 'Insert', icon: <FaPlus />, bgClass: 'bg-teal-600' },
  { name: 'Ganti Tujuan', shortcut: 'F1', icon: <FaEdit />, bgClass: 'bg-teal-600' },
  { name: 'Pilih Tanggal', shortcut: 'F3', icon: <FaCalendarAlt />, bgClass: 'bg-teal-600' },
  { name: 'Reset SP Gantung', shortcut: 'F10', icon: <FaRedo />, bgClass: 'bg-teal-600' },
  { name: 'Persetujuan', shortcut: '', icon: <FaCheck />, bgClass: 'bg-blue-600' },
];

export const Shortcuts = () => {
  return (
    <div className="flex space-x-2">
      {shortcuts.map((item, index) => (
        <Button
          key={index}
          onClick={() => alert(item.name)}
          hasIcon
          icon={item.icon}
          className={`${item.bgClass} p-2 rounded-xl text-white flex items-center`}
        >
          <span>{item.name}</span>
          {item.shortcut && (
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">
              {item.shortcut}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

