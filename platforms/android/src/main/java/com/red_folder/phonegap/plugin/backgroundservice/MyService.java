package com.red_folder.phonegap.plugin.backgroundservice;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;
import com.nbempire.dentalnavarra.DentalNavarraActivity;
import com.nbempire.dentalnavarra.R;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;

public class MyService extends BackgroundService {

    private final static String TAG = MyService.class.getSimpleName();

    private String mHelloTo = "World";

    @Override
    protected JSONObject doWork() {
        Log.i(TAG, "--> doWork");
        JSONObject result = new JSONObject();


        try {
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String now = df.format(new Date(System.currentTimeMillis()));

            String msg = "Hello " + this.mHelloTo + " - its currently " + now;
            result.put("Message", "{\"id\":\"hola\", \"value\":\"nahuel\", \"mensaje\":\"" + msg + "\"}");

            showNotification("This is the title!!", "This is the text of the notification ;)");

            Log.d(TAG, msg);
        } catch (JSONException e) {
            Log.e(TAG, e.getMessage());
        }

        return result;
    }

    private void showNotification(String title, String text) {
        Log.d(TAG, "Building notification...");

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.drawable.notification)
                .setContentTitle(title)
                .setContentText(text);

        // Creates an explicit intent for an Activity in your app
        Intent resultIntent = new Intent(this, DentalNavarraActivity.class);

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
        mNotificationManager.notify(44, notification);

        Log.d(TAG, "Notification sent");
    }

    @Override
    protected JSONObject getConfig() {
        Log.i(TAG, "--> getConfig");
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
        Log.i(TAG, "--> setConfig");
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
