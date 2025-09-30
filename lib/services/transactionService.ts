import { httpGet } from '../http';
import type { TransactionItem, TransactionStatus } from '../types';

// ตาม API: { status_code, message, data: Txn[] }
type ApiResponse<T> = { status_code: number; message?: string; data?: T } | T;

export type ApiTransaction = {
  id: number;
  user_id: number;
  qr_code?: string;
  ref_no?: string;
  line_user_id?: string;
  line_group_id?: string;
  amount?: number;
  cstid?: string;
  rquid?: string;
  txid?: string;
  sender_bank_code?: string;
  sender_account_no?: string;
  sender_name?: string;
  sender_name2?: string;
  receive_bank_code?: string;
  receive_account_no?: string;
  proxy_account_no?: string;
  ref1?: string;
  ref2?: string;
  receive_name?: string;
  receive_name2?: string;
  message?: string;
  status_code?: string; // '00' success
  status?: string; // 'SUCCESS', 'FAILED', ...
  trans_date?: string; // 'YYYY-MM-DD'
  trans_time?: string; // 'HH:mm:ss'
  created_date?: string; // ISO
  updated_date?: string;
};

function unwrap<T>(res: ApiResponse<T>): T {
  if (res && typeof res === 'object' && 'data' in (res as any)) return (res as any).data as T;
  return res as T;
}

function mapStatus(s?: string, code?: string): TransactionStatus {
  if (s === 'SUCCESS' || code === '00') return 'TRANSACTION SUCCESSFUL';
  if (s === 'FAILED') return 'TRANSACTION UNSUCCESSFUL';
  // อื่นๆ จัดเป็น ERROR ไปก่อน หากมีรหัสเฉพาะค่อยแม็พเพิ่ม
  return 'ERROR';
}

function splitName(full?: string): { first: string; last: string } {
  const name = (full || '').trim();
  if (!name) return { first: 'Unknown', last: '' };
  const parts = name.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

function mapApiTxnToItem(t: ApiTransaction): TransactionItem {
  const { first, last } = splitName(t.sender_name || t.sender_name2 || t.receive_name || t.receive_name2);
  return {
    id: String(t.id),
    customerNo: String(t.user_id ?? t.cstid ?? ''),
    firstName: first,
    lastName: last,
    createdAt: t.created_date || (t.trans_date && t.trans_time ? `${t.trans_date}T${t.trans_time}Z` : new Date().toISOString()),
    bank: t.sender_bank_code || t.receive_bank_code || '-',
    transferId: t.txid || t.ref_no || '-',
    errorMsg: (t.status === 'SUCCESS' || t.status_code === '00') ? undefined : (t.message || undefined),
    status: mapStatus(t.status, t.status_code),
  };
}

export async function fetchTransactions(): Promise<TransactionItem[]> {
  const res = await httpGet<ApiResponse<ApiTransaction[]>>('/transaction/get');
  const list = unwrap(res) || [];
  return list.map(mapApiTxnToItem);
}

export const transactionService = {
  fetchTransactions,
};


