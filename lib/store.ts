import { create } from 'zustand';
import { getItem, setItem } from './storage';
import { authService } from './services/authService';

type UiState = {
  locale: 'th' | 'en';
  setLocale: (lng: 'th' | 'en') => void;
  initialized: boolean;
  initialize: () => Promise<void>;
  theme: 'light' | 'dark';
  setTheme: (mode: 'light' | 'dark') => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  locale: 'th',
  initialized: false,
  theme: 'light',
  setLocale: (lng) => {
    set({ locale: lng });
    setItem('app.locale', lng).catch(() => {});
  },
  setTheme: (mode) => {
    set({ theme: mode });
    setItem('app.theme', mode).catch(() => {});
  },
  initialize: async () => {
    if (get().initialized) return;
    const saved = await getItem('app.locale');
    const savedTheme = await getItem('app.theme');
    if (saved === 'th' || saved === 'en') {
      set({ locale: saved });
    } else {
      // leave default
    }
    if (savedTheme === 'light' || savedTheme === 'dark') {
      set({ theme: savedTheme as 'light' | 'dark' });
    }
    set({ initialized: true });
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
        const data = JSON.parse(raw) as { isAuthenticated?: boolean; role?: 'admin' | 'merchant' | null; name?: string | null; token?: string | null };
        set({ isAuthenticated: !!data.isAuthenticated || !!data.token, role: (data.role ?? null) as any, name: data.name ?? null, initialized: true });
        return;
      } catch {}
    }
    set({ initialized: true });
  },
  login: async (email, password) => {
    const username = email;
    const passwordStr = password;
    if (!username.trim() || !passwordStr.trim()) return false;
    try {
      const { token, role, name } = await authService.login(username, passwordStr);
      const normalizedRole = role === 'admin' || role === 'merchant' ? (role as 'admin' | 'merchant') : null;
      const displayName = name || username.split('@')[0] || 'User';
      await setItem('app.auth', JSON.stringify({ isAuthenticated: true, token, role: normalizedRole, name: displayName }));
      set({ isAuthenticated: true, role: normalizedRole, name: displayName, initialized: true });
      return true;
    } catch {
      return false;
    }
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


