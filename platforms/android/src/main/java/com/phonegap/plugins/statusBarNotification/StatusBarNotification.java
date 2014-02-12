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

package com.phonegap.plugins.statusBarNotification;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class StatusBarNotification extends CordovaPlugin {

    //	Action to execute
    public static final String NOTIFY = "notify";

    public static final String CLEAR = "clear";

    /**
     * Executes the request and returns PluginResult
     *
     * @param action
     *         Action to execute
     * @param data
     *         JSONArray of arguments to the plugin
     * @param callbackContext
     *         The callback context used when calling back into JavaScript.
     *
     * @return A PluginRequest object with a status
     */
    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) {
        boolean actionValid = true;
        if (NOTIFY.equals(action)) {
            try {
                String tag = data.getString(0);
                String title = data.getString(1);
                String body = data.getString(2);
                String flag = data.getString(3);
                Log.d("NotificationPlugin", "Notification: " + tag + ", " + title + ", " + body);
                int notificationFlag = getFlagValue(flag);
                showNotification(tag, title, body, notificationFlag);
            } catch (JSONException jsonEx) {
                Log.d("NotificationPlugin", "Got JSON Exception "
                                            + jsonEx.getMessage());
                actionValid = false;
            }
        } else if (CLEAR.equals(action)) {
            try {
                String tag = data.getString(0);
                Log.d("NotificationPlugin", "Notification cancel: " + tag);
                clearNotification(tag);
            } catch (JSONException jsonEx) {
                Log.d("NotificationPlugin", "Got JSON Exception " + jsonEx.getMessage());
                actionValid = false;
            }
        } else {
            actionValid = false;
            Log.d("NotificationPlugin", "Invalid action : " + action + " passed");
        }
        return actionValid;
    }

    /**
     * Helper method that returns a flag value to be used for notification by default it will return 16 representing FLAG_NO_CLEAR
     *
     * @param flag
     *
     * @return int value of the flag
     */
    private int getFlagValue(String flag) {
        int flagVal = Notification.FLAG_AUTO_CANCEL;

        // We trust the flag value as it comes from our JS constant.
        // This is also backwards compatible as it will be emtpy.
        if (!flag.isEmpty()) {
            flagVal = Integer.parseInt(flag);
        }

        return flagVal;
    }

    /**
     * Displays status bar notification
     *
     * @param tag
     *         Notification tag.
     * @param contentTitle
     *         Notification title
     * @param contentText
     *         Notification text
     */
    public void showNotification(CharSequence tag, CharSequence contentTitle, CharSequence contentText, int flag) {
        String ns = Context.NOTIFICATION_SERVICE;
        context = cordova.getActivity().getApplicationContext();
        mNotificationManager = (NotificationManager) context.getSystemService(ns);

        Notification noti = StatusNotificationIntent.buildNotification(context, tag, contentTitle, contentText, flag);
        mNotificationManager.notify(tag.hashCode(), noti);
    }

    /**
     * Cancels a single notification by tag.
     *
     * @param tag
     *         Notification tag to cancel.
     */
    public void clearNotification(String tag) {
        mNotificationManager.cancel(tag.hashCode());
    }

    /**
     * Removes all Notifications from the status bar.
     */
    public void clearAllNotifications() {
        mNotificationManager.cancelAll();
    }

    /**
     * Called when a notification is clicked.
     *
     * @param intent
     *         The new Intent passed from the notification.
     */
    @Override
    public void onNewIntent(Intent intent) {
        // The incoming Intent may or may not have been for a notification.
        String tag = intent.getStringExtra("notificationTag");
        if (tag != null) {
            this.webView.sendJavascript("window.Notification.callOnclickByTag('" + tag + "')");
        }
    }


    private NotificationManager mNotificationManager;

    private Context context;
}