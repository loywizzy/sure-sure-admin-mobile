import { httpDelete, httpGet, httpPost, httpPut } from '../http';
import type { PackageItem } from '../types';

// สมมติรูปแบบ response รวม: { status_code, message, data }
type ApiResponse<T> = { status_code: number; message?: string; data?: T } | T;

export type ApiPackage = {
	id: number;
	package_name: string;
	package_price: number;
	quota_limit: number;
	amount?: number | null; // remaining
	ordered?: number | null;
	duration?: number | null;
	is_active: number; // 1/0
	created_date?: string;
	updated_date?: string;
};

function mapApiPackageToItem(p: ApiPackage): PackageItem {
    return {
        id: p.id,
        code: String(p.id).padStart(5, '0'),
        name: p.package_name,
        price: Number(p.package_price),
        maxQuota: Number(p.quota_limit),
        remaining: Number(p.amount ?? 0),
        durationDays: Number(p.duration ?? 30),
        active: Number(p.is_active) === 1,
    };
}

function unwrap<T>(res: ApiResponse<T>): T {
	if (res && typeof res === 'object' && 'data' in (res as any)) return (res as any).data as T;
	return res as T;
}

// GET /package/get
export async function fetchPackages(): Promise<PackageItem[]> {
	const res = await httpGet<ApiResponse<ApiPackage[]>>('/package/get');
	return unwrap(res).map(mapApiPackageToItem);
}

// GET /package/get/:id
export async function fetchPackageById(id: number | string): Promise<PackageItem | undefined> {
	const res = await httpGet<ApiResponse<ApiPackage | null>>(`/package/get/${id}`);
	const data = unwrap(res);
	return data ? mapApiPackageToItem(data) : undefined;
}

// POST /package/create
export async function createPackage(payload: ApiPackage): Promise<ApiResponse<unknown>> {
    return await httpPost('/package/create', payload);
}

// PUT /package/update
export async function updatePackage(payload: ApiPackage): Promise<ApiResponse<unknown>> {
    return await httpPut('/package/update', payload);
}

// DELETE /package/delete/:id
export async function deletePackage(id: number | string): Promise<ApiResponse<unknown>> {
	return await httpDelete(`/package/delete/${id}`);
}

export const packageService = {
	fetchPackages,
	fetchPackageById,
	createPackage,
	updatePackage,
	deletePackage,
};


