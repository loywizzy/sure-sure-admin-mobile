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


type AuthState = {
  isAuthenticated: boolean;
  role: 'admin' | 'merchant' | null;
  name: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  name: null,
  initialized: false,
  initialize: async () => {
    const raw = await getItem('app.auth');
    if (raw) {
      try {
        const data = JSON.parse(raw) as { isAuthenticated: boolean; role: 'admin' | 'merchant'; name: string | null };
        set({ isAuthenticated: !!data.isAuthenticated, role: data.role, name: data.name, initialized: true });
        return;
      } catch {}
    }
    set({ initialized: true });
  },
  login: async (email, password) => {
    // Mock auth: accept any non-empty email/password
    if (email.trim() && password.trim()) {
      const name = email.split('@')[0];
      const data = { isAuthenticated: true, role: 'admin' as const, name };
      await setItem('app.auth', JSON.stringify(data));
      set({ isAuthenticated: true, role: 'admin', name, initialized: true });
      return true;
    }
    return false;
  },
  logout: async () => {
    await setItem('app.auth', '');
    set({ isAuthenticated: false, role: null, name: null });
  },
}));

// Week selection store
type WeekState = {
  weekStartISO: string; // Monday 00:00:00.000 local
  setThisWeek: () => void;
  shiftWeeks: (delta: number) => void; // -1 previous, +1 next
  setWeekStart: (iso: string) => void;
};

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun ... 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // move to Monday
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export const useWeekStore = create<WeekState>((set, get) => ({
  weekStartISO: getMonday(new Date()).toISOString(),
  setThisWeek: () => set({ weekStartISO: getMonday(new Date()).toISOString() }),
  shiftWeeks: (delta) => {
    const start = new Date(get().weekStartISO);
    start.setDate(start.getDate() + delta * 7);
    set({ weekStartISO: start.toISOString() });
  },
  setWeekStart: (iso) => set({ weekStartISO: new Date(iso).toISOString() }),
}));


