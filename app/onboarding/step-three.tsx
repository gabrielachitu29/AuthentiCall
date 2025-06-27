import React from 'react';
import { StyleSheet } from 'react-native';
import { H2, YStack, Paragraph, Button } from 'tamagui';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useRouter } from 'expo-router';

export default function StepThreeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <YStack space="$4" alignItems="center" width="80%">
        <H2 textAlign="center">Step Three: All Set!</H2>
        <Paragraph textAlign="center">
          You're all set to start protecting yourself with AuthentiCall.
        </Paragraph>
        <Button size="$4" width="100%" onPress={() => router.replace('/(tabs)')}>
          Start Using AuthentiCall
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