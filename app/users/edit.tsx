import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Modal } from 'react-native';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, listPackages, updateUser } from '../../lib/api';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export default function EditUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [result, setResult] = useState<{ visible: boolean; success?: boolean; message: string }>({ visible: false, message: '' });
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['users', id], queryFn: async () => (id ? await getUserById(String(id)) : undefined), enabled: Boolean(id) });
  const { data: pkgs = [] } = useQuery({ queryKey: ['packages'], queryFn: listPackages });

  const [active, setActive] = useState(true);
  const [packageCode, setPackageCode] = useState<string>('');

  useEffect(() => {
    if (user) {
      setActive(user.active);
      setPackageCode(user.packageCode);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('no id');
      await updateUser(String(id), { active, packageCode });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['users'] }),
        queryClient.invalidateQueries({ queryKey: ['users', id] }),
      ]);
      setResult({ visible: true, success: true, message: 'แก้ไขสำเร็จ' });
    },
    onError: () => setResult({ visible: true, success: false, message: 'ไม่สามารถดำเนินการได้\nโปรดลองอีกครั้ง' }),
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openBottomSheet = () => bottomSheetRef.current?.present();
  const closeBottomSheet = () => bottomSheetRef.current?.dismiss();

  const handleSelectPackage = (code: string) => {
    setPackageCode(code);
    closeBottomSheet();
  };

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  if (!user) {
    return (
      <View className="flex-1 bg-gray-50">
        <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
        <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />
        <View className="flex-1 items-center justify-center"><Text className="text-gray-500">ไม่พบผู้ใช้</Text></View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        <View className="rounded-2xl border border-gray-100 bg-white p-6" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }}>
          <Text className="mb-4 text-3xl font-extrabold text-gray-900">แก้ไขผู้ใช้งาน</Text>

          <View className="mb-5">
            <Text className="mb-2 text-sm text-gray-700">ชื่อผู้ใช้</Text>
            <TextInput editable={false} value={[user.firstName, user.lastName].filter(Boolean).join(' ')} placeholderTextColor="#9ca3af" className="border-b border-gray-200 pb-2 text-lg text-gray-900" />
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm text-gray-700">แพ็คเกจ</Text>
            <TouchableOpacity onPress={openBottomSheet} className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Text className="text-lg text-gray-900">{pkgs.find((p) => p.code === packageCode)?.name || 'เลือกแพ็คเกจ'}</Text>
              <Text className="text-gray-500">▾</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-sm text-gray-700">สถานะ</Text>
            <View className="flex-row items-center justify-end">
              <Switch value={active} onValueChange={setActive} />
            </View>
          </View>

          <View className="mt-2 flex-row justify-between">
            <TouchableOpacity className="mr-3 flex-1 flex-row items-center justify-center rounded-lg border border-red-200 bg-white py-3" onPress={() => router.replace('/users')}>
              <Text className="mr-2 text-red-500">✕</Text>
              <Text className="text-base font-medium text-red-500">ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity className="ml-3 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 py-3" onPress={() => mutation.mutate()}>
              <Text className="mr-2 text-white">✓</Text>
              <Text className="text-base font-semibold text-white">ยืนยัน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet: เลือกแพ็คเกจ */}
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={["50%"]}
        enablePanDownToClose
        backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" opacity={0.4} />}
        backgroundStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#cbd5f5', width: 36, height: 4, borderRadius: 999 }}
      >
        <BottomSheetView className="flex-1 px-6">
          <View className="mb-6 items-center pt-1">
            <Text className="text-2xl font-extrabold text-gray-900">เลือกแพ็คเกจ</Text>
            <Text className="mt-2 text-base text-gray-500">เลือกแพ็คเกจที่ต้องการเปลี่ยน</Text>
          </View>
          {pkgs.map((p) => (
            <TouchableOpacity
              key={p.code}
              className="mb-4 items-center rounded-full border border-gray-200 bg-gray-50 px-5 py-4"
              activeOpacity={0.9}
              onPress={() => handleSelectPackage(p.code)}
            >
              <Text className="text-center text-base font-semibold text-gray-900">{p.name}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>

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
              if (result.success) router.replace({ pathname: '/users/[id]', params: { id } });
            }}
          >
            <Text className="text-base font-semibold text-white">ตกลง</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}


