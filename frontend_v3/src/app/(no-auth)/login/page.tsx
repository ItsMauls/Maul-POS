'use client'

import PhoneInput from '@/components/PhoneInput';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdOutlinePhone } from 'react-icons/md';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="flex items-center justify-center bg-gray-100">
      <div className="h-screen w-full bg-white shadow-lg rounded-lg grid grid-cols-2 overflow-hidden">
        <div className="bg-blue-500 text-center text-white p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Kemudahan transaksi serta</h1>
          <h1 className="text-3xl font-bold mb-4">monitoring penjualan</h1>
          <h2 className="font-light text-lg">Masuk sekarang untuk pengalaman POS yang lebih baik</h2>
        </div>
        <div className="p-12 flex flex-col justify-center mx-auto">
          <h1 className="text-3xl text-blue-600 font-bold uppercase mb-2">pedagang besar farmasi</h1>
          <h2 className="text-2xl font-semibold mb-6">Log in ke Akun Kamu</h2>
          <p className="text-gray-700 mb-6">Masukan No.Telp & Password untuk Login ke Halaman Dashboard</p>
          <form>
            <PhoneInput label={'No Telp'}/>
            <Input 
              label="Password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              iconRight={{ icon: showPassword ? <FaEyeSlash /> : <FaEye />, onClick: () => setShowPassword(!showPassword) }}
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button
              className='bg-blue-600 w-full text-white flex justify-center rounded-xl py-3'
            >
              Login
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-600">Menemukan Masalah? <a href="/help" className="text-blue-500">Hubungi</a></p>
        </div>
      </div>
    </main>
  );
};

export default Login;
