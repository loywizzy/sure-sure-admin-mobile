// Domain types
export type PackageItem = {
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
};

export type BranchItem = {
  id: string;
  code: string;
  roomName: string;
  customerName: string;
  usedQuota: number;
  minReceived: number;
};


