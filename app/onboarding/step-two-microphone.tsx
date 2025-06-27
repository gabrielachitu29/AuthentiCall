import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { H2, YStack, Paragraph, Button } from 'tamagui';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

export default function StepOneScreen() {
  const router = useRouter();

  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('Permission Granted', 'Microphone access granted.');
      router.push('/onboarding/step-three-notifications');
    } else {
      Alert.alert('Permission Denied', 'Microphone access is required for real-time analysis. You can grant it later in settings.');
      router.push('/'); // Navigate to main app if permission denied/skipped
    }
  };

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Step One: Microphone Access</H2>
        <Paragraph textAlign="center">
          AuthentiCall needs microphone access to analyze call audio in real-time.
        </Paragraph>
        <Button size="$4" width="100%" onPress={requestMicrophonePermission}>
          Grant Microphone Access
        </Button>
        <Button size="$4" width="100%" variant="outlined" onPress={() => router.push('/')}>
          Skip for now
        </Button>
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