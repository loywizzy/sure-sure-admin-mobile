import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      dashboard: 'แดชบอร์ด',
      transactions: 'ธุรกรรม',
      branches: 'สาขาร้านค้า',
      packages: 'แพ็คเกจ',
      search: 'ค้นหา',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
      success: 'สำเร็จ',
      error: 'ผิดพลาด',
    },
  },
  en: {
    translation: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      branches: 'Branches',
      packages: 'Packages',
      search: 'Search',
      cancel: 'Cancel',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'th',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;


