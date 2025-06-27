package com.anonymous.AuthentiCall;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.content.IntentFilter;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;

public class SmsDetectionModule extends ReactContextBaseJavaModule {
    private static final String TAG = "SmsDetectionModule";
    private SmsReceiver smsReceiver;

    SmsDetectionModule(ReactApplicationContext context) {
        super(context);
        smsReceiver = new SmsReceiver();
        SmsReceiver.setReactContext(context); // Set the React context in SmsReceiver
    }

    @NonNull
    @Override
    public String getName() {
        return "SmsDetectionModule";
    }

    @ReactMethod
    public void startSmsDetection() {
        Log.d(TAG, "Starting SMS detection");
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.provider.Telephony.SMS_RECEIVED");
        getReactApplicationContext().registerReceiver(smsReceiver, filter);
    }

    @ReactMethod
    public void stopSmsDetection() {
        Log.d(TAG, "Stopping SMS detection");
        try {
            getReactApplicationContext().unregisterReceiver(smsReceiver);
        } catch (IllegalArgumentException e) {
            Log.e(TAG, "Receiver not registered: " + e.getMessage());
        }
    }

    // Method to send events to JavaScript (though SmsReceiver sends directly)
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}