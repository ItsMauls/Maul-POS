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
  setItems: any;
  setTotals: (totals: {
    total_harga: string | number;
    total_disc: string | number;
    total_sc_misc: string | number;
    total_promo: string | number;
    total_up: string | number;
  }) => void;
  posType: 'Swalayan' | 'Resep';
  setPosType: (type: 'Swalayan' | 'Resep') => void;
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
        rOption: "",
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
        activePromo: null,
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
      posType: 'Swalayan',
      addItem: (index) => {
        const { data } = get();
        const newItem: DataRow = {
          index: data.length,
          rOption: "",
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
      calculateValues: (item: DataRow) => {
        const qty = item.qty || 1;
        const hj_ecer = item.hj_ecer || 0;
        const sc = item.sc || 0;
        const misc = item.misc || 0;
        
        // Hitung subJumlah (hanya harga * qty, tanpa SC)
        const subJumlah = hj_ecer * qty;
        
        // Hitung diskon jika ada activePromo
        let discPromo = 0;
        let promoValue = 0;
        
        if (item.activePromo) {
          if (item.activePromo.jenis_promo === 'PERSENTASE_DISKON') {
            discPromo = (subJumlah * (item.activePromo.diskon / 100));
            promoValue = discPromo;
          }
          // ... handle other promo types if needed ...
        }

        // Hitung jumlah total (termasuk SC, misc, dan diskon)
        const jumlah = subJumlah + sc + misc - promoValue;

        return {
          ...item,
          qty,
          subJumlah,
          discPromo,
          promoValue,
          jumlah: Math.ceil(jumlah / 100) * 100, // Round up to nearest 100
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
          rOption: "",
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
          activePromo: null,
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
      setItems: (items: any) => set(() => ({
        data: items.map((item, index) => ({
          ...item,
          index,
          rOption: item.rOption || "",
          qty: item.qty || 1,
          disc: item.disc || 0,
          sc: item.sc || 0,
          misc: item.misc || 0,
          promo: item.promo || 0,
          discPromo: item.discPromo || 0,
          promoValue: item.promoValue || 0,
          up: item.up || 0,
          noVoucher: item.noVoucher || "-",
          activePromo: item.activePromo || null,
        }))
      })),
      setTotals: (totals) => set((state) => ({
        totals: {
          ...state.totals,
          total_harga: Number(totals.total_harga) || 0,
          total_disc: Number(totals.total_disc) || 0,
          total_sc_misc: Number(totals.total_sc_misc) || 0,
          total_promo: Number(totals.total_promo) || 0,
          total_up: Number(totals.total_up) || 0,
        }
      })),
      setPosType: (type: 'Swalayan' | 'Resep') => set({ posType: type }),
    }),
    {
      name: 'transaction-storage',
      storage: typeof window !== 'undefined' ? customStorage as unknown as PersistStorage<TransactionState> : undefined,
    }
  )
);