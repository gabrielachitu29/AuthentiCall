import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button, Input, H2, YStack, Paragraph, XStack } from 'tamagui';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/src/utils/supabase';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onResetPasswordPress() {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Password Reset', 'Your password has been successfully updated. Please log in with your new password.');
      router.replace('/login'); // Navigate to login after successful password reset
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Set New Password</H2>
        <Paragraph textAlign="center">
          Enter your new password below.
        </Paragraph>

        <Input
          placeholder="New Password"
          secureTextEntry
          size="$4"
          width="100%"
          value={password}
          onChangeText={setPassword}
        />
        <Input
          placeholder="Confirm New Password"
          secureTextEntry
          size="$4"
          width="100%"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button size="$4" width="100%" onPress={onResetPasswordPress} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
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