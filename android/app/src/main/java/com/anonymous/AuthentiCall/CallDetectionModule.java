package com.anonymous.AuthentiCall;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.content.IntentFilter;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;

public class CallDetectionModule extends ReactContextBaseJavaModule {
    private static final String TAG = "CallDetectionModule";
    private CallReceiver callReceiver;

    CallDetectionModule(ReactApplicationContext context) {
        super(context);
        callReceiver = new CallReceiver();
        CallReceiver.setReactContext(context); // Set the React context in CallReceiver
    }

    @NonNull
    @Override
    public String getName() {
        return "CallDetectionModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("CALL_STATE_RINGING", TelephonyManager.EXTRA_STATE_RINGING);
        constants.put("CALL_STATE_OFFHOOK", TelephonyManager.EXTRA_STATE_OFFHOOK);
        constants.put("CALL_STATE_IDLE", TelephonyManager.EXTRA_STATE_IDLE);
        return constants;
    }

    @ReactMethod
    public void startCallDetection() {
        Log.d(TAG, "Starting call detection");
        IntentFilter filter = new IntentFilter();
        filter.addAction(TelephonyManager.ACTION_PHONE_STATE_CHANGED);
        getReactApplicationContext().registerReceiver(callReceiver, filter);
    }

    @ReactMethod
    public void stopCallDetection() {
        Log.d(TAG, "Stopping call detection");
        try {
            getReactApplicationContext().unregisterReceiver(callReceiver);
        } catch (IllegalArgumentException e) {
            Log.e(TAG, "Receiver not registered: " + e.getMessage());
        }
    }

    // Method to send events to JavaScript
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}