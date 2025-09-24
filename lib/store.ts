import { create } from 'zustand';
import { getItem, setItem } from './storage';

type UiState = {
  locale: 'th' | 'en';
  setLocale: (lng: 'th' | 'en') => void;
  initialized: boolean;
  initialize: () => Promise<void>;
};

export const useUiStore = create<UiState>((set, get) => ({
  locale: 'th',
  initialized: false,
  setLocale: (lng) => {
    set({ locale: lng });
    setItem('app.locale', lng).catch(() => {});
  },
  initialize: async () => {
    if (get().initialized) return;
    const saved = await getItem('app.locale');
    if (saved === 'th' || saved === 'en') {
      set({ locale: saved, initialized: true });
    } else {
      set({ initialized: true });
    }
  },
}));


