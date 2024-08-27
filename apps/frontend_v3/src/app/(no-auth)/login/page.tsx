'use client'

import { InputField } from '@/components/Input';
import Button from '@/components/ui/Button';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn, isLoading, error } = useSession()
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await signIn(data);
      router.push('/');
    } catch (error) {
      // Error is handled in useSession, no need to do anything here
    }
  };

  return (
    <main className="flex items-center justify-center bg-gray-100">
      <div className="h-screen w-full bg-white shadow-lg rounded-lg grid grid-cols-2 overflow-hidden">
        {/* Left side content */}
        <div className="bg-blue-500 text-center text-white p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Kemudahan transaksi serta</h1>
          <h1 className="text-3xl font-bold mb-4">monitoring penjualan</h1>
          <h2 className="font-light text-lg">Masuk sekarang untuk pengalaman POS yang lebih baik</h2>
        </div>
        {/* Right side content */}
        <div className="p-12 flex flex-col justify-center mx-auto">
          <h1 className="text-3xl text-blue-600 font-bold uppercase mb-2">pedagang besar farmasi</h1>
          <h2 className="text-2xl font-semibold mb-6">Log in ke Akun Kamu</h2>
          <p className="text-gray-700 mb-6">Masukan No.Telp & Password untuk Login ke Halaman Dashboard</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="No Telp"
              name="phoneNumber"
              register={register}
              error={errors.phoneNumber}
              type="tel"
            />
            <InputField
              label="Password"
              name="password"
              register={register}
              error={errors.password}
              type={showPassword ? 'text' : 'password'}
              suffix={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />
            <Button
              className='bg-blue-600 w-full text-white flex justify-center rounded-xl py-3'
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-600">Menemukan Masalah? <a href="/help" className="text-blue-500">Hubungi</a></p>
        </div>
      </div>
    </main>
  );
};

export default Login;