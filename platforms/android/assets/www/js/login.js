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
var patient;
var $viewsTab;

var displayNextView = function (selector, param1, param2) {
    switch (selector) {
        case '#homeView':
            home.init(patient);
            break;
        case '#rememberNotificationView':
            rememberNotification.render(param1, param2);
            break;
    }

    $viewsTab.find('a[href=' + selector + ']').tab('show');
};

var app = {
    // Application Constructor
    initialize: function () {
        console.log('--> initialize...');

        $viewsTab = $('#viewsTab');

        /**
         * Initialize background service
         */
        (function () {
            var milliseconds = 30000;

            var updateNotificationsHandler = function (data) {
                var showNotifications = function (notifications) {
                    var notify = function (notifications) {
                        var header = '1 nueva notificación de Dental Navarra';
                        var message;
                        if (notifications.length === 1) {
                            message = notifications[0].message;
                        } else {
                            header = 'Tiene ' + notifications.length + ' notificaciones de Dental Navarra';
                            message = 'Haga tap aquí para ver todas sus notificaciones';
                        }

                        console.log('Displaying status bar notification: ' + message);
                        navigator.notification.vibrate(1000);
                        navigator.notification.beep(1);
                        window.plugins.statusBarNotification.notify(header, message);
                    };

                    console.log('Obtained: ' + notifications.length + ' notifications.');

                    if (notifications.length > 0) {
                        //  TODO : Functionality : Put newer remembers first!
                        if (patient.remembers) {
                            patient.remembers = patient.remembers.concat(notifications);
                        } else {
                            patient.remembers = notifications;
                        }
                        notify(notifications);
                        updateView = true;
                    }
                };

                var localStoragePatient = localStorage.getItem(PATIENT_KEY);
                if (localStoragePatient) {
                    var updateView;
                    console.log('Getting user notifications and saving them to local storage system...');
                    patient = JSON.parse(localStoragePatient);

                    var url = SERVER_URL + 'patients/' + patient._id + '/notifications';
                    console.log('GET to: ' + url);
                    $.ajax({
                               url: url,
                               type: 'GET'
                           }).done(showNotifications).fail(function (jqXHR, textStatus) {
                                                               console.log('There was an error getting user notifications: ' + jqXHR.status
                                                                               + '. Text: ' + textStatus);
                                                               updateView = false;
                                                           }).always(function () {
                                                                         console.log('Saving updated patient to local storage');
                                                                         localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
                                                                         if (updateView) {
                                                                             home.updateRemembers(patient);
                                                                         }
                                                                     });
                } else {
                    console.log('User has never been logged, waiting for it to start receiving notifications from server...');
                }
            };

            var onError = function (error) {
                console.log('An error occurred with the background service: ' + error.ErrorMessage);
                console.log(JSON.stringify(error));
            };

            var myService = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');
            var startService = function (data) {
                if (data.ServiceRunning) {
                    console.log('Background service is already running.');
                    enableTimer(data);
                } else {
                    console.log('Background service is starting its service...');
                    myService.startService(enableTimer, onError);
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


    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        console.log('Binding events... deviceready, form.submit...');

        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", function (event) {
            event.preventDefault();

            switch ($viewsTab.find('li.active>a').attr('href')) {
                case '#rememberNotificationView':
                    console.log('backbutton mostrando home!');
                    displayNextView('#homeView');
                    break;
            }
        }, false);

        login.bindEvents();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        console.log('-->onDeviceReady...');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var login = (function () {


    return {
        init: function () {
            /**
             * Check for logged user...
             */
            (function () {
                //  TODO : Delete this line or context.
//                patient = {"_id": "52f5036af687300200acd105", "email": "barrios.nahuel@gmail.com", "office": "tafalla"};
//                localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));


                patient = JSON.parse(localStorage.getItem(PATIENT_KEY));
                if (patient) {
                    console.log('User already logged, skipping login view');
                    displayNextView('#homeView');
                } else {
                    console.log('User not logged, waiting user to login');
                    app.bindEvents();
                }
            }());

            //  TODO : Delete this line or context.
//            app.bindEvents();
        },
        bindEvents: function () {
            $('form').submit(function (event) {
                event.preventDefault();

                $('.alert').fadeOut();

                modules.patient.login($('#email').val(), $('#password').val(), function (response) {
                    var handleSuccessfulLogin = function (patientFromServer) {
                        console.log('User ' + patientFromServer.email + ' successfully logged');
                        console.log('User information: ' + patientFromServer._id + ', office: ' + patientFromServer.office);

                        patient = {
                            _id: patientFromServer._id,
                            email: patientFromServer.email,
                            office: patientFromServer.office
                        };
                        localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
                        displayNextView('#homeView');
                    };

                    switch (response.statusCode) {
                        case 200:
                            handleSuccessfulLogin(response.patient);
                            break;
                        case 404:
                            $('#alert-username').fadeIn();
                            break;
                        case 401:
                            $('#alert-password').fadeIn();
                    }
                }, function (jqXHR) {
                    console.log('No se pudo realizar la petición de login: ' + jqXHR.status);
                    $('#alert-generic').fadeIn();
                });
            });
        }
    };
}());


$(document).ready(function () {
    app.initialize();
    login.init();
});