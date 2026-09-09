package com.saahay.ai;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView webView;
    private FirebaseAuth auth;
    private SharedPreferences prefs;
    private static final int LOCATION_PERMISSION_REQUEST = 9301;
    private static final int AUDIO_PERMISSION_REQUEST = 9302;
    private static final int SPEECH_REQUEST = 9303;
    private boolean locationSharePending = false;
    private boolean voicePending = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        auth = FirebaseAuth.getInstance();
        prefs = getSharedPreferences("saahay_prefs", MODE_PRIVATE);
        webView = new WebView(this);
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);
        webView.setClickable(true);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setTextZoom(100);
        webView.addJavascriptInterface(new AuthBridge(), "SAHAAYAuth");
        webView.addJavascriptInterface(new DeviceBridge(), "SAHAAYDevice");
        webView.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                FirebaseUser user = auth.getCurrentUser();
                if (user != null) sendSuccess(user.getEmail());
            }
        });
        webView.loadUrl("file:///android_asset/index.html");
    }

    private String jsString(String value) {
        return JSONObject.quote(value == null ? "" : value);
    }

    private String onboardingKey(String email) {
        return "onboarding_complete_" + (email == null ? "" : email.trim().toLowerCase());
    }

    private void sendSuccess(String email) {
        runOnUiThread(() -> webView.evaluateJavascript("window.saahayAuthSuccess(" + jsString(email) + ");", null));
    }

    private void sendError(Exception e) {
        String message = e == null || e.getLocalizedMessage() == null ? "Something went wrong. Please try again." : e.getLocalizedMessage();
        runOnUiThread(() -> webView.evaluateJavascript("window.saahayAuthError(" + jsString(message) + ");", null));
    }

    private void sendLocationError(String message) {
        runOnUiThread(() -> webView.evaluateJavascript("window.saahayLocationError && window.saahayLocationError(" + jsString(message) + ");", null));
    }

    private void shareLastKnownLocation() {
        try {
            if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                sendLocationError("Location permission is required only when you choose to share your location.");
                return;
            }
            LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
            Location best = null;
            if (lm != null) {
                try {
                    Location network = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    Location gps = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    if (network != null) best = network;
                    if (gps != null && (best == null || gps.getTime() > best.getTime())) best = gps;
                } catch (SecurityException ignored) {}
            }
            if (best == null) {
                sendLocationError("Current location is not available yet. Turn on Location and try again.");
                return;
            }
            String maps = "https://maps.google.com/?q=" + best.getLatitude() + "," + best.getLongitude();
            Intent share = new Intent(Intent.ACTION_SEND);
            share.setType("text/plain");
            share.putExtra(Intent.EXTRA_TEXT, "My current location: " + maps);
            startActivity(Intent.createChooser(share, "Share current location"));
            webView.evaluateJavascript("window.saahayLocationShared && window.saahayLocationShared();", null);
        } catch (Exception e) {
            sendLocationError("Location could not be shared. Please try again.");
        }
    }

    private void startVoiceRecognizer() {
        try {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak your reflection");
            startActivityForResult(intent, SPEECH_REQUEST);
        } catch (Exception e) {
            webView.evaluateJavascript("window.saahayVoiceError && window.saahayVoiceError();", null);
        }
    }

    public class AuthBridge {
        @JavascriptInterface public void signUp(String email, String password) {
            runOnUiThread(() -> auth.createUserWithEmailAndPassword(email.trim(), password)
                    .addOnSuccessListener(result -> sendSuccess(result.getUser() == null ? email : result.getUser().getEmail()))
                    .addOnFailureListener(MainActivity.this::sendError));
        }

        @JavascriptInterface public void logIn(String email, String password) {
            runOnUiThread(() -> auth.signInWithEmailAndPassword(email.trim(), password)
                    .addOnSuccessListener(result -> sendSuccess(result.getUser() == null ? email : result.getUser().getEmail()))
                    .addOnFailureListener(MainActivity.this::sendError));
        }

        @JavascriptInterface public void resetPassword(String email) {
            runOnUiThread(() -> auth.sendPasswordResetEmail(email.trim())
                    .addOnSuccessListener(v -> webView.evaluateJavascript("window.saahayResetSent();", null))
                    .addOnFailureListener(MainActivity.this::sendError));
        }

        @JavascriptInterface public boolean isOnboardingComplete(String email) {
            return prefs.getBoolean(onboardingKey(email), false);
        }

        @JavascriptInterface public void setOnboardingComplete(String email) {
            prefs.edit().putBoolean(onboardingKey(email), true).apply();
        }

        @JavascriptInterface public void logOut() {
            runOnUiThread(() -> { auth.signOut(); webView.evaluateJavascript("window.saahayLoggedOut();", null); });
        }
    }

    public class DeviceBridge {
        @JavascriptInterface public void requestAndShareLocation() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    locationSharePending = true;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION_PERMISSION_REQUEST);
                } else shareLastKnownLocation();
            });
        }

        @JavascriptInterface public void startVoiceInput() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    voicePending = true;
                    requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, AUDIO_PERMISSION_REQUEST);
                } else startVoiceRecognizer();
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST) {
            boolean granted = false;
            for (int r : grantResults) if (r == PackageManager.PERMISSION_GRANTED) { granted = true; break; }
            if (locationSharePending && granted) shareLastKnownLocation();
            else if (locationSharePending) sendLocationError("Location permission was not granted.");
            locationSharePending = false;
        } else if (requestCode == AUDIO_PERMISSION_REQUEST) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (voicePending && granted) startVoiceRecognizer();
            else if (voicePending) webView.evaluateJavascript("window.saahayVoiceError && window.saahayVoiceError();", null);
            voicePending = false;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == SPEECH_REQUEST) {
            if (resultCode == RESULT_OK && data != null) {
                ArrayList<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                String text = (results != null && !results.isEmpty()) ? results.get(0) : "";
                webView.evaluateJavascript("window.saahayVoiceResult && window.saahayVoiceResult(" + jsString(text) + ");", null);
            } else {
                webView.evaluateJavascript("window.saahayVoiceError && window.saahayVoiceError();", null);
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
