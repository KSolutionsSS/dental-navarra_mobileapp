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

package com.nbempire.dentalnavarra.cordova;

import android.content.Context;
import android.util.Log;
import com.nbempire.dentalnavarra.component.service.RemembersService;
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
        return cordovaActivity.getSharedPreferences(RemembersService.DENTAL_NAVARRA_PREFERENCES_FILE_NAME, Context.MODE_PRIVATE)
                              .getString(preference, "null");
    }
}
