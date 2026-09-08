package com.asha.demo;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.health.connect.HealthConnectException;
import android.health.connect.HealthConnectManager;
import android.health.connect.HealthPermissions;
import android.health.connect.ReadRecordsRequestUsingFilters;
import android.health.connect.ReadRecordsResponse;
import android.health.connect.TimeInstantRangeFilter;
import android.health.connect.datatypes.SleepSessionRecord;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.OutcomeReceiver;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.RecognizerIntent;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private WebView webView;
    private static final int VOICE_REQUEST = 7001;
    private static final int MIC_PERMISSION_REQUEST = 7002;
    private static final int HEALTH_SLEEP_PERMISSION_REQUEST = 7003;
    private boolean voicePending = false;
    private boolean sleepPermissionScreenOpen = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        webView = new WebView(this);
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);
        webView.setClickable(true);
        webView.requestFocusFromTouch();
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setTextZoom(100);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if (request.isForMainFrame() && ("http".equals(scheme) || "https".equals(scheme))) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (Exception ignored) {}
                    return true;
                }
                if (request.isForMainFrame() && "tel".equals(scheme)) {
                    try { startActivity(new Intent(Intent.ACTION_DIAL, uri)); }
                    catch (Exception ignored) {}
                    return true;
                }
                return false;
            }
        });

        webView.addJavascriptInterface(new NativeBridge(), "AndroidBridge");
        webView.loadUrl("file:///android_asset/index.html");
    }

    private void launchVoiceRecognition() {
        try {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-IN");
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "How are you feeling?");
            startActivityForResult(intent, VOICE_REQUEST);
        } catch (Exception e) {
            Toast.makeText(this, "Voice recognition is unavailable. You can type instead.", Toast.LENGTH_LONG).show();
        }
    }

    private void sendSleepToWeb(String status, double hours, String message) {
        runOnUiThread(() -> {
            String safeStatus = org.json.JSONObject.quote(status);
            String safeMessage = org.json.JSONObject.quote(message == null ? "" : message);
            String js = "window.setNativeSleepData && window.setNativeSleepData(" + safeStatus + "," + hours + "," + safeMessage + ");";
            webView.evaluateJavascript(js, null);
        });
    }

    private void openSleepPermissionManager() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            sendSleepToWeb("unsupported", 0, "Real sleep reading is available on Android 14+ in this build.");
            return;
        }
        try {
            Intent i = new Intent(HealthConnectManager.ACTION_MANAGE_HEALTH_PERMISSIONS);
            i.putExtra(Intent.EXTRA_PACKAGE_NAME, getPackageName());
            sleepPermissionScreenOpen = true;
            startActivityForResult(i, HEALTH_SLEEP_PERMISSION_REQUEST);
        } catch (Exception first) {
            try {
                Intent i = new Intent(HealthConnectManager.ACTION_MANAGE_HEALTH_PERMISSIONS);
                sleepPermissionScreenOpen = true;
                startActivityForResult(i, HEALTH_SLEEP_PERMISSION_REQUEST);
            } catch (Exception second) {
                sleepPermissionScreenOpen = false;
                sendSleepToWeb("error", 0, "Health Connect permission settings could not be opened on this device.");
            }
        }
    }

    private void refreshSleepDataInternal(boolean mayRequestPermission) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            sendSleepToWeb("unsupported", 0, "Real sleep reading is available on Android 14+ in this build.");
            return;
        }
        if (checkSelfPermission(HealthPermissions.READ_SLEEP) != PackageManager.PERMISSION_GRANTED) {
            if (mayRequestPermission) openSleepPermissionManager();
            else sendSleepToWeb("permission_required", 0, "Connect Sleep in Health Connect to read your real sleep data.");
            return;
        }
        readLatestSleepFromHealthConnect();
    }

    private void readLatestSleepFromHealthConnect() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return;
        try {
            HealthConnectManager manager = getSystemService(HealthConnectManager.class);
            if (manager == null) {
                sendSleepToWeb("unsupported", 0, "Health Connect is not available on this device.");
                return;
            }
            Instant end = Instant.now();
            Instant start = end.minus(7, ChronoUnit.DAYS);
            TimeInstantRangeFilter timeRange = new TimeInstantRangeFilter.Builder().setStartTime(start).setEndTime(end).build();
            ReadRecordsRequestUsingFilters<SleepSessionRecord> request = new ReadRecordsRequestUsingFilters.Builder<>(SleepSessionRecord.class).setTimeRangeFilter(timeRange).setAscending(false).setPageSize(20).build();
            manager.readRecords(request, getMainExecutor(), new OutcomeReceiver<ReadRecordsResponse<SleepSessionRecord>, HealthConnectException>() {
                @Override public void onResult(ReadRecordsResponse<SleepSessionRecord> response) {
                    List<SleepSessionRecord> records = response.getRecords();
                    if (records == null || records.isEmpty()) { sendSleepToWeb("no_data", 0, "Sleep access is connected, but Health Connect has no recent sleep record yet."); return; }
                    SleepSessionRecord latest = records.get(0); long sleepMinutes = 0;
                    List<SleepSessionRecord.Stage> stages = latest.getStages();
                    if (stages != null && !stages.isEmpty()) {
                        for (SleepSessionRecord.Stage stage : stages) {
                            int type = stage.getType();
                            if (type == SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING || type == SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING_LIGHT || type == SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING_DEEP || type == SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING_REM) sleepMinutes += Duration.between(stage.getStartTime(), stage.getEndTime()).toMinutes();
                        }
                    }
                    if (sleepMinutes <= 0) sleepMinutes = Duration.between(latest.getStartTime(), latest.getEndTime()).toMinutes();
                    sendSleepToWeb("ok", Math.max(0, sleepMinutes) / 60.0, "Latest sleep session read from Health Connect.");
                }
                @Override public void onError(HealthConnectException error) { sendSleepToWeb("error", 0, "Health Connect could not read sleep data. Check Sleep access and try again."); }
            });
        } catch (SecurityException e) { sendSleepToWeb("permission_required", 0, "Sleep access is required to read Health Connect data."); }
        catch (Exception e) { sendSleepToWeb("error", 0, "Health Connect sleep data could not be loaded."); }
    }

    public class NativeBridge {
        @JavascriptInterface public void hapticSOS() { runOnUiThread(() -> { Vibrator v = (Vibrator) getSystemService(VIBRATOR_SERVICE); if (v != null && v.hasVibrator()) { if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(new long[]{0,140,80,140}, -1)); else v.vibrate(new long[]{0,140,80,140}, -1); } }); }
        @JavascriptInterface public void openEmergencyDialer() { runOnUiThread(() -> { try { startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:112"))); } catch (Exception e) { Toast.makeText(MainActivity.this, "Emergency dialer unavailable", Toast.LENGTH_SHORT).show(); } }); }
        @JavascriptInterface public void openDialer(String number) { runOnUiThread(() -> { try { String safe = number == null ? "" : number.replaceAll("[^0-9+]", ""); startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + safe))); } catch (Exception e) { Toast.makeText(MainActivity.this, "Phone dialer unavailable", Toast.LENGTH_SHORT).show(); } }); }
        @JavascriptInterface public void shareSupportMessage() { runOnUiThread(() -> { Intent i = new Intent(Intent.ACTION_SEND); i.setType("text/plain"); i.putExtra(Intent.EXTRA_TEXT, "I would like someone I trust to check in with me. — SAHAAY AI"); startActivity(Intent.createChooser(i, "Contact someone you trust")); }); }
        @JavascriptInterface public void startVoiceRecognition() { runOnUiThread(() -> { if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) { voicePending = true; requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_PERMISSION_REQUEST); } else launchVoiceRecognition(); }); }
        @JavascriptInterface public void requestSleepAccess() { runOnUiThread(() -> refreshSleepDataInternal(true)); }
        @JavascriptInterface public void refreshSleepData() { runOnUiThread(() -> refreshSleepDataInternal(false)); }
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MIC_PERMISSION_REQUEST) { if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) { if (voicePending) launchVoiceRecognition(); } else Toast.makeText(this, "Microphone permission is needed only for voice check-ins. You can still type.", Toast.LENGTH_LONG).show(); voicePending = false; }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == VOICE_REQUEST && resultCode == RESULT_OK && data != null) { ArrayList<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS); if (results != null && !results.isEmpty()) { String safe = org.json.JSONObject.quote(results.get(0)); webView.evaluateJavascript("window.setNativeVoiceText && window.setNativeVoiceText(" + safe + ");", null); } }
        else if (requestCode == HEALTH_SLEEP_PERMISSION_REQUEST) { sleepPermissionScreenOpen = false; refreshSleepDataInternal(false); }
    }

    @Override protected void onResume() { super.onResume(); if (webView != null) { webView.setFocusableInTouchMode(true); webView.requestFocus(); } if (sleepPermissionScreenOpen && webView != null) { sleepPermissionScreenOpen = false; webView.postDelayed(() -> refreshSleepDataInternal(false), 350); } }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
