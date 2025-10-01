import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Modal } from 'react-native';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { packageService } from '../../lib/services/packageService';
import { useLocalSearchParams, router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อแพ็คเกจ'),
  price: z.string().regex(/^\d+(?:\.\d{1,2})?$/, 'กรุณากรอกราคาให้ถูกต้อง'),
  maxQuota: z.string().regex(/^\d+$/, 'กรุณากรอกโควต้าสูงสุดให้ถูกต้อง'),
  remaining: z.string().regex(/^\d+$/, 'กรุณากรอกคงเหลือให้ถูกต้อง'),
  durationDays: z.string().regex(/^\d+$/, 'กรุณากรอกจำนวนวันใช้งานให้ถูกต้อง'),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function EditPackageScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [result, setResult] = useState<{ visible: boolean; success?: boolean; message: string }>({ visible: false, message: '' });
  const queryClient = useQueryClient();
  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: '', maxQuota: '', active: true, remaining: '', durationDays: '' },
  });

  const active = watch('active');
  const name = watch('name');
  const price = watch('price');
  const maxQuota = watch('maxQuota');
  const remaining = watch('remaining');
  const durationDays = watch('durationDays');

  const { data: pkg } = useQuery({
    queryKey: ['packages', code],
    queryFn: async () => (code ? await packageService.fetchPackageById(Number(code)) : undefined),
    enabled: Boolean(code),
  });

  useEffect(() => {
    if (pkg) {
      setValue('name', pkg.name);
      setValue('price', String(pkg.price));
      setValue('maxQuota', String(pkg.maxQuota));
      setValue('active', pkg.active);
      setValue('remaining', String(pkg.remaining));
      setValue('durationDays', String(pkg.durationDays));
    }
  }, [pkg, setValue]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!code) throw new Error('no code');
      const payload = {
        id: Number(code),
        package_name: values.name.trim(),
        package_price: Number(values.price),
        quota_limit: Number(values.maxQuota),
        amount: Number(values.remaining || '0'),
        duration: Number(values.durationDays),
        is_active: values.active ? 1 : 0,
      } as const;
      await packageService.updatePackage(payload as any);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['packages'] }),
        queryClient.invalidateQueries({ queryKey: ['packages', code] }),
      ]);
      setResult({ visible: true, success: true, message: 'แก้ไขสำเร็จ' });
    },
    onError: () => setResult({ visible: true, success: false, message: 'ไม่สามารถดำเนินการได้\nโปรดลองอีกครั้ง' }),
  });

  const onSubmit = (values: FormValues) => mutation.mutate(values);

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View className="mb-5">
      <Text className="mb-2 text-sm text-gray-700">{label}</Text>
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <Navbar onMenuPress={() => setIsSidebarVisible(true)} title="แก้ไขแพ็คเกจ" />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />

      <ScrollView className="flex-1 px-4 pt-3">
        <View className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }}>
          <Text className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-gray-100">แก้ไขแพ็คเกจ</Text>

          <Field label="ชื่อแพ็คเกจ">
            <TextInput value={name} onChangeText={(t) => setValue('name', t)} placeholder="Basic" placeholderTextColor="#9ca3af" className="border-b border-gray-200 dark:border-gray-700 pb-2 text-base text-gray-900 dark:text-gray-100" />
          </Field>
          <Field label="ราคา">
            <TextInput value={price} onChangeText={(t) => setValue('price', t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#9ca3af" className="border-b border-gray-200 dark:border-gray-700 pb-2 text-base text-gray-900 dark:text-gray-100" />
          </Field>
          <Field label="โควต้าสูงสุด">
            <TextInput value={maxQuota} onChangeText={(t) => setValue('maxQuota', t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" placeholderTextColor="#9ca3af" className="border-b border-gray-200 dark:border-gray-700 pb-2 text-base text-gray-900 dark:text-gray-100" />
          </Field>
          <Field label="สถานะ">
            <View className="flex-row items-center justify-end">
              <Switch value={active} onValueChange={(v) => setValue('active', v)} />
            </View>
          </Field>
          <Field label="จำนวนการขาย">
            <TextInput value={remaining} onChangeText={(t) => setValue('remaining', t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" placeholderTextColor="#9ca3af" className="border-b border-gray-200 dark:border-gray-700 pb-2 text-base text-gray-900 dark:text-gray-100" />
          </Field>
          <Field label="จำนวนวันใช้งาน">
            <TextInput value={durationDays} onChangeText={(t) => setValue('durationDays', t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="0" placeholderTextColor="#9ca3af" className="border-b border-gray-200 dark:border-gray-700 pb-2 text-base text-gray-900 dark:text-gray-100" />
          </Field>

          <View className="mt-2 flex-row justify-between">
            <TouchableOpacity className="mr-3 flex-1 flex-row items-center justify-center rounded-lg border border-red-200 bg-white dark:bg-gray-900 py-3" onPress={() => router.back()}>
              <Text className="mr-2 text-red-500">✕</Text>
              <Text className="text-base font-medium text-red-500">ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity className="ml-3 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 py-3" onPress={handleSubmit(onSubmit)}>
              <Text className="mr-2 text-white">✓</Text>
              <Text className="text-base font-semibold text-white">ยืนยัน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alerts */}
      <Modal transparent visible={result.visible} animationType="fade" onRequestClose={() => setResult({ ...result, visible: false })}>
        <TouchableOpacity activeOpacity={1} onPress={() => setResult({ ...result, visible: false })} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} />
        <View className="absolute left-10 right-10 top-40 items-center rounded-2xl bg-white dark:bg-gray-900 p-6" style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 }}>
          <View className={`mb-4 h-24 w-24 items-center justify-center rounded-full ${result.success ? 'bg-green-200' : 'bg-red-200'}`}>
            <Text className={`text-5xl ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.success ? '✓' : '✕'}</Text>
          </View>
          <Text className="mb-5 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">{result.message}</Text>
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


