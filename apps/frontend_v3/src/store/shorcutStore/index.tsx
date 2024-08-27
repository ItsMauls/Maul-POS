import { create } from 'zustand';
import { SHORTCUTS, SHORTCUT_ACTIONS } from '@/constants/shorcuts';

interface ShortcutState {
  shortcuts: typeof SHORTCUTS;
  actions: typeof SHORTCUT_ACTIONS;
  handleShortcut: (key: string) => void;
  setShortcutHandler: (action: string, handler: () => void) => void;
}

const useShortcutStore = create<ShortcutState>((set, get) => ({
  shortcuts: SHORTCUTS,
  actions: SHORTCUT_ACTIONS,
  handleShortcut: (key: string) => {
    const { actions } = get();
    const action = Object.entries(SHORTCUTS).find(([_, value]) => value === key)?.[0];
    if (action && actions[action as keyof typeof SHORTCUT_ACTIONS]) {
      actions[action as keyof typeof SHORTCUT_ACTIONS]();
    }
  },
  setShortcutHandler: (action: string, handler: () => void) => {
    set((state) => ({
      actions: {
        ...state.actions,
        [action]: handler,
      },
    }));
  },
}));

export default useShortcutStore;