import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = 'settings:notifications_enabled';
const ALERT_SOUND_KEY = 'settings:alert_sound';

export const saveNotificationPreference = async (isEnabled: boolean) => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(isEnabled));
  } catch (e) {
    console.error('Failed to save notification preference.', e);
  }
};

export const loadNotificationPreference = async (): Promise<boolean> => {
  try {
    const item = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return item !== null ? JSON.parse(item) : true; // Default to true
  } catch (e) {
    console.error('Failed to load notification preference.', e);
    return true; // Default to true on error
  }
};

export const saveAlertSound = async (sound: string) => {
  try {
    await AsyncStorage.setItem(ALERT_SOUND_KEY, sound);
  } catch (e) {
    console.error('Failed to save alert sound.', e);
  }
};

export const loadAlertSound = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ALERT_SOUND_KEY);
  } catch (e) {
    console.error('Failed to load alert sound.', e);
    return null;
  }
};