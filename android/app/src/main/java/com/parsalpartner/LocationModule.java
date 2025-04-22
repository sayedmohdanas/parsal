package com.parsalpartner;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class LocationModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext staticReactContext;

    public LocationModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        staticReactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationServiceModule";
    }

    @ReactMethod
    public void startLocationService() {
        Intent serviceIntent = new Intent(getReactApplicationContext(), LocationService.class);
        getReactApplicationContext().startForegroundService(serviceIntent);
    }

    @ReactMethod
    public void stopLocationService() {
        Intent serviceIntent = new Intent(getReactApplicationContext(), LocationService.class);
        getReactApplicationContext().stopService(serviceIntent);
    }

    // ✅ Static method to send location to JS
    public static void sendLocationToJS(double latitude, double longitude, float heading) {
        if (staticReactContext != null) {
            try {
                String location = latitude + "," + longitude + ','+heading;

                staticReactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("LocationUpdated", location);

            } catch (Exception e) {
                Log.e("LocationModule", "Error sending location to JS", e);
            }
        } else {
            Log.w("LocationModule", "ReactContext is null, can't send location");
        }
    }
    // public static void sendLocationToJS(double latitude, double longitude, float heading) {
    //     if (staticReactContext != null) {
    //         try {
    //             WritableMap locationMap = Arguments.createMap();
    //             locationMap.putDouble("latitude", latitude);
    //             locationMap.putDouble("longitude", longitude);
    //             locationMap.putDouble("heading", heading);

    //             staticReactContext
    //                     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
    //                     .emit("LocationUpdated", locationMap);

    //         } catch (Exception e) {
    //             Log.e("LocationModule", "Error sending location to JS", e);
    //         }
    //     } else {
    //         Log.w("LocationModule", "ReactContext is null, can't send location");
    //     }
    // }
}
