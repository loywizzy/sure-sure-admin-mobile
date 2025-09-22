import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

interface SearchBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
  selectedStatus: string;
}

export interface SearchParams {
  firstName?: string;
  lastName?: string;
  startDate?: Date;
  endDate?: Date;
}

export default function SearchBottomSheet({
  isVisible,
  onClose,
  onStatusSelect,
  selectedStatus,
}: SearchBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Bottom sheet snap points - ครึ่งหน้าจอ
  const snapPoints = useMemo(() => ['50%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
      />
    ),
    []
  );

  const statusOptions = [
    {
      id: 'TRANSACTION_SUCCESSFUL',
      label: 'TRANSACTION SUCCESSFUL',
      value: 'สำเร็จ',
      color: 'bg-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      icon: '✅',
    },
    {
      id: 'TRANSACTION_UNSUCCESSFUL',
      label: 'TRANSACTION UNSUCCESSFUL',
      value: 'ไม่สำเร็จ',
      color: 'bg-red-100',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      icon: '❌',
    },
    {
      id: 'RECEIVER_NOT_MATCH',
      label: 'RECEIVER NOT MATCH',
      value: 'ไม่สำเร็จ',
      color: 'bg-red-100',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      icon: '👤',
    },
    {
      id: 'AMOUNT_LESS_THAN_MINIMUM',
      label: 'AMOUNT LESS THAN MINIMUM',
      value: 'ไม่สำเร็จ',
      color: 'bg-red-100',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      icon: '💰',
    },
    {
      id: 'ERROR',
      label: 'ERROR',
      value: 'ไม่สำเร็จ',
      color: 'bg-red-100',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      icon: '⚠️',
    },
  ];

  const handleStatusSelect = (status: string) => {
    onStatusSelect(status);
    onClose();
  };

  // Control bottom sheet visibility
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onDismiss={handleDismiss}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#cbd5f5',
        width: 36,
        height: 4,
        borderRadius: 999,
      }}
      style={{
        paddingHorizontal: 4,
      }}>
      <BottomSheetView className="flex-1 px-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between pt-1">
          <View>
            <Text className="text-xl font-semibold text-gray-900">ตัวกรองสถานะ</Text>
            <Text className="mt-1 text-sm text-gray-500">เลือกเพื่อกรองผลลัพธ์</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="rounded-full border border-gray-200 bg-white p-2 shadow-sm">
            <Text className="text-lg text-gray-500">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Status Options */}
        <View className="flex-1">
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleStatusSelect(option.value)}
                className={`mb-3 flex-row items-center justify-between rounded-xl border px-4 py-4 shadow-sm transition-colors ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}>
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Text className="text-base">{option.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-gray-900">{option.label}</Text>
                    <Text className="text-xs text-gray-400">{option.value}</Text>
                  </View>
                </View>
                {isSelected && <Text className="text-sm font-semibold text-blue-600">เลือกแล้ว</Text>}
              </TouchableOpacity>
            );
          })}

          {/* Clear Selection */}
          <TouchableOpacity
            onPress={() => handleStatusSelect('')}
            className="mt-4 flex-row items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Text className="text-base">🔄</Text>
              </View>
              <Text className="font-medium text-gray-700">ล้างการเลือกทั้งหมด</Text>
            </View>
            {selectedStatus === '' && <Text className="text-sm font-semibold text-blue-600">เลือกแล้ว</Text>}
          </TouchableOpacity>
        </View>
      </BottomSheetView>
      </BottomSheetModal>
  );
}
