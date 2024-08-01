"use client";
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Image from 'next/image';
import  { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Cookies from "js-cookie";
import { api } from '@/constants/api';
import { User } from '@/constants/types';



export default function Page() {
  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  };

  const fetchUser = async () => {
    const token = Cookies.get("access_token");
    const response = await fetch(api.auth.currentUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.data);
    } else {
      console.error('Failed to fetch user');
    }
  }

  
  useEffect(() => {
    fetchUser();
  }, []);

  const saveSignature = () => {
    const signatureImage = signatureCanvasRef.current?.toDataURL();
    setSignatureImage(signatureImage || '');
    setIsOpen(false);
    
    // save image to api
    const token = Cookies.get("access_token");
    fetch(`${api.user.signature}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature_base64: signatureImage }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Signature saved');
        } else {
          console.error('Failed to save signature');
        }
      })
      .catch((error) => {
        console.error('Failed to save signature', error);
      });

  };

  const fetchImage = async () => {
    const token = Cookies.get("access_token");
    console.log(user);
    
    const response = await fetch(api.user.signature + '?file_name='+user?.signature, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob)
      setSignatureImage(imageUrl)
    } else {
      console.error('Failed to fetch signature');
    }
  }

  useEffect(() => {
    if (user) {
      fetchImage()
    }
  }, [user]);

  const label = signatureImage ? 'Ubah Tanda Tangan' : 'Tambah Tanda Tangan';

  return (
    <div>
      <h1 className='text-2xl font-bold'>Tanda Tangan Digital</h1>
      <div className='p-4'>
        {signatureImage &&
          <Image
            alt="Signature Image"
            src={signatureImage}
            quality={100}
            width={500}
            height={200}
            className='border mb-2 bg-[#FFFFFF]'
          />
        }
      </div>

      <div className='p-4'>
        <Button label={label} onClick={() => setIsOpen(true)} className='bg-blue-500' />
      </div>

      <Modal title='Signature Pad' isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        clearSignature();
      }}>
        <div className='rounded-xl p-4 m-6'>
          <SignatureCanvas
            ref={signatureCanvasRef}
            penColor='black'
            canvasProps={{ width: 500, height: 200, className: 'signature-canvas border mb-2 bg-[#FFFFFF]' }}
          />
          <div className='flex justify-between'>
            <Button label='Bersihkan' onClick={clearSignature} className='bg-yellow-500' />
            <Button label='Simpan Tanda Tangan' onClick={saveSignature} className='bg-blue-500' />
          </div>
        </div>
      </Modal>
    </div>
  );
} 