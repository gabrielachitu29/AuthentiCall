import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { H2, YStack, Paragraph, Button } from 'tamagui';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Link, useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <Image
          source={require('../../../assets/images/icon.png')}
          style={styles.logo}
        />
        <H2 textAlign="center">Welcome to AuthentiCall!</H2>
        <Paragraph textAlign="center">
          Protect yourself from AI voice scams with real-time detection.
        </Paragraph>
        <Button size="$4" width="100%" onPress={() => router.push('/onboarding/step-one-call-management')}>
          Get Started
        </Button>
        <Link href="/login">
          <ThemedText type="link">Already have an account? Login</ThemedText>
        </Link>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});