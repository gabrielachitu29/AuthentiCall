import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button, Input, H2, YStack, Paragraph, XStack } from 'tamagui';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/src/utils/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSendResetLinkPress() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'authenticall://reset-password', // This should match your deep link setup
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Password Reset Link Sent', 'Please check your email for the reset link.');
      router.replace('/login'); // Navigate back to login after sending link
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Forgot Your Password?</H2>
        <Paragraph textAlign="center">
          Enter your email address below and we'll send you a link to reset your password.
        </Paragraph>

        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          size="$4"
          width="100%"
          value={email}
          onChangeText={setEmail}
        />

        <Button size="$4" width="100%" onPress={onSendResetLinkPress} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <XStack space="$2" alignItems="center">
          <ThemedText>Remembered your password?</ThemedText>
          <Link href="/login">
            <ThemedText type="link">Login</ThemedText>
          </Link>
        </XStack>
      </YStack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});