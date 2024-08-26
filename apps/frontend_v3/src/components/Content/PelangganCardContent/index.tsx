import { InputField } from '@/components/Input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormValues } from './type';
import { useTransactionStore } from '@/store/transactionStore';

export const PelangganCardContent: React.FC = () => {
  const { register, watch } = useForm<FormValues>();
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
          register={register}
          labelPosition='left'
        />
        <InputField
          label="Alamat"
          name="alamat"
          register={register}
          labelPosition='left'
        />
        <InputField
          label="No Telp"
          name="noTelp"
          register={register}
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
        <InputField
          label="ID"
          name="id"
          register={register}
          labelPosition='left'
        />
      </form>
    </>
  );
};