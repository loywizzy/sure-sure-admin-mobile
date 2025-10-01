import { httpGet } from '../http';

type ApiResponse<T> = { status_code: number; message?: string; data?: T } | T;

export type ApiOrderPackage = {
  id: number;
  ref_no: string;
  user_id: number;
  package_id: number;
  price: number;
  status: string; // SUCCESS/FAILED/...
  created_date: string; // ISO
  updated_date?: string;
};

function unwrap<T>(res: ApiResponse<T>): T {
  if (res && typeof res === 'object' && 'data' in (res as any)) return (res as any).data as T;
  return res as T;
}

export async function fetchOrderPackages(): Promise<ApiOrderPackage[]> {
  const res = await httpGet<ApiResponse<ApiOrderPackage[]>>('/order-package/get');
  return unwrap(res) || [];
}

export const orderPackageService = {
  fetchOrderPackages,
};


