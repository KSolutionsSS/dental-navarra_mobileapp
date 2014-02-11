package com.nbempire.dentalnavarra.cordova;

import android.content.Context;
import android.util.Log;
import com.red_folder.phonegap.plugin.backgroundservice.MyService;
import org.apache.cordova.CordovaActivity;

/**
 * It's a bridge that lets you call this Java methods from Javascript in your Apache Cordova application.
 * <p/>
 * Usage:
 * <p/>
 * from main activity, in onCreate: appView.addJavascriptInterface(new WebViewBackendBridge(this), "bridge");
 * <p/>
 * from Javascript: window.bridge.getPreference("patientId")
 * <p/>
 * Taken from: http://stackoverflow.com/a/17000277/1898043
 * <p/>
 * Created on 2/10/14, at 11:42 PM.
 *
 * @author Nahuel Barrios <barrios.nahuel@gmail.com>.
 */
public class WebViewBackendBridge {

    /**
     * Tag for class' log.
     */
    private static final String TAG = WebViewBackendBridge.class.getSimpleName();

    private CordovaActivity cordovaActivity;

    public WebViewBackendBridge(CordovaActivity cordovaActivity) {
        this.cordovaActivity = cordovaActivity;
    }

    /**
     * Returns the value of the {@code preference} that is stored in the Shared Preferences file.
     *
     * @param preference
     *         a key in the shared preferences file of this app.
     *
     * @return The value or the String "null" if there is no property for such key.
     */
    public String getPreference(String preference) {
        Log.i(TAG, "Getting preference from shared preferences file: " + preference);
        return cordovaActivity.getSharedPreferences(MyService.DENTAL_NAVARRA_PREFERENCES_FILE_NAME, Context.MODE_PRIVATE)
                              .getString(preference, "null");
    }
}
