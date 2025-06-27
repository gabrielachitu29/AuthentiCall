import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { TimeIntervalTriggerInput } from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Added missing property
    shouldShowList: true,   // Added missing property
  }),
});

export async function schedulePushNotification(title: string, body: string, data: any = {}, sound: 'default' | 'malicious' = 'default') {
  let notificationSound: string | null | undefined = 'default';

  if (Platform.OS === 'android') {
    if (sound === 'malicious') {
      // Ensure the channel exists for the custom sound
      await Notifications.setNotificationChannelAsync('malicious-alerts', {
        name: 'Malicious Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#FF0000',
        sound: 'malicious_alert.wav', // Assuming this file exists in android/app/src/main/res/raw/
      });
      notificationSound = 'malicious_alert.wav';
    } else {
      // Ensure the default channel exists
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
      notificationSound = 'default';
    }
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: notificationSound,
    },
    trigger: null, // Temporarily setting trigger to null due to persistent TypeScript type issues with time-based triggers.
    // TODO: Investigate correct type for time-based triggers in Expo Notifications.
  });
}

export async function registerForPushNotificationsAsync() {
  let token;

  // The default channel is now handled within schedulePushNotification
  // if (Platform.OS === 'android') {
  //   Notifications.setNotificationChannelAsync('default', {
  //     name: 'default',
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
  // }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  return token;
}