// apps/frontend_v3/src/store/transactionStore.ts
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { StateStorage } from 'zustand/middleware';
import { DataRow } from '@/types';


interface TransactionState {
  data: DataRow[];
  pelanggan: any;
  dokter: any;
  antrian: {
    noAntrian: string;
    periode: string;
    noBon: string;
  };
  totals: {
    total_harga: number;
    total_disc: number;
    total_sc_misc: number;
    total_promo: number;
    total_up: number;
    no_voucher: string;
  };
  addItem: (index: number) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: Partial<DataRow>) => void;
  calculateValues: (item: DataRow) => DataRow;
  setPelanggan: (data: any) => void;
  setDokter: (data: any) => void;
  setAntrian: (data: any) => void;
  updateTotals: (totals: {
    total_harga: number;
    total_disc: number;
    total_sc_misc: number;
    total_promo: number;
    total_up: number;
  }) => void;
  clearTransaction: () => void;
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
        activePromo: null, // Initialize with null
      }],
      pelanggan: {},
      dokter: {},
      antrian: {
        noAntrian: '',
        periode: '',
        noBon: ''
      },
      totals: {
        total_harga: 0,
        total_disc: 0,
        total_sc_misc: 0,
        total_promo: 0,
        total_up: 0,
        no_voucher: '',
      },
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
          activePromo: null, // Explicitly set to null for new items
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
            i === index ? { 
              ...dataItem, 
              ...item, 
              activePromo: item.activePromo !== undefined ? item.activePromo : dataItem.activePromo 
            } : dataItem
          )
        }));
        console.log('Updated item:', get().data[index]); // Add this line for debugging
      },
      calculateValues: (item) => {
        const subJumlah = item.qty * item.hj_ecer;
        const discAmount = subJumlah * (item.disc / 100);
        let promoAmount = 0;

        if (item.activePromo) {
          switch (item.activePromo.jenis_promo) {
            case 'PERSENTASE_DISKON':
              promoAmount = subJumlah * (item.activePromo.diskon / 100);
              if (item.activePromo.max_diskon) {
                promoAmount = Math.min(promoAmount, item.activePromo.max_diskon);
              }
              break;
            case 'POTONGAN_HARGA':
              promoAmount = item.activePromo.diskon * item.qty;
              break;
            case 'BUY_ONE_GET_ONE':
              if (item.activePromo.kuantitas_beli && item.qty >= item.activePromo.kuantitas_beli) {
                const freeItems = Math.floor(item.qty / item.activePromo.kuantitas_beli) * (item.activePromo.kuantitas_gratis || 0);
                promoAmount = freeItems * item.hj_ecer;
              }
              break;
          }
        }

        const scAmount = subJumlah * (item.sc / 100);
        const jumlah = subJumlah - discAmount - promoAmount + scAmount + item.misc;

        return {
          ...item,
          subJumlah,
          jumlah,
          discPromo: promoAmount,
          promoValue: promoAmount,
          activePromo: item.activePromo, // Ensure activePromo is included in the returned object
        };
      },
      setPelanggan: (data) => set((state) => ({ pelanggan: { ...state.pelanggan, ...data } })),
      setDokter: (data) => set((state) => ({ dokter: { ...state.dokter, ...data } })),
      setAntrian: (data) => set((state) => ({ 
        antrian: { ...state.antrian, ...data } 
      })),
      updateTotals: (totals) => set((state) => ({
        totals: {
          ...state.totals,
          ...totals
        }
      })),
      clearTransaction: () => set(() => ({
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
          activePromo: null, // Set to null when clearing
        }],
        pelanggan: {},
        dokter: {},
        antrian: {
          noAntrian: '',
          periode: '',
          noBon: ''
        },
        totals: {
          total_harga: 0,
          total_disc: 0,
          total_sc_misc: 0,
          total_promo: 0,
          total_up: 0,
          no_voucher: '',
        }
      })),
    }),
    {
      name: 'transaction-storage',
      storage: typeof window !== 'undefined' ? customStorage as unknown as PersistStorage<TransactionState> : undefined,
    }
  )
);