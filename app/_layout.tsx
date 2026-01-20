import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
