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
  if (typeof (obj as any).token === 'string') return (obj as any).token as string;
  if (typeof (obj as any).access_token === 'string') return (obj as any).access_token as string;
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
  if (typeof (obj as any).name === 'string') return (obj as any).name as string;
  const user = (obj as any).user || (obj as any).profile || (obj as any).data?.user;
  if (user && typeof user === 'object') {
    if (typeof (user as any).name === 'string') return (user as any).name as string;
    if (typeof (user as any).username === 'string') return (user as any).username as string;
  }
  return undefined;
}

function extractRole(obj: any): string | null | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  if (typeof (obj as any).role === 'string') return (obj as any).role as string;
  if (typeof (obj as any).user_role === 'string') return (obj as any).user_role as string;
  const user = (obj as any).user || (obj as any).profile || (obj as any).data?.user;
  if (user && typeof user === 'object') {
    if (typeof (user as any).role === 'string') return (user as any).role as string;
    if (typeof (user as any).user_role === 'string') return (user as any).user_role as string;
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


