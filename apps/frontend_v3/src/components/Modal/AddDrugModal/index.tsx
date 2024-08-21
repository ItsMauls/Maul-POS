import React from 'react';
import Button from '@/components/ui/Button';
import { InputField } from '@/components/Input';
import { FieldError, useForm } from 'react-hook-form';
import { SelectField } from '@/components/SelectField';

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (drugData: any) => void;
  lastUsedId: number | null;
}

export const AddDrugModal: React.FC<AddDrugModalProps> = ({ isOpen, onClose, onSave, lastUsedId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [nextId, setNextId] = React.useState<number | null>(null);

  const onSubmit = (data: any) => {
    // Remove kd_brgdg from the data before sending
    const { kd_brgdg, ...dataToSend } = data;
    onSave(dataToSend);
    onClose();
  };

  React.useEffect(() => {
    if (lastUsedId !== null) {
      const newId = lastUsedId + 1;
      setNextId(newId);
    }
  }, [lastUsedId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Tambah Info Obat</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Kd Barang*"
              name="kd_brgdg"       
              className="bg-gray-50"
              value={nextId !== null ? nextId.toString() : ''}
              readOnly
              type="number"
              register={() => {}} // Passing an empty function as register
            />
            <InputField
              label="Nama Barang*"
              name="nm_brgdg"
              register={register}
              error={errors.nm_brgdg as FieldError}
            />
            <InputField
              label="Harga BBS*"
              name="hj_bbs"
              step="0.01"
              register={register}
              error={errors.hj_bbs as FieldError}
              type="number"
            />
            <InputField
              label="Strip*"
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
            <SelectField
              label="Pabrik"
              name="id_pabrik"
              register={register}
              error={errors.id_pabrik as FieldError}
              options={[
                { value: '1', label: 'Pabrik 1' },
                { value: '2', label: 'Pabrik 2' },
              ]}
              placeholder="Pilih Pabrik"
            />
            <SelectField
              label="Kategori*"
              name="id_kategori"
              register={register}
              error={errors.id_kategori as FieldError}
              options={[
                { value: '1', label: 'Kategori 1' },
                { value: '2', label: 'Kategori 2' },
              ]}
              placeholder="Pilih Kategori"
            />
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
            label="Komposisi"
            name="komposisi"
            register={register}
            error={errors.komposisi as FieldError}
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