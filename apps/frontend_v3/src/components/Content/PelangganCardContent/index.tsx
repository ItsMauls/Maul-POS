import { InputField } from '@/components/Input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormValues } from './type';
import { useTransactionStore } from '@/store/transactionStore';
import { useGet, usePost } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export const PelangganCardContent: React.FC = () => {
  const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const setPelanggan = useTransactionStore((state) => state.setPelanggan);
  const [isEditing, setIsEditing] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const { mutate: createPelanggan } = usePost(`${API_URL.USER.pelanggan}`);

  // Handle form submission for new pelanggan
  const onSubmit = async (data: FormValues) => {
    try {
      // Validate all required fields
      if (!data.nama || !data.alamat || !data.noTelp) {
        const missingFields = [];
        if (!data.nama) missingFields.push('Nama');
        if (!data.alamat) missingFields.push('Alamat');
        if (!data.noTelp) missingFields.push('No Telp');
        
        toast.error(`${missingFields.join(', ')} wajib diisi`);
        return;
      }

      createPelanggan(
        {
          nama: data.nama,
          alamat: data.alamat,
          no_telp: data.noTelp,
          usia: data.usia ? parseInt(data.usia.toString()) : null,
          instansi: data.instansi,
          korp: data.korp
        },
        {
          onSuccess: (response: any) => {
            setPelanggan(response.data);
            setIsEditing(false);
            toast.success('Data pelanggan berhasil disimpan');
          },
          onError: (error: any) => {
            console.error('Error creating pelanggan:', error);
            toast.error('Gagal menyimpan data pelanggan');
          }
        }
      );
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    }
  };

  // Handle individual field submission on enter
  const handleFieldKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, field: keyof FormValues) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const formData = watch();

      // Validate current field
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} wajib diisi`);
        return;
      }
      
      // Validate all required fields before submission
      if (!formData.nama || !formData.alamat || !formData.noTelp) {
        const missingFields = [];
        if (!formData.nama) missingFields.push('Nama');
        if (!formData.alamat) missingFields.push('Alamat');
        if (!formData.noTelp) missingFields.push('No Telp');
        
        toast.error(`${missingFields.join(', ')} wajib diisi`);
        return;
      }

      await onSubmit(formData);
    }
  };

  // Handle phone number search
  const handlePhoneSearch = async (phoneNumber: string) => {
    if (!phoneNumber) {
      toast.error('Nomor telepon wajib diisi');
      return;
    }

    try {
      const response = await fetch(`${API_URL.USER.pelanggan}/phone/${phoneNumber}`);
      const data = await response.json();

      if (response.ok) {
        // Pelanggan found, populate form and disable editing
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
      toast.error('Gagal mencari data pelanggan');
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
                if (!searchPhone) {
                  toast.error('Nomor telepon wajib diisi');
                  return;
                }
                handlePhoneSearch(searchPhone);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              if (!searchPhone) {
                toast.error('Nomor telepon wajib diisi');
                return;
              }
              handlePhoneSearch(searchPhone);
            }}
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
          onKeyDown={(e) => handleFieldKeyDown(e, 'nama')}
        />
        <InputField
          label="Alamat"
          name="alamat"
          rules={{ required: "Alamat wajib diisi" }}
          register={register}
          labelPosition='left'
          error={errors.alamat?.message}
          disabled={!isEditing}
          onKeyDown={(e) => handleFieldKeyDown(e, 'alamat')}
        />
        <InputField
          type='number'
          label="Usia"
          name="usia"
          register={register}
          labelPosition='left'
          disabled={!isEditing}
          onKeyDown={(e) => handleFieldKeyDown(e, 'usia')}
        />
        {/* <InputField
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
        /> */}

        {isEditing && (
          <div className="mt-4 flex justify-center">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white px-4 py-2 rounded"
            >
              Simpan Pelanggan Baru
            </Button>
          </div>
        )}
      </form>
    </>
  );
};