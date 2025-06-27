import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  loadNotificationPreference,
  saveNotificationPreference,
} from '../../src/utils/settings';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Button, Switch, View } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const enabled = await loadNotificationPreference();
      setNotificationsEnabled(enabled);
    };
    loadSettings();
  }, []);

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    saveNotificationPreference(value);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      <Link href={'/settings/alert-sounds' as any} asChild>
        <Button title="Alert Sounds" />
      </Link>
      <View style={styles.settingRow}>
        <ThemedText>Enable Notifications</ThemedText>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationToggle}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});