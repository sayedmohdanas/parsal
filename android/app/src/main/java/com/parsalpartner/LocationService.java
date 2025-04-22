

package com.parsalpartner;

import android.app.Service;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import android.util.Log;
import android.net.Uri;
public class LocationService extends Service {

    public static final String CHANNEL_ID = "LocationChannel";
    private LocationManager locationManager;
    private PowerManager.WakeLock wakeLock;

    private final LocationListener locationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            double lat = location.getLatitude();
            double lon = location.getLongitude();
            float heading = location.getBearing();

            Log.d("LocationService", "Updated Location - Lat: " + lat + ", Lon: " + lon + ", Heading: " + heading);
            LocationModule.sendLocationToJS(lat, lon, heading);
        }
    };

  
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();

        // Create a high-priority notification (required for foreground service)
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Location Tracking")
                .setContentText("Tracking location in background")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_HIGH) // Changed to HIGH
                .setCategory(Notification.CATEGORY_SERVICE)
                .setOngoing(true)
                .build();

        startForeground(1, notification);

        // Acquire wake lock
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "ParsalPartner::LocationWakelockTag");
            wakeLock.acquire();
        }

        // Check battery optimization
        checkBatteryOptimization();

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);

        try {
            // Try to get last known location from all providers
            for (String provider : locationManager.getAllProviders()) {
                Location lastKnown = locationManager.getLastKnownLocation(provider);
                if (lastKnown != null) {
                    LocationModule.sendLocationToJS(
                        lastKnown.getLatitude(),
                        lastKnown.getLongitude(),
                        lastKnown.getBearing());
                    break;
                }
            }

            // Request updates from multiple providers
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                locationManager.requestLocationUpdates(
                    LocationManager.FUSED_PROVIDER,
                    3000,
                    0,
                    locationListener);
            } else {
                locationManager.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    3000,
                    0,
                    locationListener);
                locationManager.requestLocationUpdates(
                    LocationManager.NETWORK_PROVIDER,
                    3000,
                    0,
                    locationListener);
            }

        } catch (SecurityException e) {
            Log.e("LocationService", "Permission denied for location updates");
        }

        return START_STICKY;
    }

    private void checkBatteryOptimization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName())) {
                // You should prompt user to disable battery optimization for your app
                Intent intent = new Intent(
                    android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try {
                    startActivity(intent);
                } catch (Exception e) {
                    Log.e("LocationService", "Failed to show battery optimization settings");
                }
            }
        }
    }
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Location Tracking Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (locationManager != null) {
            locationManager.removeUpdates(locationListener);
        }
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
