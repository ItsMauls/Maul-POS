import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SetupKassaState {
  tipePOS: string;
  statusKassa: string;
  statusAntrian: string;
  setTipePOS: (tipe: string) => void;
  setStatusKassa: (status: string) => void;
  setStatusAntrian: (status: string) => void;
  resetSetupKassa: () => void;
}

export const useSetupKassaStore = create<SetupKassaState>()(
  persist(
    (set) => ({
      tipePOS: '01 - Swalayan',
      statusKassa: 'Aktif',
      statusAntrian: 'Aktif',
      
      setTipePOS: (tipe) => set({ tipePOS: tipe }),
      setStatusKassa: (status) => set({ statusKassa: status }),
      setStatusAntrian: (status) => set({ statusAntrian: status }),
      resetSetupKassa: () => set({
        tipePOS: '01 - Swalayan',
        statusKassa: 'Aktif',
        statusAntrian: 'Aktif',
      }),
    }),
    {
      name: 'setup-kassa-storage', // nama untuk localStorage key
    }
  )
); 