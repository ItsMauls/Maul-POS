import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../../ui/Button';
import { InputField } from '@/components/Input';
import { SelectField } from '@/components/SelectField';

interface CustomFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  fields: FieldConfig[];
  itemColumns: ItemColumnConfig[];
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface ItemColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'number';
  formatter?: (value: any) => string;
}

interface Item {
  id: number;
  [key: string]: any;
}

// ... formatNumber function remains the same ...

const CustomFormModal: React.FC<CustomFormModalProps> = ({ 
  isVisible, onClose, onSave, title, fields, itemColumns 
}) => {
  const { register, handleSubmit, control, reset } = useForm();
  const [items, setItems] = useState<Item[]>([{ id: 1 }]);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose();          
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // ... useEffect hooks remain the same ...

  const handleAddItem = () => {
    const newItem: Item = {
      id: items.length + 1,
      ...Object.fromEntries(itemColumns.map(col => [col.key, '']))
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const onSubmit = (data: any) => {
    onSave({ ...data, items });
    reset();
    setItems([{ id: 1 }]);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white w-full rounded-lg p-6 max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {fields.map((field) => (
              field.type === 'select' ? (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: fieldProps, fieldState: { error } }) => (
                    <SelectField
                      register={register}
                      label={field.label}
                      options={field.options || []}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                      error={error}
                      {...fieldProps}
                    />
                  )}
                />
              ) : (
                <InputField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  register={register}
                  required={field.required}
                  type={field.type}
                  as={field.type === 'textarea' ? 'textarea' : 'input'}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              )
            ))}
          </div>

          <table className="w-full mb-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-sm font-semibold">No.</th>
                {itemColumns.map((col) => (
                  <th key={col.key} className="border border-gray-300 px-2 py-1 text-sm font-semibold">{col.label}</th>
                ))}
                <th className="border border-gray-300 px-2 py-1 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-2 py-1 text-sm text-center">{index + 1}</td>
                  {itemColumns.map((col) => (
                    <td key={col.key} className="border border-gray-300 px-2 py-1">
                      <input
                        name={`${col.key}-${item.id}`}
                        value={col.formatter ? col.formatter(item[col.key]) : item[col.key]}
                        onChange={(e) => {
                          const value = col.type === 'number' ? Number(e.target.value) : e.target.value;
                          handleItemChange(item.id, col.key, value);
                        }}
                        type={col.type}
                        className="w-full border-none text-sm focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={handleAddItem}
              className="bg-blue-500 text-white text-sm px-2 py-1 rounded"
            >
              + Add Item
            </Button>
            <div className="text-sm">
              <span className="font-semibold">TOTAL:</span> {/* Calculate and display total here */}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => setItems([{ id: 1 }])}
              className="bg-red-500 text-white text-sm px-4 py-2 rounded"
            >
              Hapus Semua
            </Button>
            <Button
              // type="submit"
              className="bg-green-500 text-white text-sm px-4 py-2 rounded"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomFormModal;