package com.foodline.campus;

import android.os.Build;
import android.os.Bundle;
import android.view.Display;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Force High Refresh Rate (144Hz / 120Hz) & GPU Hardware Acceleration
        Window window = getWindow();
        if (window != null) {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
            );

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) { // Android 11+ (API 30+)
                Display display = getDisplay();
                if (display != null) {
                    Display.Mode[] modes = display.getSupportedModes();
                    Display.Mode highestMode = null;
                    float maxRefreshRate = 60.0f;
                    for (Display.Mode mode : modes) {
                        if (mode.getRefreshRate() > maxRefreshRate) {
                            maxRefreshRate = mode.getRefreshRate();
                            highestMode = mode;
                        }
                    }
                    if (highestMode != null) {
                        WindowManager.LayoutParams params = window.getAttributes();
                        params.preferredDisplayModeId = highestMode.getModeId();
                        params.preferredRefreshRate = highestMode.getRefreshRate();
                        window.setAttributes(params);
                    }
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) { // Android 6.0 - 10 (API 23+)
                Display display = window.getWindowManager().getDefaultDisplay();
                Display.Mode[] modes = display.getSupportedModes();
                Display.Mode highestMode = null;
                float maxRefreshRate = 60.0f;
                for (Display.Mode mode : modes) {
                    if (mode.getRefreshRate() > maxRefreshRate) {
                        maxRefreshRate = mode.getRefreshRate();
                        highestMode = mode;
                    }
                }
                if (highestMode != null) {
                    WindowManager.LayoutParams params = window.getAttributes();
                    params.preferredDisplayModeId = highestMode.getModeId();
                    window.setAttributes(params);
                }
            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // Hardware acceleration boost for WebView
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
            WebSettings settings = webView.getSettings();
            if (settings != null) {
                settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
            }
        }
    }
}
