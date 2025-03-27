# Keep all React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.swmansion.** { *; }
-keep class com.airbnb.android.react.maps.** { *; }

# Keep all serialized classes
-keepclassmembers class * implements java.io.Serializable { *; }

# Keep annotated methods (if using libraries that require it)
-keep @interface com.facebook.react.bridge.ReactMethod
-keep @interface com.facebook.react.bridge.ReactModule
-keep @interface com.facebook.react.bridge.ReactPackage

# Keep Razorpay SDK classes
-keep class com.razorpay.** { *; }

# Keep all annotated members
-keep @interface proguard.annotation.KeepClassMembers
-keepclassmembers class * {
    @proguard.annotation.KeepClassMembers *;
}
