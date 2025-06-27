import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ToastProvider, ToastViewport } from '@tamagui/toast'; // Import ToastProvider and ToastViewport

import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/src/utils/supabase';
import { useAuthStore } from '@/src/store/authStore';
import { setupCallKeep, addCallEventListener, addSmsEventListener } from '@/src/utils/callkeep';
import CallAlertOverlay from '@/src/components/CallAlertOverlay';
import { schedulePushNotification, registerForPushNotificationsAsync } from '@/src/utils/notifications';
import { getCallerIdReputation } from '@/src/api/callerIdService';
import { StatusBar } from 'expo-status-bar'; // Ensure StatusBar is imported

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    callerName: '',
    phoneNumber: '',
    reputation: 'unknown' as 'safe' | 'spam' | 'scam' | 'unknown',
  });

  useEffect(() => {
    registerForPushNotificationsAsync(); // Register for push notifications
    setupCallKeep(); // Initialize CallKeep

    const callListener = addCallEventListener('onIncomingCall', async (event: { number: string; name: string }) => {
      console.log('Incoming Call Event:', event);
      const reputationData = await getCallerIdReputation(event.number);
      let reputation: 'safe' | 'spam' | 'scam' | 'unknown' = 'unknown';
      let callerName = event.name || 'Unknown';
      let reputationText = 'Unknown Reputation'; // Initialize reputationText

      if (reputationData) {
        callerName = reputationData.name || callerName;
        if (reputationData.isSpam) {
          reputation = 'spam';
        } else if (reputationData.type === 'scam') {
          reputation = 'scam';
        } else {
          reputation = 'safe';
        }
      }

      // Determine reputationText based on the final reputation
      switch (reputation) {
        case 'safe':
          reputationText = 'Safe Caller';
          break;
        case 'spam':
          reputationText = 'Potential Spam';
          break;
        case 'scam':
          reputationText = 'Likely Scam';
          break;
        case 'unknown':
        default:
          reputationText = 'Unknown Reputation';
          break;
      }

      setCallerInfo({
        callerName: callerName,
        phoneNumber: event.number,
        reputation: reputation,
      });
      setShowCallOverlay(true);

      // Schedule a push notification for spam/scam calls
      if (reputation === 'spam' || reputation === 'scam') {
        await schedulePushNotification(
          'Potential Threat Detected!',
          `Incoming call from ${callerName || event.number} identified as ${reputationText}.`,
          { type: 'call', phoneNumber: event.number, reputation: reputation },
          'malicious' // Use malicious sound for spam/scam
        );
      }
    });

    const smsListener = addSmsEventListener('onSMSReceived', async (event: { sender: string; message: string }) => {
      console.log('Incoming SMS Event:', event);
      // In a real scenario, you'd analyze SMS content for phishing/malicious patterns
      // For now, simulate detection based on keywords
      const isMalicious = event.message.toLowerCase().includes('phishing') || event.message.toLowerCase().includes('malicious');

      if (isMalicious) {
        await schedulePushNotification(
          'Malicious SMS Detected!',
          `From: ${event.sender}\nContent: ${event.message}`,
          { type: 'sms', sender: event.sender, message: event.message },
          'malicious' // Use malicious sound
        );
      } else {
        console.log('SMS is safe, no notification needed.');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          // User is logged in, navigate to home
          router.replace('/(tabs)');
        } else {
          // For new users, direct to onboarding. For existing users, direct to login.
          // This logic can be refined with a flag in user preferences/local storage.
          router.replace('/onboarding/WelcomeScreen');
        }
        SplashScreen.hideAsync();
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/WelcomeScreen');
      }
      SplashScreen.hideAsync();
    });

    return () => {
      authListener.subscription.unsubscribe();
      if (callListener) callListener.remove();
      if (smsListener) smsListener.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ToastProvider swipeDirection="horizontal" duration={6000}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="onboarding/WelcomeScreen" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step-one-call-management" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step-two-microphone" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/step-three-notifications" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="create-account" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="reset-password" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="analysis-report" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        {showCallOverlay && (
          <CallAlertOverlay
            callerName={callerInfo.callerName}
            phoneNumber={callerInfo.phoneNumber}
            reputation={callerInfo.reputation}
            onDismiss={() => setShowCallOverlay(false)}
            onBlock={() => {
              console.log(`Blocking number: ${callerInfo.phoneNumber}`);
              // TODO: Implement actual blocking logic (US-10)
              setShowCallOverlay(false);
            }}
          />
        )}
        <StatusBar style="auto" />
      </ThemeProvider>
      <ToastViewport />
    </ToastProvider>
  );
}
