# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native specific rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Optimization rules
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification

# Remove debug logs in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Remove unused code
-dontwarn java.lang.invoke.**
-dontwarn **$$Lambda$*
-dontwarn javax.**
-dontwarn org.codehaus.mojo.animal_sniffer.**

# Ensure library support
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.christopherdro.htmltopdf.** { *; }
-keep class cl.json.** { *; }
