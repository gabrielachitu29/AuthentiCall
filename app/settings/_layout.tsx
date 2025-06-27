import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="alert-sounds" options={{ title: 'Alert Sounds' }} />
    </Stack>
  );
}