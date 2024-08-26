// apps/frontend_v3/src/store/transactionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateStorage } from 'zustand/middleware';
import { DataRow } from '@/types';

interface TransactionState {
  data: DataRow[];
  pelanggan: any;
  dokter: any;
  addItem: (index: number) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: Partial<DataRow>) => void;
  calculateValues: (item: DataRow) => DataRow;
  setPelanggan: (data: any) => void;
  setDokter: (data: any) => void;
}

const customStorage: StateStorage = {
  getItem: (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
};

export const useTransactionStore = create(
  persist<TransactionState>(
    (set, get) => ({
      data: [{
        index: 0,
        rOption: "R",
        kd_brgdg: "BRG001",
        nm_brgdg: "New Item",
        hj_ecer: 0,
        qty: 1,
        subJumlah: 0,
        disc: 0,
        sc: 0,
        misc: 0,
        jumlah: 0,
        promo: 0,
        discPromo: 0,
        promoValue: 0,
        up: 0,
        noVoucher: "-",
      }],
      pelanggan: {},
      dokter: {},
      addItem: (index) => {
        const { data } = get();
        const newItem: DataRow = {
          index: data.length,
          rOption: "R",
          kd_brgdg: `BRG${(data.length + 1).toString().padStart(3, '0')}`,
          nm_brgdg: "New Item",
          hj_ecer: 0,
          qty: 1,
          subJumlah: 0,
          disc: 0,
          sc: 0,
          misc: 0,
          jumlah: 0,
          promo: 0,
          discPromo: 0,
          promoValue: 0,
          up: 0,
          noVoucher: "-",
        };
        set((state) => ({
          data: [...state.data.slice(0, index + 1), newItem, ...state.data.slice(index + 1)]
        }));
      },
      removeItem: (index) => {
        set((state) => ({
          data: state.data.filter((_, i) => i !== index)
        }));
      },
      updateItem: (index, item) => {
        
        set((state) => ({
          data: state.data.map((dataItem, i) => 
            i === index ? { ...dataItem, ...item } : dataItem
          )
        }));
      },
      calculateValues: (item) => {
        const subJumlah = item.qty * item.hj_ecer;
        const discAmount = subJumlah * (item.disc / 100);
        const scAmount = subJumlah * (item.sc / 100);
        const jumlah = subJumlah - discAmount + scAmount + item.misc;
        const promoAmount = jumlah * (item.promo / 100);
        const finalJumlah = jumlah - promoAmount;

        return {
          ...item,
          subJumlah,
          jumlah: finalJumlah,
          discPromo: promoAmount,
          promoValue: promoAmount,
        };
      },
      setPelanggan: (data) => set((state) => ({ pelanggan: { ...state.pelanggan, ...data } })),
      setDokter: (data) => set((state) => ({ dokter: { ...state.dokter, ...data } })),
    }),
    {
      name: 'transaction-storage',
      storage: typeof window !== 'undefined' ? customStorage : undefined,
    }
  )
);