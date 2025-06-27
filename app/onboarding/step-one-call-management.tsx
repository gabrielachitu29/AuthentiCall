import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { H2, YStack, Paragraph, Button } from 'tamagui';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useRouter } from 'expo-router';

export default function StepOneCallManagementScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // In a real application, you would check for or request call management permissions here.
    // For this prototype, we'll just navigate to the next step.
    Alert.alert(
      'Call Management Permission',
      'AuthentiCall requires Call Management permission to intercept and analyze calls. This will be requested via a native module later.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/onboarding/step-two-microphone'),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Step One: Call Management</H2>
        <Paragraph textAlign="center">
          AuthentiCall needs permission to manage and intercept calls for real-time analysis. This is crucial for detecting spam and fraud.
        </Paragraph>
        <Button size="$4" width="100%" onPress={handleContinue}>
          Understand & Continue
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