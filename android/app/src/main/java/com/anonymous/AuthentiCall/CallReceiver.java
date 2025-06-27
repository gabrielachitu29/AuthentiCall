package com.anonymous.AuthentiCall;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CallReceiver extends BroadcastReceiver {
    private static final String TAG = "CallReceiver";
    private static ReactApplicationContext reactContext;

    public static void setReactContext(ReactApplicationContext context) {
        reactContext = context;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && intent.getAction().equals(TelephonyManager.ACTION_PHONE_STATE_CHANGED)) {
            String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
            String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);

            if (state != null) {
                if (state.equals(TelephonyManager.EXTRA_STATE_RINGING)) {
                    Log.d(TAG, "Incoming call from: " + incomingNumber);
                    if (reactContext != null) {
                        WritableMap params = Arguments.createMap();
                        params.putString("phoneNumber", incomingNumber);
                        sendEvent("onIncomingCall", params);
                    }
                }
            }
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } else {
            Log.w(TAG, "React context not available or not active. Cannot send event: " + eventName);
        }
    }
}