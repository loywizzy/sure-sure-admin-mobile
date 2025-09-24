import { getJSON, setJSON } from './storage';
import { PackageItem, TransactionItem, BranchItem, UserItem } from './types';

const KEYS = {
  packages: 'app.packages',
  transactions: 'app.transactions',
  branches: 'app.branches',
  users: 'app.users',
} as const;

async function delay(ms = 250) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// Seed data on first load
async function ensureSeeds(): Promise<void> {
  const [pkgs, txns, brs, users] = await Promise.all([
    getJSON<PackageItem[] | null>(KEYS.packages, null),
    getJSON<TransactionItem[] | null>(KEYS.transactions, null),
    getJSON<BranchItem[] | null>(KEYS.branches, null),
    getJSON<UserItem[] | null>(KEYS.users, null),
  ]);

  if (!pkgs) {
    const seed: PackageItem[] = [
      { code: '00002', name: 'Basic', price: 225, maxQuota: 500, remaining: 999982, durationDays: 30, active: true },
      { code: '00003', name: 'Plus', price: 2000, maxQuota: 5000, remaining: 1000000, durationDays: 30, active: false },
      { code: '00004', name: 'Advance', price: 5000, maxQuota: 500, remaining: 999982, durationDays: 30, active: true },
      { code: '00005', name: 'Pro', price: 10000, maxQuota: 5000, remaining: 1000000, durationDays: 30, active: false },
      { code: '00006', name: 'Promax', price: 50000, maxQuota: 500, remaining: 999982, durationDays: 30, active: true },
      { code: '00007', name: 'Ultimate', price: 100000, maxQuota: 5000, remaining: 1000000, durationDays: 30, active: false },
    ];
    await setJSON(KEYS.packages, seed);
  }

  if (!txns) {
    const seed: TransactionItem[] = [
      { id: '000001', customerNo: '59', firstName: 'John', lastName: 'Kub', createdAt: new Date('2021-04-23').toISOString(), bank: 'KBank', transferId: '#88201', status: 'TRANSACTION SUCCESSFUL' },
      { id: '000002', customerNo: '59', firstName: 'สมหญิง', lastName: 'รักดี', createdAt: new Date('2021-04-18').toISOString(), bank: 'KBank', errorMsg: 'Amount < Minimum', transferId: '#88201', status: 'ERROR' },
      { id: '000003', customerNo: '59', firstName: 'สมหญิง', lastName: 'รักดี', createdAt: new Date('2021-04-18').toISOString(), bank: 'KBank', errorMsg: 'Amount < Minimum', transferId: '#88201', status: 'TRANSACTION UNSUCCESSFUL' },
      { id: '000004', customerNo: '59', firstName: 'สมหญิง', lastName: 'รักดี', createdAt: new Date('2021-04-18').toISOString(), bank: 'KBank', errorMsg: 'Amount < Minimum', transferId: '#88201', status: 'RECEIVER NOT MATCH' },
    ];
    await setJSON(KEYS.transactions, seed);
  }

  if (!brs) {
    const seed: BranchItem[] = [
      { id: '01', code: '01', roomName: 'สาขาหลัก', customerName: 'TATAR', usedQuota: 0, minReceived: 0 },
      { id: '02', code: '04', roomName: 'สาขาเชียงใหม่', customerName: 'John Wick', usedQuota: 1500, minReceived: 3454 },
    ];
    await setJSON(KEYS.branches, seed);
  }

  if (!users) {
    const seed: UserItem[] = [
      {
        id: '000001',
        code: '01',
        firstName: 'TATAR',
        lastName: '',
        email: 'tatarkub@gmail.com',
        role: 'merchant',
        active: true,
        packageCode: '00002',
        usedCount: 0,
        remaining: 100,
        expiresAt: new Date('2025-03-10').toISOString(),
      },
      {
        id: '000002',
        code: '02',
        firstName: 'John',
        lastName: 'John',
        email: 'john@example.com',
        role: 'merchant',
        active: true,
        packageCode: '00002',
        usedCount: 0,
        remaining: 100,
        expiresAt: new Date('2025-03-10').toISOString(),
      },
      {
        id: '000003',
        code: '03',
        firstName: 'Adobe',
        lastName: 'S.',
        email: 'adobe@example.com',
        role: 'merchant',
        active: true,
        packageCode: '00003',
        usedCount: 0,
        remaining: 100,
        expiresAt: new Date('2025-03-10').toISOString(),
      },
    ];
    await setJSON(KEYS.users, seed);
  }
}

// Packages API
export async function listPackages(): Promise<PackageItem[]> {
  await ensureSeeds();
  await delay();
  return await getJSON<PackageItem[]>(KEYS.packages, []);
}

export async function getPackageByCode(code: string): Promise<PackageItem | undefined> {
  const list = await listPackages();
  return list.find((p) => p.code === code);
}

export async function upsertPackage(item: PackageItem): Promise<void> {
  const list = await listPackages();
  const idx = list.findIndex((p) => p.code === item.code);
  if (idx >= 0) list[idx] = { ...item };
  else list.push({ ...item });
  await setJSON(KEYS.packages, list);
  await delay(100);
}

export async function removePackage(code: string): Promise<void> {
  const list = await listPackages();
  const next = list.filter((p) => p.code !== code);
  await setJSON(KEYS.packages, next);
  await delay(100);
}

export async function getNextPackageCode(): Promise<string> {
  const list = await listPackages();
  const max = list.reduce((acc, it) => Math.max(acc, Number(it.code)), 0);
  return String(max + 1).padStart(5, '0');
}

// Transactions API
export async function listTransactions(): Promise<TransactionItem[]> {
  await ensureSeeds();
  await delay();
  return await getJSON<TransactionItem[]>(KEYS.transactions, []);
}

// Branches API
export async function listBranches(): Promise<BranchItem[]> {
  await ensureSeeds();
  await delay();
  return await getJSON<BranchItem[]>(KEYS.branches, []);
}

// Users API
export async function listUsers(): Promise<UserItem[]> {
  await ensureSeeds();
  await delay();
  return await getJSON<UserItem[]>(KEYS.users, []);
}

export async function getUserById(id: string): Promise<UserItem | undefined> {
  const users = await listUsers();
  return users.find((u) => u.id === id);
}

export async function updateUser(id: string, patch: Partial<Pick<UserItem, 'packageCode' | 'active'>>): Promise<void> {
  const users = await listUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...patch };
  await setJSON(KEYS.users, users);
  await delay(100);
}


