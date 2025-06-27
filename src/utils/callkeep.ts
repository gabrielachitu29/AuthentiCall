import { Platform, NativeModules, NativeEventEmitter } from 'react-native';
import RNCallKeep from 'react-native-callkeep';

const { CallDetectionModule, SmsDetectionModule } = NativeModules;

const callKeepOptions = {
  ios: {
    appName: 'AuthentiCall',
    imageName: 'AppIcon',
    supportsVideo: false,
    maximumCallGroups: '1',
    maximumCallsPerCallGroup: '1',
    ringtoneSound: '_Bundle_',
  },
  android: {
    alertTitle: 'Permissions Required',
    alertDescription: 'This application needs to access your phone accounts to make calls.',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'AppIcon',
    additionalPermissions: [], // Required for Android
    selfManaged: false,
  },
};

// Call Detection Module
export const setupCallKeep = async () => {
  if (Platform.OS === 'android') {
    try {
      await RNCallKeep.setup(callKeepOptions);
      RNCallKeep.setAvailable(true);
      console.log('RNCallKeep setup successful');
    } catch (err) {
      console.error('RNCallKeep setup failed', err);
    }
  }
};

export const startCallDetection = () => {
  if (Platform.OS === 'android' && CallDetectionModule) {
    CallDetectionModule.startCallDetection();
  }
};

export const stopCallDetection = () => {
  if (Platform.OS === 'android' && CallDetectionModule) {
    CallDetectionModule.stopCallDetection();
  }
};

export const addCallEventListener = (event: string, handler: (...args: any[]) => any) => {
  if (Platform.OS === 'android') {
    const eventEmitter = new NativeEventEmitter(CallDetectionModule);
    return eventEmitter.addListener(event, handler);
  }
  return null;
};

// SMS Detection Module
export const startSmsDetection = () => {
  if (Platform.OS === 'android' && SmsDetectionModule) {
    SmsDetectionModule.startSmsDetection();
  }
};

export const stopSmsDetection = () => {
  if (Platform.OS === 'android' && SmsDetectionModule) {
    SmsDetectionModule.stopSmsDetection();
  }
};

export const addSmsEventListener = (event: string, handler: (...args: any[]) => any) => {
  if (Platform.OS === 'android') {
    const eventEmitter = new NativeEventEmitter(SmsDetectionModule);
    return eventEmitter.addListener(event, handler);
  }
  return null;
};

// Existing RNCallKeep functions (if still needed, otherwise remove)
export const startCall = (uuid: string, handle: string, localizedCallerName: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.startCall(uuid, handle, localizedCallerName, 'generic', false);
  }
};

export const endCall = (uuid: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.endCall(uuid);
  }
};

export const answerCall = (uuid: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.answerIncomingCall(uuid);
  }
};

export const rejectCall = (uuid: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.rejectCall(uuid);
  }
};

export const setOnHold = (uuid: string, held: boolean) => {
  if (Platform.OS === 'android') {
    RNCallKeep.setOnHold(uuid, held);
  }
};

export const toggleMute = (uuid: string, muted: boolean) => {
  if (Platform.OS === 'android') {
    RNCallKeep.setMutedCall(uuid, muted);
  }
};

export const sendDTMF = (uuid: string, key: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.sendDTMF(uuid, key);
  }
};

export const setConnectionState = (uuid: string, state: number) => {
  if (Platform.OS === 'android') {
    RNCallKeep.setConnectionState(uuid, state);
  }
};

export const displayIncomingCall = (uuid: string, handle: string, localizedCallerName: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.displayIncomingCall(uuid, handle, localizedCallerName, 'generic', false);
  }
};

export const updateCallDisplay = (uuid: string, displayName: string, handle: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.updateDisplay(uuid, displayName, handle);
  }
};

export const endAllCalls = () => {
  if (Platform.OS === 'android') {
    RNCallKeep.endAllCalls();
  }
};

export const getCalls = async () => {
  if (Platform.OS === 'android') {
    return await RNCallKeep.getCalls();
  }
  return [];
};

export const getAudioRoutes = async () => {
  if (Platform.OS === 'android') {
    return await RNCallKeep.getAudioRoutes();
  }
  return [];
};

export const setAudioRoute = async (uuid: string, inputName: string) => {
  if (Platform.OS === 'android') {
    await RNCallKeep.setAudioRoute(uuid, inputName);
  }
};

export const toggleAudioRouteSpeaker = (uuid: string, routeSpeaker: boolean) => {
  if (Platform.OS === 'android') {
    RNCallKeep.toggleAudioRouteSpeaker(uuid, routeSpeaker);
  }
};

export const setCurrentCallActive = (uuid: string) => {
  if (Platform.OS === 'android') {
    RNCallKeep.setCurrentCallActive(uuid);
  }
};

export const reportEndCallWithUUID = (uuid: string, reason: number) => {
  if (Platform.OS === 'android') {
    RNCallKeep.reportEndCallWithUUID(uuid, reason);
  }
};