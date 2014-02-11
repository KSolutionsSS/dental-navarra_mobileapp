/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.nbempire.dentalnavarra.component.activity;

import android.os.Bundle;
import android.util.Log;
import com.nbempire.dentalnavarra.cordova.WebViewBackendBridge;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

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
//        String viewToShow = getIntent().getStringExtra("viewToShow");
//        if (viewToShow != null) {
//            Log.d(TAG, "Showing view: " + viewToShow);
//            params = "?viewToShow=" + viewToShow;
//        } else {
//            Log.d(TAG, "viewToShow is null");
//        }

        // Set by <content src="login.html" /> in config.xml
        super.loadUrl(Config.getStartUrl() + params);

        Log.d(TAG, "Adding Javascript interface for WebViewBackendBridge...");
        appView.addJavascriptInterface(new WebViewBackendBridge(this), "bridge");
    }
}

