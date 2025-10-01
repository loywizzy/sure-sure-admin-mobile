import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../lib/store';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { isAuthenticated, initialize, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError('สิทธิ์ไม่ใช่ผู้ดูแลระบบ หรืออีเมล/รหัสผ่านไม่ถูกต้อง');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: '#000DFF' }}>
        {/* Card */}
        <View className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }}>
          {/* Brand */}
          <View className="mb-6 items-center">
            <Text className="text-xs uppercase tracking-widest text-blue-600">Sure Sure Admin</Text>
            <Text className="mt-1 text-3xl font-extrabold text-gray-900">เข้าสู่ระบบ</Text>
            <Text className="mt-2 text-sm text-gray-500">จัดการระบบสำหรับผู้ดูแล</Text>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="mb-2 text-sm text-gray-700">อีเมล</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor="#9ca3af" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900" />
          </View>
          {/* Password */}
          <View className="mb-2">
            <Text className="mb-2 text-sm text-gray-700">รหัสผ่าน</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#9ca3af" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900" />
          </View>

          {!!error && (
            <Text className="mb-3 text-center text-sm text-red-600">{error}</Text>
          )}

          {/* Actions */}
          <TouchableOpacity disabled={loading} onPress={onSubmit} className={`mt-2 items-center justify-center rounded-xl ${loading ? 'bg-blue-400' : 'bg-blue-600'} py-3`}>
            <Text className="text-base font-semibold text-white">{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="mt-6 items-center">
            <Text className="text-xs text-gray-400">© {new Date().getFullYear()} Sure Sure Admin</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


