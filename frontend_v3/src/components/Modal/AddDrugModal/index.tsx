import React from 'react';
import Button from '@/components/ui/Button';
import { InputField } from '@/components/Input';
import { FieldError, useForm } from 'react-hook-form';

const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000).toString();

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (drugData: any) => void;
  lastUsedId: number | null;
}

export const AddDrugModal: React.FC<AddDrugModalProps> = ({ isOpen, onClose, onSave, lastUsedId }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [nextId, setNextId] = React.useState<number | null>(null);

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  React.useEffect(() => {
    if (lastUsedId !== null) {
      const newId = lastUsedId + 1;
      setNextId(newId);
      setValue('kd_barang', newId.toString());
    }
  }, [lastUsedId, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Tambah Info Obat</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Kd Barang*"
              name="kd_barang"
              register={register}
              error={errors.kd_barang as FieldError}
              value={nextId !== null ? nextId.toString() : ''}
              disabled
            />
            <InputField
              label="Nama Barang*"
              name="nama_barang"
              register={register}
              error={errors.nama_barang as FieldError}
            />
            <InputField
              label="Harga*"
              name="harga"
              register={register}
              error={errors.harga as FieldError}
              type="number"
            />
            <InputField
              label="Strip"
              name="strip"
              register={register}
              error={errors.strip as FieldError}
              type="number"
            />
            <InputField
              label="Dosis"
              name="dosis"
              register={register}
              error={errors.dosis as FieldError}
            />
            <InputField
              label="Aturan Pakai"
              name="aturan_pakai"
              register={register}
              error={errors.aturan_pakai as FieldError}
            />
            <div>
              <label className="block mb-1">Pabrik</label>
              <select {...register("pabrik")} className="w-full p-2 border rounded">
                <option value="">Pilih Pabrik</option>
                {/* Add pabrik options here */}
              </select>
            </div>
            <div>
              <label className="block mb-1">Kategori</label>
              <select {...register("kategori")} className="w-full p-2 border rounded">
                <option value="">Pilih Kategori</option>
                {/* Add kategori options here */}
              </select>
            </div>
          </div>
          <InputField
            label="Indikasi"
            name="indikasi"
            register={register}
            error={errors.indikasi as FieldError}
          />
          <InputField
            label="Deskripsi"
            name="deskripsi"
            register={register}
            error={errors.deskripsi as FieldError}
          />
          <InputField
            label="Kompisi"
            name="kompisi"
            register={register}
            error={errors.kompisi as FieldError}
          />
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={onClose} className="bg-gray-300 text-black">Batal</Button>
            <Button className="bg-teal-600 text-white">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};