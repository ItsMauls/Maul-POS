// MainComponent.tsx
import { InputField } from '@/components/Input';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormValues } from './type';


export const PelangganCardContent: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Nama"
          name="nama"
          register={register}
          error={errors.nama}
          labelPosition='left'
        />
        <InputField
          label="Alamat"
          name="alamat"
          register={register}
          error={errors.alamat}
          labelPosition='left'
        />
        <InputField
          label="No Telp"
          name="noTelp"
          register={register}
          error={errors.noTelp}
          labelPosition='left'
        />
        <InputField
          label="Usia"
          name="usia"
          register={register}
          error={errors.usia}
          labelPosition='left'
        />
        <InputField
          label="Instansi"
          name="instansi"
          register={register}
          error={errors.instansi}
          labelPosition='left'
        />
        <InputField
          label="Korp"
          name="korp"
          register={register}
          error={errors.korp}
          labelPosition='left'
        />
        <InputField
          label="ID"
          name="id"
          register={register}
          error={errors.id}
          labelPosition='left'
        />
      </form>
    </>
  );
};
