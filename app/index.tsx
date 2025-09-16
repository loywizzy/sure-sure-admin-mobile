import { useRouter } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';

export default function Index() {
  const router = useRouter();
  return (
    <HomeScreen onOpenDashboard={() => router.push('/dashboard')} />
  );
}

