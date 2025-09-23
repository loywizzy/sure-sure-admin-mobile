export type PackageItem = {
  code: string;
  name: string;
  price: number;
  maxQuota: number;
  remaining: number;
  durationDays: number;
  active: boolean;
};

let packages: PackageItem[] = [
  {
    code: '00002',
    name: 'Basic',
    price: 225,
    maxQuota: 500,
    remaining: 999982,
    durationDays: 30,
    active: true,
  },
  {
    code: '00003',
    name: 'Plus',
    price: 2000,
    maxQuota: 5000,
    remaining: 1000000,
    durationDays: 30,
    active: false,
  },
];

const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

export function getPackages(): PackageItem[] {
  return packages.slice();
}

export function getPackageByCode(code: string): PackageItem | undefined {
  return packages.find((p) => p.code === code);
}

export function setPackages(next: PackageItem[]): void {
  packages = next.slice();
  notify();
}

export function upsertPackage(item: PackageItem): void {
  const index = packages.findIndex((p) => p.code === item.code);
  if (index >= 0) {
    packages[index] = { ...item };
  } else {
    packages.push({ ...item });
  }
  notify();
}

export function removePackage(code: string): void {
  packages = packages.filter((p) => p.code !== code);
  notify();
}

export function getNextPackageCode(): string {
  const max = packages.reduce((acc, it) => Math.max(acc, Number(it.code)), 0);
  return String(max + 1).padStart(5, '0');
}


