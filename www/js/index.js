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
var PATIENT_KEY = 'patient';
//var SERVER_URL = 'http://localhost:5000/';
var SERVER_URL = 'http://dentalnavarra-intranet.herokuapp.com/';
var PROMOTIONS_GOOGLE_SPREADSHEET_KEY = '0AgqeUj0Ks3f6dGNNMERIRnpjd2JTb1UzUWdzTXlDU2c';
var CHECK_FOR_REMEMBERS_MILLISECONDS_INTERVAL = 120000;

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

            var goHome = function () {
                console.log('Going back to home...');
                app.displayNextView('#homeView');
            };

            switch ($viewsTab.find('li.active>a').attr('href')) {
                case '#rememberNotificationView':
                    goHome();
                    break;
                case '#changePasswordView':
                    goHome();
                    app.views.changePassword.reset();
            }
        }, false);

        //  TODO : Delete this line or context. It's used when testing from desktop browser.
        this.onDeviceReady();
    };

    /**
     * Event handler for deviceready event.
     */
    var onDeviceReady = function () {
        console.log('Executing onDeviceReady function...');

        $viewsTab = $('#viewsTab');

        /**
         * Check what should be the first view
         */
        (function () {
            /**
             * Check if there is a parameter viewToShow in the URL. In that case, the app must display that view instead of the login/home view.
             * @returns {*}
             */
            var startingFromNotification = function () {
                //  TODO : Refactor :  Extract this function
                var getQueryStringValue = function (key) {
                    var searchString = window.location.search.substring(1);
                    var variableArray = searchString.split('&');
                    for (var i = 0; i < variableArray.length; i++) {
                        var keyValuePair = variableArray[i].split('=');
                        if (keyValuePair[0] == key) {
                            return decodeURI(keyValuePair[1]);
                        }
                    }
                };

                var result;

                var message = getQueryStringValue('message');
                if (message) {
                    result = {
                        message: message,
                        meetingDate: getQueryStringValue('meetingDate'),
                        treatments: getQueryStringValue('treatments').split(',')
                    };
                }

                return result;
            };

            /**
             * Check for logged user...
             */
            var checkForLoggedUser = function () {
                //  TODO : Delete this line or context. It's used when testing from desktop browser.
//                patient = {
//                    "_id": "53194c7a0f0f8d02002b6742",
//                    "email": "barrios.nahuel@gmail.com",
//                    "office": "tafalla",
//                    "remembers": [
//                        {
//                            "message": "Han pasado 4 meses y medio desde su visita y le corresponde una cita de revisión en 2 semanas.",
//                            "meetingDate": "29/7",
//                            "treatments": "Ortodoncia"
//                        },
//                        {
//                            "message": "Han pasado 4 meses y medio desde su visita y le corresponde una cita de revisión en 2 semanas.",
//                            "meetingDate": "29/7",
//                            "treatments": "Ortodoncia"
//                        },
//                        {
//                            "message": "Han pasado 3 meses desde su visita y le corresponde una cita de revisión en 2 semanas.",
//                            "meetingDate": "15/6",
//                            "treatments": "Cirugía de implantes,Extracción"
//                        }
//                    ]
//                };
//                localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));

                var isLogged;

                patient = JSON.parse(localStorage.getItem(PATIENT_KEY));
                if (patient) {
                    console.log('User already logged, skipping login view.');
                    isLogged = true;
                }

                return isLogged;
            };

            var result = startingFromNotification();
            if (result) {
                console.log('Obtained from URL meetingDate: ' + result.meetingDate + ', message: ' + result.message);
                console.log('Displaying remember notification view...');
                patient = JSON.parse(localStorage.getItem(PATIENT_KEY));
                app.displayNextView('#rememberNotificationView', result);
            } else {
                result = checkForLoggedUser();
                if (result) {
                    console.log('Displaying home view because the user is already logged.');
                    app.displayNextView('#homeView');
                } else {
                    console.log('Displaying login...');
                    app.views.login.init();
                }
            }
        }());


        /**
         * Initialize background service
         */
        (function () {
            var updateNotificationsHandler = function (data) {
                console.log('On update remembers handler...');

                var localStoragePatient = localStorage.getItem(PATIENT_KEY);
                if (localStoragePatient) {
                    var updateView;

                    console.log('Getting remembers from bridge...');
                    var remembers = JSON.parse(window.bridge.getPreference("remembers"));
                    if (remembers) {
                        console.log('Obtained: ' + remembers.length + ' remembers, saving them to local storage system....');
                        console.log('Obtained remembers from native module: ' + JSON.stringify(remembers));

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
                    myService.enableTimer(CHECK_FOR_REMEMBERS_MILLISECONDS_INTERVAL, registerForBootStart, onError);
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

        app.views.changePassword.init();
    };

    var displayNextView = function (selector, remember) {
        switch (selector) {
            case '#homeView':
                if (!app.views.home.isInitialised()) {
                    app.views.home.init(patient);
                }
                break;
            case '#rememberNotificationView':
                app.views.rememberNotification.render(remember);
                break;
            case '#changePasswordView':
                if (!app.views.changePassword.isInitialised()) {
                    app.views.changePassword.init();
                }
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