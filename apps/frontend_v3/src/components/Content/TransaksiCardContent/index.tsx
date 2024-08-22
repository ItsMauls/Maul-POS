// MainComponent.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormValues } from './type';
import { InputField } from '@/components/Input';



export const TransaksiCardContent: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
  };

  return (
    <div className=''>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Sub total"
          name="subtotal"
          register={register}
          error={errors.subtotal}
          labelPosition='left'
          readOnly
        />
        <InputField
          label="Misc"
          name="misc"
          register={register}
          error={errors.misc}
          labelPosition='left'
        />
        <InputField
          label="RU"
          name="ru"
          register={register}
          error={errors.ru}
          labelPosition='left'
        />
        <InputField
          label="SC"
          name="sc"
          register={register}
          error={errors.sc}
          labelPosition='left'
        />
        <InputField
          label="Retur"
          name="retur"
          register={register}
          error={errors.retur}
          labelPosition='left'
        />
        <InputField
          label="Promo"
          name="promo"
          register={register}
          error={errors.promo}
          labelPosition='left'
        />
        <InputField
          label="Diskon"
          name="discount"
          register={register}
          error={errors.discount}
          labelPosition='left'
          suffix="%"
        />
        <div className="flex mt-4">
          <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded mr-2">
            Bayar
          </button>
          <button type="button" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded">
            Tunda
          </button>
        </div>
      </form>
    </div>
  );
};

