package com.red_folder.phonegap.plugin.backgroundservice;

import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;

public class MyService extends BackgroundService {

    private final static String TAG = MyService.class.getSimpleName();

    private String mHelloTo = "World";

    @Override
    protected JSONObject doWork() {
        Log.i(TAG, "Entro a doWork");
        JSONObject result = new JSONObject();

        try {
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String now = df.format(new Date(System.currentTimeMillis()));

            String msg = "Hello " + this.mHelloTo + " - its currently " + now;
            result.put("Message", msg);

            Log.d(TAG, msg);
        } catch (JSONException e) {
            Log.e(TAG, e.getMessage());
        }

        return result;
    }

    @Override
    protected JSONObject getConfig() {
        Log.i(TAG, "Entro a getConfig");
        JSONObject result = new JSONObject();

        try {
            result.put("HelloTo", this.mHelloTo);
        } catch (JSONException e) {
            Log.e(TAG, e.getMessage());
        }

        return result;
    }

    @Override
    protected void setConfig(JSONObject config) {
        Log.i(TAG, "Entro a setConfig");
        try {
            if (config.has("HelloTo")) {
                this.mHelloTo = config.getString("HelloTo");
            }
        } catch (JSONException e) {
            Log.e(TAG, e.getMessage());
        }
    }

    @Override
    protected JSONObject initialiseLatestResult() {
        Log.i(TAG, "Entro a initialiseLatestResult");
        return null;
    }

    @Override
    protected void onTimerEnabled() {
        Log.i(TAG, "Entro a onTimerEnabled");
    }

    @Override
    protected void onTimerDisabled() {
        Log.i(TAG, "Entro a onTimerDisabled");
    }
}
