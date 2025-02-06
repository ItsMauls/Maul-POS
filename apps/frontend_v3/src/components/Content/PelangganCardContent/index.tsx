import { InputField } from '@/components/Input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormValues } from './type';
import { useTransactionStore } from '@/store/transactionStore';
import { useGet, usePost } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import Button from '@/components/ui/Button';

export const PelangganCardContent: React.FC = () => {
  const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const setPelanggan = useTransactionStore((state) => state.setPelanggan);
  const [isEditing, setIsEditing] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');

  // API mutations
  const { mutate: createPelanggan } = usePost(`${API_URL.USER.pelanggan}`);

  // Handle phone number search
  const handlePhoneSearch = async (phoneNumber: string) => {
    if (!phoneNumber) return;

    try {
      const response = await fetch(`${API_URL.USER.pelanggan}/phone/${phoneNumber}`);
      const data = await response.json();

      if (response.ok) {
        // Pelanggan found, populate form
        const pelanggan = data;
        Object.keys(pelanggan).forEach((key) => {
          setValue(key as keyof FormValues, pelanggan[key]);
        });
        setPelanggan(pelanggan);
        setIsEditing(false);
      } else {
        // Pelanggan not found, enable editing mode
        reset();
        setValue('noTelp', phoneNumber);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error searching pelanggan:', error);
    }
  };

  // Handle form submission for new pelanggan
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await createPelanggan({
        nama: data.nama,
        alamat: data.alamat,
        no_telp: data.noTelp,
        usia: data.usia ? parseInt(data.usia.toString()) : null,
        instansi: data.instansi,
        korp: data.korp
      });

      if (response) {
        setPelanggan(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error creating pelanggan:', error);
    }
  };

  // Watch form changes
  React.useEffect(() => {
    const subscription = watch((value) => setPelanggan(value));
    return () => subscription.unsubscribe();
  }, [watch, setPelanggan]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 mb-4">
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
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePhoneSearch(searchPhone);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => handlePhoneSearch(searchPhone)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Cari
          </Button>
        </div>

        <InputField
          label="Nama"
          name="nama"
          rules={{ required: "Nama wajib diisi" }}
          register={register}
          labelPosition='left'
          error={errors.nama?.message}
          disabled={!isEditing}
        />
        <InputField
          label="Alamat"
          name="alamat"
          rules={{ required: "Alamat wajib diisi" }}
          register={register}
          labelPosition='left'
          error={errors.alamat?.message}
          disabled={!isEditing}
        />
        <InputField
          type='number'
          label="Usia"
          name="usia"
          register={register}
          labelPosition='left'
          disabled={!isEditing}
        />
        <InputField
          label="Instansi"
          name="instansi"
          register={register}
          labelPosition='left'
          disabled={!isEditing}
        />
        <InputField
          label="Korp"
          name="korp"
          register={register}
          labelPosition='left'
          disabled={!isEditing}
        />

        {isEditing && (
          <div className="mt-4">
            <Button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Simpan Pelanggan Baru
            </Button>
          </div>
        )}
      </form>
    </>
  );
};