plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.evstreams.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.evstreams.app"
        minSdk = 21
        targetSdk = 34
        versionCode = 2
        versionName = "2.0"
        // libVLC ships big native libs; keep the APK sane
        ndk { abiFilters += listOf("arm64-v8a", "armeabi-v7a") }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    lint {
        abortOnError = false
        checkReleaseBuilds = false
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    // Allow unsigned debuggable release build so the workflow can produce
    // an installable APK without needing a signing keystore secret.
    buildTypes.getByName("release") {
        isDebuggable = true
        signingConfig = signingConfigs.getByName("debug")
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.webkit:webkit:1.11.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")

    // Native HTTP client used to proxy stream/embed/API requests around the
    // WebView's CORS/CSP/X-Frame-Options enforcement — OkHttp has no origin
    // policy at all, same as VLC, so anything it fetches comes back clean.
    implementation("com.squareup.okhttp3:okhttp:4.12.0")

    // Native VLC engine (libVLC) — HLS/DASH/RTSP/UDP/SRT/MKV/TS/… without DRM
    implementation("org.videolan.android:libvlc-all:3.6.0")

    // Media3 engine — licensed DRM (Widevine/PlayReady/ClearKey) + header-authenticated streams
    val media3 = "1.4.1"
    implementation("androidx.media3:media3-exoplayer:$media3")
    implementation("androidx.media3:media3-exoplayer-dash:$media3")
    implementation("androidx.media3:media3-exoplayer-hls:$media3")
    implementation("androidx.media3:media3-exoplayer-smoothstreaming:$media3")
    implementation("androidx.media3:media3-ui:$media3")
    implementation("androidx.media3:media3-datasource:$media3")
}
