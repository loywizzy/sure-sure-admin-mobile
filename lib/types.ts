// Domain types
export type PackageItem = {
  id?: number;
  code: string;
  name: string;
  price: number;
  maxQuota: number;
  remaining: number;
  durationDays: number;
  active: boolean;
};

export type TransactionStatus =
  | 'TRANSACTION SUCCESSFUL'
  | 'TRANSACTION UNSUCCESSFUL'
  | 'RECEIVER NOT MATCH'
  | 'AMOUNT LESS THAN MINIMUM'
  | 'ERROR';

export type TransactionItem = {
  id: string;
  customerNo: string;
  firstName: string;
  lastName: string;
  createdAt: string; // ISO string
  bank: string;
  transferId: string;
  errorMsg?: string;
  status: TransactionStatus;
  amount?: number;
};

export type BranchItem = {
  id: string;
  code: string;
  roomName: string;
  customerName: string;
  usedQuota: number;
  minReceived: number;
};

export type UserRole = 'merchant' | 'admin';

export type UserItem = {
  id: string; // like 000001
  uid?: string; // backend uid used for fetching details
  code: string; // short code like 01
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  active: boolean;
  packageCode: string; // link to PackageItem.code
  usedCount: number;
  remaining: number;
  expiresAt: string; // ISO string
};

// DB types based on ERD (minimal fields we use)
export type DBPackage = {
  id: number; // PK
  packagename: string;
  packageprice: number; // numeric(10,2)
  quotalimit: number; // numeric/int (total quota)
  duration?: number; // days, optional if exists
  isactive: number; // 1 active, 0 inactive
  createddate?: string;
  updateddate?: string;
};

export type DBUser = {
  id: number; // PK
  merchantid?: number | null;
  packageid: number;
  email: string;
  usertype: 'merchant' | 'admin';
  isactive: number; // 1/0
  nameen?: string | null;
  nameth?: string | null;
  quotatotal?: number | null;
  packagechangedate?: string | null;
  billdate?: string | null; // used as expiresAt
  createddate?: string;
  updateddate?: string;
};


