/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var PATIENT_KEY = 'patient';
//var SERVER_URL = 'http://localhost:5000/';
var SERVER_URL = 'http://dentalnavarra-intranet.herokuapp.com/';
var PROMOTIONS_GOOGLE_SPREADSHEET_KEY = '0Als-7pL8K4VidGdWa0gtMnBBYTA1bWpiZGlTZm9YREE';

var patient;
var $viewsTab;

var app = (function () {

    /**
     * The application constructor
     */
    var initialize = function () {
        console.log('Initialising Dental Navarra app...');
        app.bindEvents();
    };

    /**
     * Bind Event Listeners.
     * Bind any events that are required on startup. Common events are: 'load', 'deviceready', 'offline', and 'online'.
     */
    var bindGenericEvents = function () {
        console.log('Binding events... deviceready, form.submit...');

        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", function (event) {
            event.preventDefault();

            switch ($viewsTab.find('li.active>a').attr('href')) {
                case '#rememberNotificationView':
                    console.log('Going back to home...');
                    app.displayNextView('#homeView');
                    break;
            }
        }, false);
    };

    /**
     * Event handler for deviceready event.
     */
    var onDeviceReady = function () {
        console.log('Executing onDeviceReady function...');

        $viewsTab = $('#viewsTab');

        app.views.login.init();

        /**
         * Initialize background service
         */
        (function () {
//            var milliseconds = 345600000000;//   4 days???
            var milliseconds = 60000;

            var updateNotificationsHandler = function (data) {
                console.log('On update remembers handler...');

                var localStoragePatient = localStorage.getItem(PATIENT_KEY);
                if (localStoragePatient) {
                    var updateView;

                    console.log('Getting remembers from bridge...');
                    var remembers = JSON.parse(window.bridge.getPreference("remembers"));
                    if (remembers) {
                        console.log('Obtained: ' + remembers.length + ' remembers, saving them to local storage system....');

                        patient = JSON.parse(localStoragePatient);
                        if (remembers.length > 0) {
                            //  TODO : Functionality : Put newer remembers first!
                            if (patient.remembers) {
                                patient.remembers = patient.remembers.concat(remembers);
                            } else {
                                patient.remembers = remembers;
                            }
                            updateView = true;
                        }

                        console.log('Saving updated patient to local storage');
                        localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
                        if (updateView) {
                            app.views.home.updateRemembers();
                        }
                    } else {
                        console.log('Obtained an invalid result from bridge instead of an array of empty remembers.');
                    }
                } else {
                    console.log('User has never been logged, waiting for it to start receiving notifications from server...');
                }
            };

            var onError = function (error) {
                console.log('Error object: ' + JSON.stringify(error));
                console.log('An error occurred with the background service: ' + error.ErrorMessage);
            };

            var myService = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');
            var startService = function (data) {
                if (data.ServiceRunning) {
                    console.log('Background service is already running.');
                    enableTimer(data);
                } else {
                    console.log('Background service is starting its service...');
                    myService.startService(configureService, onError);
                }
            };

            var configureService = function (data) {
                console.log('Background service is running, trying to configure it...');
                var localStoragePatient = localStorage.getItem(PATIENT_KEY);
                if (localStoragePatient) {
                    console.log('Configuring background service for patient: ' + localStoragePatient);
                    patient = JSON.parse(localStoragePatient);

                    myService.setConfiguration({patientId: patient._id}, function (data) {
                        console.log('Background service configured successfully');
                        enableTimer(data);
                    }, function (error) {
                        console.log('acá tengo un error!!');
                        console.log('error: ' + error);
                        console.dir('error: ' + error);

                        onError(error);
                    });
                } else {
                    var waitFor = 5000;
                    console.log('Background service can\'t be configured because the user has never been logged, waiting ' + waitFor / 1000
                                    + ' seconds to try again...');

                    //  TODO : Functionality : When user is logged, cancel this timeout to get notifications inmediately
                    setTimeout(function () {
                        configureService(data);
                    }, waitFor);
                }
            };

            var enableTimer = function (data) {
                if (data.TimerEnabled) {
                    console.log('Background service timer is already enabled.');
                    registerForBootStart(data);
                } else {
                    console.log('Background service is enabling its timer...');
                    myService.enableTimer(milliseconds, registerForBootStart, onError);
                }
            };

            var registerForBootStart = function (data) {
                if (data.RegisteredForBootStart) {
                    console.log('Background service is already registered for boot start.');
                    registerForUpdates(data);
                } else {
                    console.log('Background service is registering itself boot start...');
                    myService.registerForBootStart(registerForUpdates, onError);
                }
            };

            var registerForUpdates = function (data) {
                if (data.RegisteredForUpdates) {
                    console.log('Background service is already registered for updates.');
                } else {
                    console.log('Background service is registering for updates...');
                    myService.registerForUpdates(updateNotificationsHandler, onError);
                }
            };
            myService.getStatus(startService, onError);
        }());
    };

    var displayNextView = function (selector, message, endDate) {
        switch (selector) {
            case '#homeView':
                app.views.home.init(patient);
                break;
            case '#rememberNotificationView':
                app.views.rememberNotification.render(message, endDate);
                break;
        }

        $viewsTab.find('a[href=' + selector + ']').tab('show');
    };

    return {
        initialize: initialize,
        bindEvents: bindGenericEvents,
        onDeviceReady: onDeviceReady,
        displayNextView: displayNextView
    };
}());