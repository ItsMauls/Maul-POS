import { create } from 'zustand';
import { InfoObatState } from './types';

export const useInfoObatStore = create<InfoObatState>((set) => ({
  infoObats: [],
  isLoading: false,
  error: null,
}));