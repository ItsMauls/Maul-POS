// apps/frontend_v3/src/components/Modal/PaymentModal.tsx
import React, { useEffect, useState } from 'react';
import { SelectField } from '@/components/SelectField';
import { formatRupiah } from '@/utils/currency';
import { InputField } from '@/components/Input';
import { useForm } from 'react-hook-form';
import { usePost } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: (paymentData?: any) => void
  totalAmount: number;
  transactionId: string;
  onPaymentComplete: (paymentData: any) => void;
  // createTransaction: () => any;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount, transactionId, onPaymentComplete }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    creditCard: false,
    debitCard: false,
  });   
  const [paymentError, setPaymentError] = useState<string | null>(null);
  // const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({ ...prev, [method]: !prev[method] }));
  };

  const { mutate: createPayment, isPending, isError, error } = usePost(API_URL.PAYMENT.createPayment);
  const { mutate: tambahAntrian } = usePost(API_URL.ANTRIAN.createAntrian);

  const onSubmit = async (data: any) => {
    setPaymentError(null); // Reset error on new submission
    const paymentType = Object.keys(paymentMethods).find(method => paymentMethods[method as keyof typeof paymentMethods]);
    const paymentData = {
      transactionId,
      amount: totalAmount,
      paymentType: paymentType?.toUpperCase(),
      ...(paymentType === 'cash' ? {
        cashPayment: {
          amount: parseFloat(data.cash.amount),
        }
      } : {
        cardPayment: {
          ...data[paymentType as keyof typeof data],
          amount: totalAmount,
        }
      }),
    };

    createPayment(paymentData, {
      onSuccess: async () => {
        try {
          tambahAntrian({ idPelanggan: 1, kdCab: 'CAB001' }, {
            onSuccess: (antrianData) => {
              console.log('Antrian created:', antrianData);
              onClose(paymentData);
              onPaymentComplete(paymentData);
              // setPaymentSuccess('Pembayaran berhasil');
            },
            onError: (error) => {
              setPaymentError('Gagal membuat antrian');
            }
          });
        } catch (error) {
          setPaymentError('Gagal membuat transaksi');
        }
      },
      onError: (error: any) => {
        console.error('Failed to process payment:', error);
        if (error.response?.status === 401) {
          setPaymentError('Jumlah pembayaran tidak boleh kurang dari total tagihan');
        } else {
          setPaymentError('Gagal memproses pembayaran');
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Tipe Pembayaran</h2>
        
        {paymentError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {paymentError}
          </div>
        )}

        {/* {paymentSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {paymentSuccess}
          </div>
        )} */}

        <div className="bg-blue-100 p-4 rounded-md mb-4">
          <p className="text-xl font-semibold">Total Bayar</p>
          <p className="text-2xl font-bold">{formatRupiah(totalAmount)}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paymentMethods.cash}
              onChange={() => togglePaymentMethod('cash')}
              className="mr-2"
            />
            <span className="mr-4">Cash</span>
            {paymentMethods.cash && (
              <InputField register={register} name="cash.amount" label="Nominal" placeholder="Masukan Nominal" />
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paymentMethods.creditCard}
              onChange={() => togglePaymentMethod('creditCard')}
              className="mr-2"
            />
            <span className="mr-4">Credit Card</span>
          </div>
          {paymentMethods.creditCard && (
            <div className="grid grid-cols-3 gap-4">
              <InputField 
                register={register} 
                name="creditCard" 
                label="Nominal" 
                placeholder="Masukan Nominal" 
              />
              <InputField 
                register={register} 
                name="creditCard" 
                label="Nomor Rekening" 
                placeholder="Masukan No.Rek" 
              />
              <SelectField 
                register={register} 
                name="creditCard" 
                label="Bank" 
                options={[{ value: 'mandiri', label: 'Bank Mandiri' }]} 
              />
              <InputField 
                register={register} 
                name="creditCard" 
                label="Mesin EDC" 
                placeholder="Mesin EDC" 
              />
              <SelectField 
                register={register} 
                name="creditCard" 
                label="Tipe Credit Card" 
                options={[{ value: 'visa', label: 'Visa' }]} 
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paymentMethods.debitCard}
              onChange={() => togglePaymentMethod('debitCard')}
              className="mr-2"
            />
            <span className="mr-4">Debit Card</span>
          </div>
          {paymentMethods.debitCard && (
            <div className="grid grid-cols-3 gap-4">
              <InputField 
                register={register} 
                name="debitCard" 
                label="Nominal" 
                placeholder="Masukan Nominal" 
              />
              <InputField 
                register={register} 
                name="debitCard" 
                label="Nomor Rekening" 
                placeholder="Masukan No.Rek" 
              />
              <SelectField 
                register={register} 
                name="debitCard" 
                label="Bank" 
                options={[{ value: 'mandiri', label: 'Bank Mandiri' }]} 
              />
              <InputField 
                register={register} 
                name="debitCard" 
                label="Mesin EDC" 
                placeholder="Mesin EDC" 
              />
              <SelectField 
                register={register} 
                name="debitCard" 
                label="Tipe Debit Card" 
                options={[{ value: 'visa', label: 'Visa' }]} 
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded" disabled={isPending}>
            {isPending ? 'Processing...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};
