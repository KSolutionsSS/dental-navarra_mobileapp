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

var displayNextView = function () {
    location.href = 'views/home.html';
};

$(document).ready(function () {
    /**
     * Check for logged user...
     */
    (function () {
        if (localStorage.getItem(PATIENT_KEY)) {
            console.log('User already logged, skipping login view');
            this.displayNextView();
        } else {
            console.log('User not logged, waiting user to login');
            app.bindEvents();
        }
    });

    //  TODO : Delete this line or context.
    app.bindEvents();
});

var app = {
    // Application Constructor
    initialize: function () {
        console.log('--> initialize...');

        /**
         * Initialize background service
         */
        (function () {
            var milliseconds = 10000;

            var retrieveNotifications = function (data) {
                var patient = JSON.parse(localStorage.getItem(PATIENT_KEY));
                if (patient) {
                    console.log('Getting user notifications and saving them to local storage system...');

                    $.ajax({
//                               url: 'http://localhost:5000/patients/52f4f0bd269d1d7718bd6101/notifications',
                               url: 'http://dentalnavarra-intranet.herokuapp.com/patients/' + patient._id + '/notifications',
                               type: 'GET'
                           }).done(function (notifications) {
                                       var notify = function (notifications) {
                                           var header = '1 nueva notificación de Dental Navarra';
                                           var message;
                                           if (notifications.length === 1) {
                                               message = notifications[0].message;
                                           } else {
                                               header = 'Tiene ' + notifications.length + ' notificaciones de Dental Navarra';
                                               message = 'Haga tap aquí para ver todas sus notificaciones';
                                           }

//                                           navigator.notification.vibrate(1000);
//                                           navigator.notification.beep(1);
                                           window.plugins.statusBarNotification.notify(header, message);
                                       };

                                       console.log('Obtained: ' + notifications.length + ' notifications.');

                                       if (!patient.remembers) {
                                           patient.remembers = [];
                                       }

                                       if (notifications.length > 0) {
                                           //  TODO : Functionality : Put newer remembers first!
                                           patient.remembers = patient.remembers.concat(notifications);
                                           notify(notifications);
                                       }
                                   }).fail(function (jqXHR, textStatus) {
                                               console.log('There was an error getting user notifications: ' + jqXHR.status + '. Text: '
                                                               + textStatus);

                                               if (!patient.remembers) {
                                                   patient.remembers = [];
                                               }
                                           }).always(function () {
                                                         console.log('Saving updated patient to local storage');
                                                         localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
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

            go();

            //-------------------------------------------------------------
            function go() {
                console.log('NUEVO-go');
                myService.getStatus(function (r) {
                    startService(r)
                }, function (e) {
                    displayError(e)
                });
            }

            function startService(data) {
                console.log('NUEVO-startService');
                if (data.ServiceRunning) {
                    console.log('NUEVO-ya esta corriendo, así que intento habilitar el timer');
                    enableTimer(data);
                } else {
                    console.log('NUEVO-starting service...');
                    myService.startService(function (r) {
                        enableTimer(r)
                    }, function (e) {
                        displayError(e)
                    });
                }
            }

            function enableTimer(data) {
                console.log('NUEVO-enableTimer');
                if (data.TimerEnabled) {
                    console.log('NUEVO-ya esta habilitado, así que me registro para los updates...');
                    registerForUpdates(data);
                } else {
                    console.log('NUEVO-enabling timer...');
                    myService.enableTimer(milliseconds, function (r) {
                        registerForUpdates(r)
                    }, function (e) {
                        displayError(e)
                    });
                }
            }

            function registerForUpdates(data) {
                console.log('NUEVO-registerForUpdates');
                if (!data.RegisteredForUpdates) {
                    console.log('NUEVO-registering for updates...');
                    myService.registerForUpdates(function (r) {
                        updateHandler(r)
                    }, function (e) {
                        handleError(e)
                    });
                } else {
                    console.log('NUEVO-ya esta registrado!');
                }
            }

            function updateHandler(data) {
                console.log('NUEVO-updateHandler');
                console.log('NUEVO-data vale: ' + data);
                if (data.LatestResult != null) {
                    console.log('NUEVO-corrio el updateHandler!!');
                }
            }

            //-------------------------------------------------------------


//            myService.getStatus(function (data) {
//                if (data.ServiceRunning) {
//                    console.log('Background service already running, don\'t have to initialize it again');
//
//
//
//                    if (data.TimerEnabled) {
//
//                        if (!data.RegisteredForUpdates) {
////                            myService.registerForUpdates(retrieveNotifications, onError);
//                            myService.registerForUpdates(function(data){
//                                console.log('corrio el updateHandler');
//                            }, onError);
//                            console.log('Background service registered for updates');
//                        }
//
//
//                    } else {
//                        myService.enableTimer(60000, function(r){registerForUpdates(r)}, function(e){displayError(e)});
//                    }
//
//
//                } else {
//
//
//                    myService.startService(function (data) {
//                        console.log('Background service started');
//
//                        myService.enableTimer(milliseconds, function (data) {
//                            console.log('Timer started (ms):' + milliseconds);
//                        });
//
//                        myService.registerForBootStart(function (data) {
//                            console.log('Background service registered for boot start');
//                        }, onError);
//                    }, onError);
//                }
//            }, onError);
        }());


        //  TODO : Delete this line or context.
//        var dummyPatient = {"_id": "52f5036af687300200acd105", "email": "barrios.nahuel@gmail.com", "office": "tafalla"};
//        localStorage.setItem(PATIENT_KEY, JSON.stringify(dummyPatient));
//        localStorage.removeItem(PATIENT_KEY);
//        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        console.log('Binding events... deviceready, form.submit...');

        document.addEventListener('deviceready', this.onDeviceReady, false);

        $('form').submit(function (event) {
            event.preventDefault();

            $('.alert').fadeOut();

            modules.patient.login($('#email').val(), $('#password').val(), function (response) {
                var handleSuccessfulLogin = function (patient) {
                    console.log('User ' + patient.email + ' successfully logged');
                    console.log('User information: ' + patient._id + ', office: ' + patient.office);

                    localStorage.setItem(PATIENT_KEY, JSON.stringify({
                                                                         _id: patient._id,
                                                                         email: patient.email,
                                                                         office: patient.office
                                                                     }));
                    this.displayNextView();
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