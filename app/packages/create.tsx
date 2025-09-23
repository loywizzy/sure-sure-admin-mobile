import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Modal } from 'react-native';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getNextPackageCode, upsertPackage } from '../../features/packages/store';
import { router } from 'expo-router';

export default function CreatePackageScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [result, setResult] = useState<{ visible: boolean; success?: boolean; message: string }>({ visible: false, message: '' });

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [maxQuota, setMaxQuota] = useState('');
  const [active, setActive] = useState(true);
  const [remaining, setRemaining] = useState('');
  const [durationDays, setDurationDays] = useState('');

  const validate = (): string | null => {
    if (!name.trim()) return 'กรุณากรอกชื่อแพ็คเกจ';
    if (!price || isNaN(Number(price))) return 'กรุณากรอกราคาให้ถูกต้อง';
    if (!maxQuota || isNaN(Number(maxQuota))) return 'กรุณากรอกโควต้าสูงสุดให้ถูกต้อง';
    if (!remaining || isNaN(Number(remaining))) return 'กรุณากรอกคงเหลือให้ถูกต้อง';
    if (!durationDays || isNaN(Number(durationDays))) return 'กรุณากรอกจำนวนวันใช้งานให้ถูกต้อง';
    return null;
  };

  const submit = () => {
    const error = validate();
    if (error) {
      setResult({ visible: true, message: 'ไม่สามารถดำเนินการได้\nโปรดลองอีกครั้ง' });
      return;
    }
    const code = getNextPackageCode();
    upsertPackage({
      code,
      name: name.trim(),
      price: Number(price),
      maxQuota: Number(maxQuota),
      remaining: Number(remaining),
      durationDays: Number(durationDays),
      active,
    });
    setResult({ visible: true, success: true, message: 'สร้างแพ็คเกจสำเร็จ' });
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View className="mb-5">
      <Text className="mb-2 text-sm text-gray-700">{label}</Text>
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={() => setIsSidebarVisible(true)} title="สร้างแพ็คเกจ" />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />

      <ScrollView className="flex-1 px-4 pt-3">
        <View className="rounded-2xl border border-gray-100 bg-white p-6" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }}>
          <Text className="mb-4 text-2xl font-extrabold text-gray-900">สร้างแพ็คเกจ</Text>

          <Field label="ชื่อแพ็คเกจ">
            <TextInput value={name} onChangeText={setName} placeholder="Advance" placeholderTextColor="#9ca3af" className="border-b border-gray-200 pb-2 text-base text-gray-900" />
          </Field>
          <Field label="ราคา">
            <TextInput value={price} onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ''))} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#9ca3af" className="border-b border-gray-200 pb-2 text-base text-gray-900" />
          </Field>
          <Field label="โควต้าสูงสุด">
            <TextInput value={maxQuota} onChangeText={(t) => setMaxQuota(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" placeholderTextColor="#9ca3af" className="border-b border-gray-200 pb-2 text-base text-gray-900" />
          </Field>
          <Field label="สถานะ">
            <View className="flex-row items-center justify-end">
              <Switch value={active} onValueChange={setActive} />
            </View>
          </Field>
          <Field label="จำนวนการขาย">
            <TextInput value={remaining} onChangeText={(t) => setRemaining(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" placeholderTextColor="#9ca3af" className="border-b border-gray-200 pb-2 text-base text-gray-900" />
          </Field>
          <Field label="จำนวนวันใช้งาน">
            <TextInput value={durationDays} onChangeText={(t) => setDurationDays(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" placeholderTextColor="#9ca3af" className="border-b border-gray-200 pb-2 text-base text-gray-900" />
          </Field>

          <View className="mt-2 flex-row justify-between">
            <TouchableOpacity className="mr-3 flex-1 flex-row items-center justify-center rounded-lg border border-red-200 bg-white py-3" onPress={() => router.back()}>
              <Text className="mr-2 text-red-500">✕</Text>
              <Text className="text-base font-medium text-red-500">ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity className="ml-3 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 py-3" onPress={submit}>
              <Text className="mr-2 text-white">✓</Text>
              <Text className="text-base font-semibold text-white">ยืนยัน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alerts */}
      <Modal transparent visible={result.visible} animationType="fade" onRequestClose={() => setResult({ ...result, visible: false })}>
        <TouchableOpacity activeOpacity={1} onPress={() => setResult({ ...result, visible: false })} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} />
        <View className="absolute left-10 right-10 top-40 items-center rounded-2xl bg-white p-6" style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 }}>
          <View className={`mb-4 h-24 w-24 items-center justify-center rounded-full ${result.success ? 'bg-green-200' : 'bg-red-200'}`}>
            <Text className={`text-5xl ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.success ? '✓' : '✕'}</Text>
          </View>
          <Text className="mb-5 text-center text-lg font-semibold text-gray-800">{result.message}</Text>
          <TouchableOpacity
            className="w-full items-center justify-center rounded-lg bg-blue-600 py-3"
            onPress={() => {
              setResult({ ...result, visible: false });
              if (result.success) router.replace('/packages');
            }}
          >
            <Text className="text-base font-semibold text-white">ตกลง</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}


