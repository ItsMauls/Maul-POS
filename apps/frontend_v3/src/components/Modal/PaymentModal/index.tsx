// apps/frontend_v3/src/components/Modal/PaymentModal.tsx
import React, { useState } from 'react';
import { SelectField } from '@/components/SelectField';
import { formatRupiah } from '@/utils/currency';
import { InputField } from '@/components/Input';
import { useForm } from 'react-hook-form';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    creditCard: false,
    debitCard: false,
  });

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({ ...prev, [method]: !prev[method] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tipe Pembayaran</h2>
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
            <span>Cash</span>
          </div>
          {paymentMethods.cash && (
            <InputField register={register} name="cash" label="Nominal" placeholder="Masukan Nominal" />
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paymentMethods.creditCard}
              onChange={() => togglePaymentMethod('creditCard')}
              className="mr-2"
            />
            <span>Credit Card</span>
          </div>
          {paymentMethods.creditCard && (
            <div className="space-y-2">
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
                name="bank" 
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
                name="tipeCreditCard" 
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
            <span>Debit Card</span>
          </div>
          {paymentMethods.debitCard && (
            <div className="space-y-2">
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
                name="bank" 
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
                name="tipeDebitCard" 
                label="Tipe Debit Card" 
                options={[{ value: 'visa', label: 'Visa' }]} 
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded">Simpan</button>
        </div>
      </div>
    </div>
  );
};