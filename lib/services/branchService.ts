import { httpGet } from '../http';
import type { BranchItem, UserItem } from '../types';
import { userService } from './userService';

type ApiResponse<T> = { status_code: number; message?: string; data?: T } | T;

export type ApiBranch = {
  id: number;
  user_id: number;
  line_group_id?: string;
  room_name: string;
  qr_token?: string;
  quota_used?: number; // number
  min_receive?: number; // number
  show_transferor?: boolean;
  show_recipient?: boolean;
  list_bank?: string; // JSON string e.g. "[2]"
  created_date?: string;
  updated_date?: string;
};

function unwrap<T>(res: ApiResponse<T>): T {
  if (res && typeof res === 'object' && 'data' in (res as any)) return (res as any).data as T;
  return res as T;
}

function buildUserMap(users: UserItem[]): Map<number, UserItem> {
  const map = new Map<number, UserItem>();
  for (const u of users) {
    const idNum = Number(u.id);
    if (!Number.isNaN(idNum)) map.set(idNum, u);
  }
  return map;
}

function mapApiBranchToItem(b: ApiBranch, userMap: Map<number, UserItem>): BranchItem {
  const user = userMap.get(b.user_id);
  const customerName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : 'Unknown';
  return {
    id: String(b.id),
    code: String(b.user_id).padStart(2, '0'),
    roomName: b.room_name,
    customerName,
    usedQuota: Number(b.quota_used ?? 0),
    minReceived: Number(b.min_receive ?? 0),
  };
}

export async function fetchBranches(): Promise<BranchItem[]> {
  const [branchRes, users] = await Promise.all([
    httpGet<ApiResponse<ApiBranch[]>>('/room2/get'),
    userService.fetchUsers(),
  ]);
  const userMap = buildUserMap(users);
  const branches = unwrap(branchRes) || [];
  return branches.map((b) => mapApiBranchToItem(b, userMap));
}

export const branchService = {
  fetchBranches,
};


