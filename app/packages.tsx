import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Switch } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

type PackageItem = {
  code: string; // e.g., 00002
  name: string; // e.g., Basic
  price: number; // e.g., 225
  maxQuota: number; // โควต้าสูงสุด
  remaining: number; // คงเหลือ
  durationDays: number; // ระยะเวลา (วัน)
  active: boolean; // true = Active
};

type PackageForm = {
  code?: string;
  name: string;
  price: string; // keep as string for controlled numeric input
  maxQuota: string;
  remaining: string;
  durationDays: string;
  active: boolean;
};

export default function PackagesScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<PackageItem[]>([
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
  ]);

  const [editVisible, setEditVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [resultModal, setResultModal] = useState<{ visible: boolean; success?: boolean; message: string }>({ visible: false, message: '' });

  const [form, setForm] = useState<PackageForm>({
    code: undefined,
    name: '',
    price: '',
    maxQuota: '',
    remaining: '',
    durationDays: '',
    active: true,
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
  }, [items, query]);

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatPrice = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const openEdit = (pkg: PackageItem) => {
    setForm({
      code: pkg.code,
      name: pkg.name,
      price: String(pkg.price),
      maxQuota: String(pkg.maxQuota),
      remaining: String(pkg.remaining),
      durationDays: String(pkg.durationDays),
      active: pkg.active,
    });
    setEditVisible(true);
  };

  const openCreate = () => {
    setForm({ code: undefined, name: '', price: '', maxQuota: '', remaining: '', durationDays: '', active: true });
    setCreateVisible(true);
  };

  const nextCode = () => {
    const max = items.reduce((acc, it) => Math.max(acc, Number(it.code)), 0);
    const next = String(max + 1).padStart(5, '0');
    return next;
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return 'กรุณากรอกชื่อแพ็คเกจ';
    if (!form.price || isNaN(Number(form.price))) return 'กรุณากรอกราคาให้ถูกต้อง';
    if (!form.maxQuota || isNaN(Number(form.maxQuota))) return 'กรุณากรอกโควต้าสูงสุดให้ถูกต้อง';
    if (!form.remaining || isNaN(Number(form.remaining))) return 'กรุณากรอกคงเหลือให้ถูกต้อง';
    if (!form.durationDays || isNaN(Number(form.durationDays))) return 'กรุณากรอกจำนวนวันใช้งานให้ถูกต้อง';
    return null;
  };

  const persist = (mode: 'create' | 'edit') => {
    const error = validateForm();
    if (error) {
      setResultModal({ visible: true, success: undefined, message: 'ไม่สามารถดำเนินการได้\nโปรดลองอีกครั้ง' });
      return;
    }
    if (mode === 'edit' && form.code) {
      setItems((prev) =>
        prev.map((p) =>
          p.code === form.code
            ? {
                ...p,
                name: form.name.trim(),
                price: Number(form.price),
                maxQuota: Number(form.maxQuota),
                remaining: Number(form.remaining),
                durationDays: Number(form.durationDays),
                active: form.active,
              }
            : p
        )
      );
      setEditVisible(false);
      setResultModal({ visible: true, success: true, message: 'แก้ไขสำเร็จ' });
    } else {
      const code = nextCode();
      setItems((prev) => [
        ...prev,
        {
          code,
          name: form.name.trim(),
          price: Number(form.price),
          maxQuota: Number(form.maxQuota),
          remaining: Number(form.remaining),
          durationDays: Number(form.durationDays),
          active: form.active,
        },
      ]);
      setCreateVisible(false);
      setResultModal({ visible: true, success: true, message: 'สร้างแพ็คเกจสำเร็จ' });
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View className="mb-5">
      <Text className="mb-2 text-sm text-gray-700">{label}</Text>
      {children}
    </View>
  );

  const FormModal = ({ visible, mode, onClose }: { visible: boolean; mode: 'create' | 'edit'; onClose: () => void }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}
      />
      <View className="absolute left-4 right-4 top-16 rounded-2xl bg-white" style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 }}>
        <View className="px-6 pt-6">
          <Text className="mb-4 text-2xl font-extrabold text-gray-900">{mode === 'create' ? 'สร้างแพ็คเกจ' : 'แก้ไขแพ็คเกจ'}</Text>

          <Field label="ชื่อแพ็คเกจ">
            <TextInput
              value={form.name}
              onChangeText={(t) => setForm((s) => ({ ...s, name: t }))}
              placeholder="Basic"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
            />
          </Field>

          <Field label="ราคา">
            <TextInput
              value={form.price}
              onChangeText={(t) => setForm((s) => ({ ...s, price: t.replace(/[^0-9.]/g, '') }))}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
            />
          </Field>

          <Field label="โควต้าสูงสุด">
            <TextInput
              value={form.maxQuota}
              onChangeText={(t) => setForm((s) => ({ ...s, maxQuota: t.replace(/[^0-9]/g, '') }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
            />
          </Field>

          <Field label="สถานะ">
            <View className="flex-row items-center justify-end">
              <Switch value={form.active} onValueChange={(v) => setForm((s) => ({ ...s, active: v }))} />
            </View>
          </Field>

          <Field label="จำนวนการขาย">
            <TextInput
              value={form.remaining}
              onChangeText={(t) => setForm((s) => ({ ...s, remaining: t.replace(/[^0-9]/g, '') }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
            />
          </Field>

          <Field label="จำนวนวันใช้งาน">
            <TextInput
              value={form.durationDays}
              onChangeText={(t) => setForm((s) => ({ ...s, durationDays: t.replace(/[^0-9]/g, '') }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-200 pb-2 text-base text-gray-900"
            />
          </Field>
        </View>

        {/* Footer */}
        <View className="flex-row justify-between p-4">
          <TouchableOpacity
            className="mr-3 flex-1 flex-row items-center justify-center rounded-lg border border-red-200 bg-white py-3"
            onPress={onClose}
          >
            <Text className="mr-2 text-red-500">✕</Text>
            <Text className="text-base font-medium text-red-500">ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-3 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 py-3"
            onPress={() => persist(mode)}
          >
            <Text className="mr-2 text-white">✓</Text>
            <Text className="text-base font-semibold text-white">ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ResultModal = () => (
    <Modal transparent visible={resultModal.visible} animationType="fade" onRequestClose={() => setResultModal({ ...resultModal, visible: false })}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setResultModal({ ...resultModal, visible: false })}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}
      />
      <View className="absolute left-10 right-10 top-40 rounded-2xl bg-white p-6 items-center" style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 }}>
        <View className={`mb-4 h-24 w-24 items-center justify-center rounded-full ${resultModal.success ? 'bg-green-200' : 'bg-red-200'}`}>
          <Text className={`text-5xl ${resultModal.success ? 'text-green-600' : 'text-red-600'}`}>{resultModal.success ? '✓' : '✕'}</Text>
        </View>
        <Text className="mb-5 text-center text-lg font-semibold text-gray-800">{resultModal.message}</Text>
        <TouchableOpacity className="w-full items-center justify-center rounded-lg bg-blue-600 py-3" onPress={() => setResultModal({ ...resultModal, visible: false })}>
          <Text className="text-base font-semibold text-white">ตกลง</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const PackageCard = ({ item }: { item: PackageItem }) => (
    <View
      className="mx-3 mb-6 rounded-2xl border border-gray-200 bg-white p-5"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 }}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-mono tracking-widest text-gray-800">{item.code}</Text>
        <Text className={`text-sm ${item.active ? 'text-green-600' : 'text-red-500'}`}>
          ({item.active ? 'Active' : 'Deactive'})
        </Text>
      </View>
      <Text className="mb-3 text-2xl font-extrabold text-gray-900">{item.name}</Text>

      <View className="mb-4">
        <Text className="text-gray-700">💰 ราคา: {formatPrice(item.price)} บาท</Text>
        <Text className="text-gray-700">📊 ใช้งานสูงสุด: {formatNumber(item.maxQuota)}</Text>
        <Text className="text-gray-700">🏆 คงเหลือ: {formatNumber(item.remaining)}</Text>
        <Text className="text-gray-700">⏳ ระยะเวลา: {item.durationDays} วัน</Text>
      </View>

      <TouchableOpacity className="self-start rounded-full bg-blue-600 px-5 py-2" onPress={() => openEdit(item)}>
        <Text className="text-white">แก้ไข</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="แพ็คเกจ" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        {/* Search bar */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-2">
            <View className="flex-row items-center">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="รหัสแพ็คเกจ , ชื่อแพ็คเกจ"
                placeholderTextColor="#9ca3af"
                className="flex-1 px-1 text-sm text-gray-800"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} className="ml-2 h-8 w-8 items-center justify-center rounded-full border border-red-200">
                  <Text className="text-red-500">✕</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <Text className="text-white">🔎</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {filtered.map((it) => (
          <PackageCard key={it.code} item={it} />
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={openCreate}
        style={{ position: 'absolute', right: 24, bottom: 24 }}
        className="h-12 w-12 items-center justify-center rounded-full bg-blue-600"
      >
        <Text className="text-2xl text-white">＋</Text>
      </TouchableOpacity>

      {/* Modals */}
      <FormModal visible={editVisible} mode="edit" onClose={() => setEditVisible(false)} />
      <FormModal visible={createVisible} mode="create" onClose={() => setCreateVisible(false)} />
      <ResultModal />
    </View>
  );
}


