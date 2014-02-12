package com.nbempire.dentalnavarra.component.service;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;
import com.nbempire.dentalnavarra.R;
import com.nbempire.dentalnavarra.component.activity.DentalNavarraActivity;
import com.nbempire.dentalnavarra.dao.RememberDao;
import com.nbempire.dentalnavarra.dao.impl.RememberDaoImplSpring;
import com.nbempire.dentalnavarra.domain.Remember;
import com.nbempire.dentalnavarra.dto.RemembersDTO;
import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class RemembersService extends BackgroundService {

    private final static String TAG = RemembersService.class.getSimpleName();

    private String patientId;

    private static final String PATIENT_ID_KEY = "patientId";

    public static final String DENTAL_NAVARRA_PREFERENCES_FILE_NAME = "DentalNavarraPreferencesFile";

    private SharedPreferences sharedPreferences;

    @Override
    protected JSONObject doWork() {
        Log.i(TAG, "Running background service...");
        patientId = getSharedPreferences().getString(PATIENT_ID_KEY, null);
        Log.i(TAG, "Running background service for patientId (from sharedPreferences): " + patientId);

        if (patientId != null) {
            storeRemembers(getRemembersAndShowNotification());
        } else {
            Log.i(TAG, "Can't run background service because the saved patientId is null");
        }

        return null;
    }

    private Remember[] getRemembersAndShowNotification() {
        RememberDao rememberDao = new RememberDaoImplSpring();
        RemembersDTO response = rememberDao.findRemembers(patientId);

        Remember[] remembers = response.getRemembers();
        String title;
        String text;
        boolean customView = true;
        if (remembers.length == 1) {
            title = "1 nueva notificación de Dental Navarra";
            text = remembers[0].getMessage();
        } else {
            title = "Tiene " + remembers.length + " notificaciones de Dental Navarra";
            text = "Haga tap aquí para ver todas sus notificaciones";
            customView = false;
        }

        showNotification(title, text, customView);

        return remembers;
    }

    private void showNotification(String title, String text, boolean customView) {
        Log.d(TAG, "Building notification...");

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.drawable.notification)
                .setContentTitle(title)
                .setContentText(text);

        // Creates an explicit intent for an Activity in your app
        Intent resultIntent = new Intent(this, DentalNavarraActivity.class);
        if (customView) {
            resultIntent.putExtra("viewToShow", "#rememberNotificationView");
        }

        // The stack builder object will contain an artificial back stack for the
        // started Activity.
        // This ensures that navigating backward from the Activity leads out of
        // your application to the Home screen.
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);

        // Adds the back stack for the Intent (but not the Intent itself)
        stackBuilder.addParentStack(DentalNavarraActivity.class);

        // Adds the Intent that starts the Activity to the top of the stack
        stackBuilder.addNextIntent(resultIntent);
        PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
        mBuilder.setContentIntent(resultPendingIntent);

        Notification notification = mBuilder.build();
//        notification.defaults |= Notification.DEFAULT_ALL;

        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // mId allows you to update the notification later on.
        //  TODO : Functionality : Should I unhard-code this ID?
        mNotificationManager.notify(44, notification);

        Log.d(TAG, "Notification added to status bar: " + text);
    }

    private void storeRemembers(Remember[] remembers) {
        JSONArray jsonRemembers = new JSONArray();
        for (Remember eachRemember : remembers) {
            JSONObject jsonRemember = new JSONObject();
            boolean add = true;
            try {
                jsonRemember.put("message", eachRemember.getMessage());
                jsonRemember.put("endDate", eachRemember.getEndDate());
            } catch (JSONException jsonException) {
                Log.e(TAG, "An error occurred while putting a JSON attribute into a JSONObject: " + jsonException.getMessage());
                add = false;
            }

            if (add) {
                jsonRemembers.put(jsonRemember);
            }
        }

        String stringRemembers = null;
        try {
            stringRemembers = jsonRemembers.toString(0);
        } catch (JSONException jsonException) {
            Log.e(TAG, "An error ocurred while trying to stringify the JSONArray of remembers: " + jsonException.getMessage());
            stringRemembers = "[]";
        } finally {
            getSharedPreferences().edit().putString("remembers", stringRemembers).commit();
        }
    }

    private SharedPreferences getSharedPreferences() {
        if (sharedPreferences == null) {
            Log.i(TAG, "Getting shared preferences file from first time in background service...");
            sharedPreferences = getSharedPreferences(DENTAL_NAVARRA_PREFERENCES_FILE_NAME, MODE_PRIVATE);
        }
        return sharedPreferences;
    }

    @Override
    protected JSONObject getConfig() {
        Log.i(TAG, "--> getConfig");

        JSONObject result = new JSONObject();
        try {
            result.put(PATIENT_ID_KEY, this.patientId);
        } catch (JSONException jsonException) {
            Log.e(TAG, "Can't set patientId: " + jsonException.getMessage());
        }

        return result;
    }

    @Override
    protected void setConfig(JSONObject config) {
        Log.i(TAG, "--> setConfig");
        try {
            if (config.has(PATIENT_ID_KEY)) {
                this.patientId = config.getString(PATIENT_ID_KEY);

                //  TODO : Performance : May I call this less times?
                getSharedPreferences().edit().putString(PATIENT_ID_KEY, patientId).commit();
                Log.i(TAG, "Shared preferences updated with " + PATIENT_ID_KEY + ": " + patientId);
            }
        } catch (JSONException jsonException) {
            Log.e(TAG, "Can't get patientId from frontend: " + jsonException.getMessage());
        }
    }

    @Override
    protected JSONObject initialiseLatestResult() {
        Log.i(TAG, "--> initialiseLatestResult");
        return null;
    }

    @Override
    protected void onTimerEnabled() {
        Log.i(TAG, "--> onTimerEnabled");
    }

    @Override
    protected void onTimerDisabled() {
        Log.i(TAG, "--> onTimerDisabled");
    }
}
