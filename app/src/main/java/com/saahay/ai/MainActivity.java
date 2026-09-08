package com.saahay.ai;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONObject;

public class MainActivity extends Activity {
    private WebView webView;
    private FirebaseAuth auth;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        auth = FirebaseAuth.getInstance();
        prefs = getSharedPreferences("saahay_prefs", MODE_PRIVATE);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        webView.addJavascriptInterface(new AuthBridge(), "SAHAAYAuth");
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

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
