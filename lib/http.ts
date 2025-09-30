import { Platform } from 'react-native';

function guessHost(): string {
	// Web: ใช้ hostname ปัจจุบัน
	if (typeof window !== 'undefined' && window.location?.hostname) {
		return window.location.hostname;
	}
	// Android emulator: 10.0.2.2 ชี้ไปยัง localhost ของเครื่องพัฒนา
	if (Platform.OS === 'android') return '10.0.2.2';
	// iOS simulator/อื่นๆ: localhost ปกติ
	return '127.0.0.1';
}

const API_PROTO = (process.env.EXPO_PUBLIC_API_PROTO as string) || 'http';
const API_HOST = (process.env.EXPO_PUBLIC_API_HOST as string) || guessHost();
const API_PORT = (process.env.EXPO_PUBLIC_API_PORT as string) || '4567';

export const API_BASE = `${API_PROTO}://${API_HOST}:${API_PORT}/api/v1`;

type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

function buildUrl(path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${API_BASE}${normalized}`;
}

function buildHeaders(extra?: Record<string, string>, token?: string): HeadersInit {
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(extra || {}),
	};
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

async function request<T>(method: HttpMethod, path: string, body?: unknown, token?: string, signal?: AbortSignal): Promise<T> {
	const res = await fetch(buildUrl(path), {
		method,
		headers: buildHeaders(undefined, token),
		body: body === undefined ? undefined : JSON.stringify(body),
		signal,
	});

	const text = await res.text();
	let data: unknown = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		// non-JSON response
		data = text as unknown;
	}

	if (!res.ok) {
		const message = typeof data === 'object' && data && 'message' in (data as any) ? (data as any).message : res.statusText;
		throw new Error(typeof message === 'string' && message.length ? message : `HTTP ${res.status}`);
	}
	return data as T;
}

export async function httpGet<T>(path: string, options?: { token?: string; signal?: AbortSignal; headers?: Record<string, string> }): Promise<T> {
	return await request<T>('GET', path, undefined, options?.token, options?.signal);
}

export async function httpPut<TResponse = unknown, TBody = unknown>(path: string, body: TBody, token?: string, signal?: AbortSignal): Promise<TResponse> {
	return await request<TResponse>('PUT', path, body, token, signal);
}


