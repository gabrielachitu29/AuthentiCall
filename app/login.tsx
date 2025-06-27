import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button, Input, H2, YStack, Paragraph, XStack } from 'tamagui';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/src/utils/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSignInPress() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace('/home'); // Navigate to the main app screen after successful login
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Login to AuthentiCall</H2>

        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          size="$4"
          width="100%"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          size="$4"
          width="100%"
          value={password}
          onChangeText={setPassword}
        />

        <Button size="$4" width="100%" onPress={onSignInPress} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Link href="/forgot-password" style={styles.link}>
          <ThemedText type="link">Forgot Password?</ThemedText>
        </Link>

        <XStack space="$2" alignItems="center">
          <ThemedText>Don't have an account?</ThemedText>
          <Link href="/create-account">
            <ThemedText type="link">Create Account</ThemedText>
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
  link: {
    marginTop: 15,
  },
});