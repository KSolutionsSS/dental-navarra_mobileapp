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

package com.nbempire.dentalnavarra.component.activity;

import android.os.Bundle;
import android.util.Log;
import com.nbempire.dentalnavarra.component.service.RemembersService;
import com.nbempire.dentalnavarra.cordova.WebViewBackendBridge;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

/**
 * TODO : Javadoc for
 * <p/>
 * Created on 1/8/14, at 6:45 AM.
 *
 * @author Nahuel Barrios <barrios.nahuel@gmail.com>.
 */
public class DentalNavarraActivity extends CordovaActivity {

    /**
     * Tag for class' log.
     */
    private static final String TAG = DentalNavarraActivity.class.getSimpleName();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();

        String params = "";
        String message = getIntent().getStringExtra(RemembersService.NOTIFICATION_INTENT_PARAMETER_MESSAGE);
        String meetingDate = getIntent().getStringExtra(RemembersService.NOTIFICATION_INTENT_PARAMETER_MEETING_DATE);
        String treatments = getIntent().getStringExtra(RemembersService.NOTIFICATION_INTENT_PARAMETER_TREATMENTS);
        if (message != null) {
            Log.d(TAG, "Adding parameter " + RemembersService.NOTIFICATION_INTENT_PARAMETER_MESSAGE + " to app URL: " + message);
            params = "?" + RemembersService.NOTIFICATION_INTENT_PARAMETER_MESSAGE + "=" + message + "&" +
                     RemembersService.NOTIFICATION_INTENT_PARAMETER_MEETING_DATE + "=" + meetingDate + "&" +
                     RemembersService.NOTIFICATION_INTENT_PARAMETER_TREATMENTS + "=" + treatments;
        }

        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl() + params);

        Log.d(TAG, "Adding Javascript interface for WebViewBackendBridge...");
        appView.addJavascriptInterface(new WebViewBackendBridge(this), "bridge");
    }
}

