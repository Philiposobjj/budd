
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SplashAnimation } from '../features/splash/SplashAnimation';
import { BuddProvider } from '../context/BuddContext';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const finish = useCallback(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let mounted = true;

    async function verificarSessao() {
      console.log('AUTH: verificando sessão...');

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          'AUTH: erro ao verificar sessão:',
          error,
        );

        setCheckingAuth(false);
        router.replace('/login');
        return;
      }

      if (session) {
        console.log(
          'AUTH: usuário já está logado.',
        );
      } else {
        console.log(
          'AUTH: nenhum usuário logado.',
        );

        router.replace('/login');
      }

      setCheckingAuth(false);
    }

    verificarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        console.log(
          'AUTH: alteração de sessão:',
          event,
        );

        if (!mounted) {
          return;
        }

        if (event === 'SIGNED_OUT') {
          router.replace('/login');
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [ready]);

  if (!ready || checkingAuth) {
    return (
      <SplashAnimation
        onFinish={finish}
      />
    );
  }

  return (
    <BuddProvider>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#000',
          },
          animation: 'fade',
        }}
      />
    </BuddProvider>
  );
}

