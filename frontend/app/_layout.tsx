import '@/global.css';

import { AppProvider } from '@/hooks/useAppContext';
import { ErrorBoundary } from './error-boundary';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </AppProvider>
    </ErrorBoundary>
  );
}
