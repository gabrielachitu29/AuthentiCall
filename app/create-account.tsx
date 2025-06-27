import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button, Input, H2, YStack, Paragraph, XStack } from 'tamagui';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/src/utils/supabase';

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSignUpPress() {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Account created!', 'Please check your email to confirm your account.');
      router.replace('/login'); // Navigate to login after successful sign-up
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Create Your AuthentiCall Account</H2>

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
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          size="$4"
          width="100%"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button size="$4" width="100%" onPress={onSignUpPress} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <XStack space="$2" alignItems="center">
          <ThemedText>Already have an account?</ThemedText>
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