import { httpPost } from '../http';

export type LoginRequest = {
  username: string;
  password: string;
};

export type NormalizedLoginResult = {
  token: string;
  role?: string | null;
  name?: string | null;
  raw?: unknown;
};

function extractToken(obj: any): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  if (Array.isArray(obj)) {
    for (const it of obj) {
      const t = extractToken(it);
      if (t) return t;
    }
    return undefined;
  }
  if (typeof (obj as any).token === 'string') return (obj as any).token as string;
  if (typeof (obj as any).Token === 'string') return (obj as any).Token as string;
  if (typeof (obj as any).access_token === 'string') return (obj as any).access_token as string;
  if (typeof (obj as any).AccessToken === 'string') return (obj as any).AccessToken as string;
  const nestedKeys = ['data', 'result', 'payload', 'response'];
  for (const key of nestedKeys) {
    const val = (obj as any)[key];
    const t = extractToken(val);
    if (t) return t;
  }
  return undefined;
}

function extractName(obj: any): string | null | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  if (Array.isArray(obj)) {
    for (const it of obj) {
      const n = extractName(it);
      if (typeof n === 'string') return n;
    }
    return undefined;
  }
  if (typeof (obj as any).name === 'string') return (obj as any).name as string;
  if (typeof (obj as any).NameEN === 'string') return (obj as any).NameEN as string;
  if (typeof (obj as any).NameTH === 'string') return (obj as any).NameTH as string;
  if (typeof (obj as any).username === 'string') return (obj as any).username as string;
  if (typeof (obj as any).Username === 'string') return (obj as any).Username as string;
  const user = (obj as any).user || (obj as any).profile || (obj as any).data?.user;
  if (user && typeof user === 'object') {
    if (typeof (user as any).name === 'string') return (user as any).name as string;
    if (typeof (user as any).username === 'string') return (user as any).username as string;
    if (typeof (user as any).NameEN === 'string') return (user as any).NameEN as string;
    if (typeof (user as any).NameTH === 'string') return (user as any).NameTH as string;
  }
  return undefined;
}

function extractRole(obj: any): string | null | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  if (Array.isArray(obj)) {
    for (const it of obj) {
      const r = extractRole(it);
      if (typeof r === 'string') return r;
    }
    return undefined;
  }
  // Prefer explicit user_type then user_role, then generic role
  if (typeof (obj as any).user_type === 'string') return (obj as any).user_type as string;
  if (typeof (obj as any).UserType === 'string') return (obj as any).UserType as string;
  if (typeof (obj as any).user_role === 'string') return (obj as any).user_role as string;
  if (typeof (obj as any).UserRole === 'string') return (obj as any).UserRole as string;
  if (typeof (obj as any).role === 'string') return (obj as any).role as string;
  if (typeof (obj as any).Role === 'string') return (obj as any).Role as string;
  const user = (obj as any).user || (obj as any).profile || (obj as any).data?.user;
  if (user && typeof user === 'object') {
    if (typeof (user as any).user_type === 'string') return (user as any).user_type as string;
    if (typeof (user as any).UserType === 'string') return (user as any).UserType as string;
    if (typeof (user as any).user_role === 'string') return (user as any).user_role as string;
    if (typeof (user as any).UserRole === 'string') return (user as any).UserRole as string;
    if (typeof (user as any).role === 'string') return (user as any).role as string;
    if (typeof (user as any).Role === 'string') return (user as any).Role as string;
  }
  // Recursively inspect common nested containers
  const nestedKeys = ['data', 'result', 'payload', 'response'];
  for (const key of nestedKeys) {
    const val = (obj as any)[key];
    const r = extractRole(val);
    if (typeof r === 'string') return r;
  }
  return undefined;
}

async function login(username: string, password: string): Promise<NormalizedLoginResult> {
  const res = await httpPost<any, LoginRequest>('/login', { username, password });
  const token = extractToken(res);
  if (!token) {
    throw new Error('Login failed: missing token in response');
  }
  const role = extractRole(res) ?? null;
  const name = extractName(res) ?? null;
  return { token, role, name, raw: res };
}

export const authService = {
  login,
};


