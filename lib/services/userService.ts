import { httpGet, httpPut } from '../http';
import type { UserItem } from '../types';

// API response types (ตามสัญญา backend ปัจจุบัน)
export type ApiUser = {
	access_token?: string | null;
	address?: string | null;
	bill_date?: string | null;
	created_date?: string | null;
	email: string;
	id: number;
	is_active: number; // 0/1
	merchant_id?: number | null;
	name_en?: string | null;
	name_th?: string | null;
	package_change_date?: string | null;
	package_id: number;
	password?: string | null;
	phone?: string | null;
	picture?: string | null;
	quota_all?: number | null;
	quota_left?: number | null;
	quota_usage?: number | null;
	step?: number | null;
	store_category_type?: string | null;
	store_email?: string | null;
	store_name?: string | null;
	store_phone?: string | null;
	token?: string | null;
	uid?: string | null;
	updated_date?: string | null;
	user_role?: string | null; // 'admin' | 'merchant' | etc.
	user_type?: string | null;
	username?: string | null;
	website?: string | null;
};

export type ApiUserListResponse = ApiUser[] | { data: ApiUser[] };

export type UpdateUserPayload = ApiUser; // ใช้ payload ตามที่ผู้ใช้ระบุมา (PUT /user/update)

function mapApiUserToUserItem(u: ApiUser): UserItem {
	const role = (u.user_role === 'admin' || u.user_role === 'merchant') ? u.user_role : 'merchant';
	const firstName = u.name_en || u.name_th || u.username || 'User';
	return {
		id: String(u.id),
		uid: u.uid || undefined,
		code: u.merchant_id ? String(u.merchant_id).padStart(2, '0') : String(u.id).slice(-2).padStart(2, '0'),
		firstName,
		lastName: '',
		email: u.email,
		role,
		active: Number(u.is_active) === 1,
		packageCode: String(u.package_id ?? 0).padStart(5, '0'),
		usedCount: Number(u.quota_usage ?? 0),
		remaining: Number(u.quota_left ?? 0),
		expiresAt: u.bill_date ?? new Date().toISOString(),
	};
}

function extractList(resp: ApiUserListResponse): ApiUser[] {
	if (Array.isArray(resp)) return resp;
	if (resp && typeof resp === 'object' && 'data' in resp) return (resp as any).data as ApiUser[];
	return [];
}

// GET /user/get
export async function fetchUsers(): Promise<UserItem[]> {
	const data = await httpGet<ApiUserListResponse>('/user/get');
	return extractList(data).map(mapApiUserToUserItem);
}

// GET /user/get/:id
export async function fetchUserByUid(uid: string): Promise<UserItem | undefined> {
    const data = await httpGet<ApiUser | { data: ApiUser | null }>(`/user/get/${encodeURIComponent(uid)}`);
    const user = (data && typeof data === 'object' && 'data' in data) ? (data as any).data as ApiUser | null : (data as ApiUser);
    return user ? mapApiUserToUserItem(user) : undefined;
}

// PUT /user/update
export async function updateUserRemote(payload: UpdateUserPayload): Promise<{ success: boolean } | ApiUser | { message?: string }> {
	// หมายเหตุ: backend ระบุให้ส่ง payload ตามรูปแบบที่ให้มา
	return await httpPut(`/user/update`, payload);
}

export const userService = {
	fetchUsers,
    fetchUserByUid,
	updateUserRemote,
};


