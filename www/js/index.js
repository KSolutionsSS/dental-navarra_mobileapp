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


//var SERVER_URL = 'http://localhost:5000/';
var SERVER_URL = 'http://desa-dentalnavarra-intranet.herokuapp.com/';
var CHECK_FOR_REMEMBERS_MILLISECONDS_INTERVAL = 180000;// Every 3 minutes.
var GOOGLE_ANALYTICS_TRACKING_ID = 'UA-32410648-5';
var PROMOTIONS_GOOGLE_SPREADSHEET_KEY = '0AqAWn1xLDRvPdDNOSWJmU0VBZGtXOUx4QTdodTdhY2c';

var PATIENT_KEY = 'patient';

var offices = {
    tafalla: {
        name: "Clínica Odontológica Tafalla",
        street: "C/ Diputación Foral",
        number: 4,
        apartment: "1 A",
        city: "Tafalla",
        postalCode: 31300,
        phoneNumber: "948 755 169",
        email: "tafalla@dentalnavarra.com"
    },
    alsasua: {
        name: 'Clínica Dental Alsasua',
        street: 'C/ Alzania',
        number: 1,
        apartment: "A",
        city: 'Alsasua',
        postalCode: 31800,
        phoneNumber: '948 468 232',
        email: 'alsasua@dentalnavarra.com'
    },
    milagro: {
        name: 'Clínica Dental Milagro',
        street: 'C/ Navas de Tolosa',
        number: 4,
        apartment: "bajo",
        city: 'Milagro',
        postalCode: 31120,
        phoneNumber: '948 861 231',
        email: 'milagro@dentalnavarra.com'
    }
};

var properties = {
    mock: {
        device: false,
        loggedUser: false
    },
    mockData: {
        patient: {
            "_id": "5366dc82fc1e1f0200c32227",
            "email": "barrios.nahuel@gmail.com",
            "age": 24,
            "office": {
                "name": "Clínica Dental Alsasua",
                "street": "C/ Alzania",
                "number": 1,
                "apartment": "A",
                "city": "Alsasua",
                "postalCode": 31800,
                "phoneNumber": "948 468 232",
                "email": "alsasua@dentalnavarra.com"
            },
            "remembers": [
                {
                    "message": "Han pasado 3 meses desde su visita y le corresponde una cita de revisión en 2 semanas.",
                    "meetingDate": "10/8",
                    "treatments": [
                        "Cirugía (Periodontal)", "Cirugía (Extracción)"
                    ]
                },
                {
                    "message": "Han pasado 6 meses desde su visita y le corresponde una cita de revisión en 2 semanas.",
                    "meetingDate": "11/11",
                    "treatments": [
                        "Limpieza", "Cirugía (Periodontal)"
                    ]
                }
            ]
        }
    }
};

var patient = patient || {};
var $viewsTab;

var analytics = {};

var app = (function () {

    var handleGoogleAnalyticsConfigurationError = function (analytics) {
        //  TODO : Functionality : Try to send this error to support.
        console.log('Google Analytics Plugin is not configured well (navigator.analytics is "' + analytics
                        + '"), can\'t send app usage statistics to analytics.');
    };

    /**
     * The application constructor
     */
    var initialize = function () {
        $.templates({
                        offices: {
                            markup: '#officesTemplate'
                        },
                        contactInformation: {
                            markup: '#contactInformationTemplate',
                            helpers: {
                                encodeURI: encodeURI
                            }
                        },
                        rememberView: {
                            markup: '#rememberTemplate'
                        },
                        promotions: {
                            markup: '#promotionsTemplate',
                            helpers: {
                                calculateEndDate: modules.promotion.calculateEndDate
                            }
                        },
                        remembers: {
                            markup: '#remembersTemplate',
                            helpers: {
                                decorateTreatments: function (treatments) {
                                    return treatments.join('; ');
                                }
                            }
                        },
                        carousel: {
                            markup: '#treatmentsCarouselTemplate'
                        }
                    });

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

            var exitApp = function () {
                navigator.app.exitApp();
            };

            switch ($viewsTab.find('li.active>a').attr('href')) {
                case '#publicHomeView':
                    exitApp();
                    break;
                case '#loginView':
                    console.log('Going back to public home...');
                    app.displayNextView('#publicHomeView');
                    break;
                case '#homeView':
                    exitApp();
                    break;
                case '#rememberNotificationView':
                    goHome();
                    break;
                case '#changePasswordView':
                    goHome();
                    app.views.changePassword.reset();
            }
        }, false);

        if (properties.mock.device) {
            this.onDeviceReady();
        }
    };

    /**
     * Event handler for deviceready event.
     */
    var onDeviceReady = function () {
        console.log('Executing onDeviceReady function...');

        $viewsTab = $('#viewsTab');

        /**
         * Configure Google Analytics.
         *
         * This implementation is now using CMackay Google Analytics Plugin for Android and iOS: https://github.com/cmackay/google-analytics-plugin
         */
        (function () {
            analytics.api = navigator.analytics;
            analytics.execute = {};
            analytics.execute.sendScreenView = function (pageName) {
                if (analytics.api) {
                    analytics.api.sendAppView(pageName, function () {
                        //  onSuccess
                        console.log('Added Google Analytics page view for: ' + pageName);
                    }, function (error) {
                        //  onError
                        console.log('Error while sending Google Analytics page view for: ' + pageName + '; Error: ' + error);
                    });
                } else {
                    handleGoogleAnalyticsConfigurationError(analytics.api);
                }
            };
            analytics.execute.sendEvent = function (category, action, label) {

                var concatParameters = function () {
                    return 'category: ' + category + '; action: ' + action + '; label: ' + label;
                };

                analytics.api.sendEvent(category, action, label, undefined, function () {
                    console.log('Analytics event sent, ' + concatParameters());
                }, function (error) {
                    console.log('Analytics event ' + concatParameters() + ' sent failed, error: ' + error);
                });

            };

            if (analytics.api) {
                analytics.api.setTrackingId(GOOGLE_ANALYTICS_TRACKING_ID);

                analytics.keys = Object.freeze({
                                                   CATEGORY_SECTIONS: 'Secciones',
                                                   CATEGORY_ACTIONS: 'Acciones',
                                                   ACTION_OPEN: 'Abrir',
                                                   ACTION_CALL_OFFICE: 'Llamar consulta',
                                                   ACTION_SEND_MAIL: 'Enviar email',
                                                   ACTION_VIEW_MAP: 'Ver mapa',
                                                   ACTION_VIEW_WEB: 'Ver web'
                                               });
            } else {
                handleGoogleAnalyticsConfigurationError(analytics.api);
            }
        }());

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
                if (properties.mock.loggedUser) {
                    localStorage.setItem(PATIENT_KEY, JSON.stringify(properties.mockData.patient));
                }

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
                app.displayNextView('#rememberNotificationView', result, true);
            } else {
                result = checkForLoggedUser();
                if (result) {
                    console.log('Displaying home view because the user is already logged.');
                    app.displayNextView('#homeView');
                } else {
                    console.log('Displaying public home...');
                    app.displayNextView('#publicHomeView');
                }
            }
        }());

        if (!properties.mock.device) {

            /**
             * Initialize background service
             */
            (function () {
                var updateNotificationsHandler = function (data) {
                    var fromCommaSeparatedToArray = function (eachRemember) {

                        if (typeof eachRemember.treatments === 'string') {
                            eachRemember.treatments = eachRemember.treatments.split(',');
                        }

                        return eachRemember;
                    };

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
                                patient.remembers = remembers.map(fromCommaSeparatedToArray);
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
        }

        app.views.changePassword.init();
    };

    var displayNextView = function (selector, remember, startingFromNotification) {
        console.log('Displaying next view: ' + selector);
        switch (selector) {
            case '#publicHomeView':
                analytics.execute.sendScreenView('home (public)');
                app.views.publicHome.init();
                break;
            case '#loginView':
                analytics.execute.sendScreenView('login');
                app.views.login.init();
                break;
            case '#homeView':
                analytics.execute.sendScreenView('home');
                if (!app.views.home.isInitialised()) {
                    app.views.home.init();
                }
                break;
            case '#rememberNotificationView':
                analytics.execute.sendScreenView('rememberNotification');
                app.views.rememberNotification.render(remember, startingFromNotification);
                break;
            case '#changePasswordView':
                analytics.execute.sendScreenView('changePassword');
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