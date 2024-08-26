import { InputField } from '@/components/Input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormValues } from './type';
import { useTransactionStore } from '@/store/transactionStore';

export const DokterCardContent: React.FC = () => {
  const { register, watch } = useForm<FormValues>();
  const setDokter = useTransactionStore((state) => state.setDokter);

  React.useEffect(() => {
    const subscription = watch((value) => setDokter(value));
    return () => subscription.unsubscribe();
  }, [watch, setDokter]);

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
          name="no_telp"
          register={register}
          labelPosition='left'
        />
      </form>
    </>
  );
};