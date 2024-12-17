import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ThirdwebProvider } from "thirdweb/react";
import { optimism } from "thirdweb/chains";
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const THIRDWEB_CLIENT_ID = "26e654d5187f29b971bd69e6ff677afa";

export function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  return (
    <ErrorBoundary>
      <ThirdwebProvider 
      >
        <RouterProvider 
          router={router} 
          fallbackElement={<LoadingScreen />} 
        />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </ThirdwebProvider>
    </ErrorBoundary>
  );
}
