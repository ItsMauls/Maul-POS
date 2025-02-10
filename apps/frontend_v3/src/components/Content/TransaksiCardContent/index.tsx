import React, { useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormValues } from './type';
import { InputField } from '@/components/Input';
import { DataRow } from '@/types';
import { formatRupiah, roundUp } from '@/utils/currency';
import { SHORTCUTS } from '@/constants/shorcuts';
import { useRouter } from 'next/navigation';
import { usePost } from '@/hooks/useApi';
import { API_URL } from '@/constants/api';
import toast from 'react-hot-toast';
import { useTransactionStore } from '@/store/transactionStore';

export const TransaksiCardContent: React.FC<{ data: DataRow[], onPaymentClick: () => void }> = ({ data, onPaymentClick }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>();
  const { pelanggan, dokter, antrian, totals, clearTransaction } = useTransactionStore();
  const { mutate: tundaTransaksi } = usePost(API_URL.SALES.tundaPenjualan);

  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
  };

  const subtotal = watch('subtotal');
  const roundUpAmount = watch('ru');

  // Calculate total misc charges
  const totalMisc = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.misc || 0), 0);
  }, [data]);

  useEffect(() => {
    const subtotal = data.reduce((sum, item) => sum + item.subJumlah, 0);
    const roundUpAmount = data.reduce((sum, item) => {
      const roundedItemTotal = Math.ceil(item.subJumlah / 100) * 100;
      return sum + (roundedItemTotal - item.subJumlah);
    }, 0);
    setValue('subtotal', subtotal);
    setValue('ru', roundUpAmount);
    setValue('misc', totalMisc);
  }, [data, setValue, totalMisc]);

  // Calculate the total additional charge for R and RC options
  const additionalCharge = useMemo(() => {
    return data.reduce((sum, item) => {
      if (item.rOption === 'R') {
        return sum + 6000;
      } else if (item.rOption === 'RC') {
        return sum + 12000;
      }
      return sum;
    }, 0);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SHORTCUTS.OPEN_PAYMENT_MODAL) {
        onPaymentClick();
      } else if (event.key === SHORTCUTS.OPEN_TUNDA_MODAL) {
        handleTundaTransaksi();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPaymentClick]);

  const handleTundaTransaksi = () => {
    const transactionData = {
      antrian,
      items: data,
      pelanggan,
      totals,
      dokter
    };

    tundaTransaksi(transactionData, {
      onSuccess: () => {
        toast.success('Transaksi berhasil ditunda');
        clearTransaction()
        // router.push('/transaksi-penjualan/tunda');
      },
      onError: (error) => {
        toast.error('Gagal menunda transaksi');
        console.error('Failed to suspend transaction:', error);
      }
    });
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
          value={subtotal ? formatRupiah(subtotal) : ''}
        />
        <InputField
          label="Misc"
          name="misc"
          register={register}
          error={errors.misc}
          labelPosition='left'
          readOnly
          value={formatRupiah(totalMisc)}
        />
        <InputField
          label="RU"
          name="ru"
          register={register}
          error={errors.ru}
          readOnly
          value={roundUpAmount ? formatRupiah(roundUpAmount) : ''}
          labelPosition='left'
        />
        <InputField
          label="SC"
          name="sc"
          register={register}
          error={errors.sc}
          labelPosition='left'
          readOnly
          value={formatRupiah(additionalCharge)}
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
          value={formatRupiah(data.reduce((sum, item) => sum + (item.discPromo || 0), 0))}
        />
        <InputField
          label="Diskon"
          name="discount"
          register={register}
          error={errors.discount}
          labelPosition='left'
          suffix="%"
          value={(data.reduce((sum, item) => sum + (item.activePromo?.diskon || 0), 0))}
        />
        <div className="flex mt-4">
          <button type="submit" className="flex-1 bg-emerald-600 text-white rounded mr-2" onClick={onPaymentClick}>
            Bayar <span className="ml-2 bg-blue-500 rounded-lg p-1">F2</span>
          </button>
          <button type="button" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded" onClick={handleTundaTransaksi}>
            Tunda <span className="ml-2 bg-blue-500 rounded-lg p-1">F4</span>
          </button>
        </div>
      </form>
    </div>
  );
};