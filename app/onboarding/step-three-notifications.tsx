import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { H2, YStack, Paragraph, Button } from 'tamagui';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function StepTwoScreen() {
  const router = useRouter();

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('Permission Granted', 'Notification access granted.');
      router.push('/');
    } else {
      Alert.alert('Permission Denied', 'Notification access is recommended for timely alerts. You can grant it later in settings.');
      router.push('/'); // Navigate to main app if permission denied/skipped
    }
  };

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Step Two: Notifications</H2>
        <Paragraph textAlign="center">
          Allow AuthentiCall to send you alerts when a threat is detected.
        </Paragraph>
        <Button size="$4" width="100%" onPress={requestNotificationPermission}>
          Enable Notifications
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