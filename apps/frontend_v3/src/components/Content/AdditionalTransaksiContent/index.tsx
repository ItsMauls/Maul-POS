// MainComponent.tsx
import { InputField } from '@/components/Input';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';


export const AdditionalTransaksiContent: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<any>();

  const onSubmit: SubmitHandler<any> = data => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Sales / Pelayan"
          name="sales"
          register={register}
          error={errors.sales}
          labelPosition='left'
        />
        <InputField
          label="Jenis Penjualan"
          name="jenisPenjualan"
          register={register}
          error={errors.jenisPenjualan}
          labelPosition='left'
        />
        <InputField
          label="Invoice Eksternal"
          name="invoiceEksternal"
          register={register}
          error={errors.invoiceEksternal}
          labelPosition='left'
        />
        <InputField
          label="Catatan"
          name="catatan"
          register={register}
          error={errors.catatan}
          labelPosition='left'
        />

      </form>
    </>
  );
};
