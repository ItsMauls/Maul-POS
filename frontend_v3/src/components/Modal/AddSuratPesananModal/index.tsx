import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Button from '../../ui/Button';
import { InputField } from '@/components/Input';
import { SelectField } from '@/components/SelectField';

interface AddSuratPesananModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface Item {
  id: number;
  kode: string;
  namaBarang: string;
  qty: number;
  isi: number;
  hargaBeli: number;
  subTotal: number;
}

const formatNumber = (value: string) => {
  // Remove non-digit characters and leading zeros
  const number = value.replace(/\D/g, '').replace(/^0+/, '');
  // Add commas for thousands
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const AddSuratPesananModal: React.FC<AddSuratPesananModalProps> = ({ isVisible, onClose, onSave }) => {
  const { register, handleSubmit, control, reset } = useForm();
  const [items, setItems] = useState<Item[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  const handleAddItem = () => {
    const newItem: Item = {
      id: items.length + 1,
      kode: '',
      namaBarang: '',
      qty: 0,
      isi: 0,
      hargaBeli: 0,
      subTotal: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof Item, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let updatedValue = value;
        if (field === 'hargaBeli') {
          // Remove commas and convert to number
          updatedValue = Number(value.toString().replace(/,/g, ''));
        }
        const updatedItem = { ...item, [field]: updatedValue };
        updatedItem.subTotal = updatedItem.qty * updatedItem.isi * updatedItem.hargaBeli;
        return updatedItem;
      }
      return item;
    }));
  };

  const onSubmit = (data: any) => {
    onSave({ ...data, items });
    reset();
    setItems([]);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white w-full rounded-lg p-8 max-w-6xl">
        <h2 className="text-2xl font-bold mb-6">Tambah Surat Pesanan</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <InputField
              label="Nama"
              name="nama"
              register={register}
              required
              className="w-full border rounded px-2 py-1"
            />
            <InputField
              label="Kode PR"
              name="kodePR"
              register={register}
              required
              className="w-full border rounded px-2 py-1"
            />
            <InputField
              label="Tanggal"
              name="tanggal"
              register={register}
              type="date"
              className="w-full border rounded px-2 py-1"
            />
            <InputField
              label="Tanggal Jatuh Tempo"
              name="tanggalJatuhTempo"
              register={register}
              type="date"
              className="w-full border rounded px-2 py-1"
            />
            <Controller
              name="namaSupplier"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <SelectField
                  register={register}
                  label="Nama Supplier"
                  options={[
                    { value: 'PT. ANUGRAH BUNDA SEHAT INDONESIA', label: 'PT. ANUGRAH BUNDA SEHAT INDONESIA' }
                  ]}
                  placeholder="Select a supplier"
                  error={error}
                  {...field}
                />
              )}
            />
            <InputField
              label="Keterangan"
              name="keterangan"
              register={register}
              as="textarea"
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Nama Barang</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Isi</th>
                <th className="px-4 py-2">Harga Beli</th>
                <th className="px-4 py-2">Sub Total</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <InputField
                      name={`kode-${item.id}`}
                      register={register}
                      value={item.kode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'kode', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <InputField
                      name={`namaBarang-${item.id}`}
                      register={register}
                      value={item.namaBarang}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'namaBarang', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <InputField
                      name={`qty-${item.id}`}
                      register={register}
                      value={item.qty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                      type="number"
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <InputField
                      name={`isi-${item.id}`}
                      register={register}
                      value={item.isi}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'isi', Number(e.target.value))}
                      type="number"
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <InputField
                      name={`hargaBeli-${item.id}`}
                      register={register}
                      value={formatNumber(item.hargaBeli.toString())}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const formattedValue = formatNumber(e.target.value);
                        e.target.value = formattedValue;
                        handleItemChange(item.id, 'hargaBeli', formattedValue);
                      }}
                      type="text"
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">{item.subTotal.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <Button onClick={() => handleRemoveItem(item.id)} className="bg-red-500 text-white">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button onClick={handleAddItem} className="bg-blue-500 text-white mb-4">
            + Add Item
          </Button>

          <div className="text-right mb-4">
            <strong>TOTAL: {items.reduce((acc, item) => acc + item.subTotal, 0).toFixed(2)}</strong>
          </div>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setItems([])} className="bg-red-500 text-white">
              Hapus Semua
            </Button>
            <Button className="bg-green-500 text-white">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSuratPesananModal;