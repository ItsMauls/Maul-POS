import { InputField } from '@/components/Input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormValues } from './type';
import { useTransactionStore } from '@/store/transactionStore';

export const PelangganCardContent: React.FC = () => {
  const { register, watch, formState: { errors } } = useForm<FormValues>();
  const setPelanggan = useTransactionStore((state) => state.setPelanggan);

  React.useEffect(() => {
    const subscription = watch((value) => setPelanggan(value));
    return () => subscription.unsubscribe();
  }, [watch, setPelanggan]);

  return (
    <>
      <form>
        <InputField
          label="Nama"
          name="nama"
          rules={{ required: "Nama wajib diisi" }}
          register={register}
          labelPosition='left'
          error={errors.nama?.message}
        />
        <InputField
          label="Alamat"
          name="alamat"
          rules={{ required: "Alamat wajib diisi" }}
          register={register}
          labelPosition='left'
          error={errors.alamat?.message}
        />
        <InputField
          label="No Telp"
          name="noTelp"
          register={register}          
          rules={{ 
            required: "Nomor telepon wajib diisi",
            pattern: {
              value: /^[0-9]+$/,
              message: "Nomor telepon hanya boleh berisi angka"
            }
          }}
          error={errors.noTelp?.message}
          labelPosition='left'
        />
        <InputField
          type='number'
          label="Usia"
          name="usia"
          register={register}
          labelPosition='left'
        />
        <InputField
          label="Instansi"
          name="instansi"
          register={register}
          labelPosition='left'
        />
        <InputField
          label="Korp"
          name="korp"
          register={register}
          labelPosition='left'
        />
        {/* <InputField
          label="ID"
          name="id"
          register={register}
          labelPosition='left'
        /> */}
      </form>
    </>
  );
};