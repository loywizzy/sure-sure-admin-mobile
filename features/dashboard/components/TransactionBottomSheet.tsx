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
      kind: 'success' as const,
    },
    {
      id: 'TRANSACTION_UNSUCCESSFUL',
      label: 'TRANSACTION UNSUCCESSFUL',
      value: 'ไม่สำเร็จ',
      kind: 'danger' as const,
    },
    {
      id: 'RECEIVER_NOT_MATCH',
      label: 'RECEIVER NOT MATCH',
      value: 'บัญชีผู้รับไม่ตรง',
      kind: 'danger' as const,
    },
    {
      id: 'AMOUNT_LESS_THAN_MINIMUM',
      label: 'AMOUNT LESS THAN MINIMUM',
      value: 'จำนวนเงินน้อยกว่าขั้นต่ำ',
      kind: 'danger' as const,
    },
    {
      id: 'ERROR',
      label: 'ERROR',
      value: 'ไม่สามารถตรวจสอบได้',
      kind: 'danger' as const,
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
        <View className="mb-6 items-center pt-1">
          <Text className="text-2xl font-extrabold text-gray-900">รายการธุรกรรม</Text>
          <Text className="mt-2 text-base text-gray-500">เลือกธุรกรรมที่ต้องการค้นหา</Text>
        </View>

        {/* Status Options (Pills) */}
        <View className="flex-1">
          {statusOptions.map((option) => {
            const isSuccess = option.kind === 'success';
            const bgClass = isSuccess ? 'bg-green-50' : 'bg-red-50';
            const borderClass = isSuccess ? 'border-green-200' : 'border-red-200';
            const textClass = isSuccess ? 'text-green-600' : 'text-red-600';
            const shadowColor = isSuccess ? '#22c55e' : '#ef4444';

            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.9}
                onPress={() => handleStatusSelect(option.value)}
                className={`mb-4 rounded-full border ${bgClass} ${borderClass} px-5 py-4 items-center`}
                style={{
                  shadowColor,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 5,
                }}>
                <Text className={`text-center text-base font-semibold uppercase tracking-wide ${textClass}`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
      </BottomSheetModal>
  );
}
