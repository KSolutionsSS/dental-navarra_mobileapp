/*
 * Dental Navarra mobile app - Mobile app that patients of Dental Navarra will use to get notifications about their treatments, as well as promotions.
 *     Copyright (C) 2014  Nahuel Barrios
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

import java.util.ArrayList;
import java.util.List;

/**
 * TODO : Javadoc for
 * <p/>
 * Created on 2/1/14, at 4:27 PM.
 *
 * @author Nahuel Barrios <barrios.nahuel@gmail.com>.
 */
public class RemembersService extends BackgroundService {

    private final static String TAG = RemembersService.class.getSimpleName();

    public static final String DENTAL_NAVARRA_PREFERENCES_FILE_NAME = "DentalNavarraPreferencesFile";

    public static final String NOTIFICATION_INTENT_PARAMETER_MESSAGE = "message";

    public static final String NOTIFICATION_INTENT_PARAMETER_MEETING_DATE = "meetingDate";

    public static final String NOTIFICATION_INTENT_PARAMETER_TREATMENTS = "treatments";

    private static final String PATIENT_ID_KEY = "patientId";

    private static final String REMEMBERS_KEY = "remembers";

    private String patientId;

    private SharedPreferences sharedPreferences;

    @Override
    protected JSONObject doWork() {
        Log.i(TAG, "Running background service...");
        patientId = getSharedPreferences().getString(PATIENT_ID_KEY, null);
        Log.d(TAG, "Running background service for patientId (from sharedPreferences): " + patientId);

        if (patientId != null) {
            storeRemembers(getRemembersAndShowNotification());
        } else {
            Log.d(TAG, "Can't run background service because the saved patientId is null");
        }

        return null;
    }

    private Remember[] getRemembersAndShowNotification() {
        //  TODO : Refactor :  Move this, and its context to a .service package (BusinessObject)
        RememberDao rememberDao = new RememberDaoImplSpring();
        RemembersDTO response = rememberDao.findRemembers(patientId);
        Log.i(TAG, "Obtained remembers: " + response.getRemembers().length);

        Remember[] notificableRemembers = filterNotNotificableRemembers(response.getRemembers());
        Log.i(TAG, "Notificable remembers: " + notificableRemembers.length);

        String title;
        String text;
        Remember detail = null;
        if (notificableRemembers.length > 0) {
            if (notificableRemembers.length == 1) {
                title = "1 nuevo recordatorio de Dental Navarra";
                text = "Le corresponde una cita de revisión, ver detalle.";
                detail = notificableRemembers[0];
            } else {
                title = notificableRemembers.length + " recordatorios de Dental Navarra";
                text = "Haga tap aquí para ver todos sus recordatorios.";
            }

            showNotification(title, text, detail);
        }

        Log.d(TAG, "Obtained remembers: " + response.getRemembers().length);
        return response.getRemembers();
    }

    private Remember[] filterNotNotificableRemembers(Remember[] remembers) {
        List<Remember> filtered = new ArrayList<Remember>();

        for (Remember eachRemember : remembers) {
            if (eachRemember.isNotify()) {
                filtered.add(eachRemember);
            }
        }

        return filtered.toArray(new Remember[filtered.size()]);
    }

    private void showNotification(String title, String text, Remember remember) {
        Log.d(TAG, "Building notification...");

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.drawable.notification)
                .setContentTitle(title)
                .setContentText(text)
                .setAutoCancel(true);

        // Creates an explicit intent for an Activity in your app
        Intent resultIntent = new Intent(this, DentalNavarraActivity.class);
        if (remember != null) {
            Log.i(TAG, "Adding extra parameter to notification result intent, message: " + remember.getMessage());
            resultIntent.putExtra(NOTIFICATION_INTENT_PARAMETER_MESSAGE, remember.getMessage());
            Log.i(TAG, "Adding extra parameter to notification result intent, meetingDate: " + remember.getMeetingDate());
            resultIntent.putExtra(NOTIFICATION_INTENT_PARAMETER_MEETING_DATE, remember.getMeetingDate());
            Log.i(TAG, "Adding extra parameter to notification result intent, treatments: " + remember.getTreatments());
            resultIntent.putExtra(NOTIFICATION_INTENT_PARAMETER_TREATMENTS, remember.getTreatments());
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
        notification.defaults |= Notification.DEFAULT_ALL;

        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // mId allows you to update the notification later on.
        //  TODO : Functionality : Should I unhard-code this ID?
        mNotificationManager.notify(44, notification);

        Log.d(TAG, "Notification added to status bar: " + text);
    }

    private void storeRemembers(Remember[] remembers) {
        JSONArray jsonRemembers = new JSONArray();
        for (Remember eachRemember : remembers) {
            try {
                JSONObject jsonRemember = new JSONObject();

                jsonRemember.put(NOTIFICATION_INTENT_PARAMETER_MESSAGE, eachRemember.getMessage());
                jsonRemember.put(NOTIFICATION_INTENT_PARAMETER_MEETING_DATE, eachRemember.getMeetingDate());
                jsonRemember.put(NOTIFICATION_INTENT_PARAMETER_TREATMENTS, eachRemember.getTreatments());

                jsonRemembers.put(jsonRemember);
            } catch (JSONException jsonException) {
                Log.e(TAG, "An error occurred while putting a JSON attribute into a JSONObject: " + jsonException.getMessage());
            }
        }

        String stringRemembers = null;
        try {
            stringRemembers = jsonRemembers.toString(0);
        } catch (JSONException jsonException) {
            Log.e(TAG, "An error ocurred while trying to stringify the JSONArray of remembers: " + jsonException.getMessage());
            stringRemembers = "[]";
        } finally {
            Log.i(TAG, "Storing remembers: " + jsonRemembers.length());
            getSharedPreferences().edit().putString(REMEMBERS_KEY, stringRemembers).commit();
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
            } else {
                Log.i(TAG, "Backgound service can't be configured yet. Parameter patientId is required.");
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
