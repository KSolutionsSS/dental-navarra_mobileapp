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
var app = {
    // Application Constructor
    initialize: function () {

        var initializeBackgroundService = function () {
            var milliseconds = 10000;

            var retrieveNotifications = function (data) {
                console.log('Getting user notifications and saving them to local storage system...');
                //  TODO : Functionality : Get user notifications!!
            };

            var onError = function (error) {
                alert("Error: " + error.ErrorMessage);
                alert(JSON.stringify(error));
            };

            var myService = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');

            myService.getStatus(function (data) {
                if (!data.ServiceRunning) {
                    myService.registerForUpdates(retrieveNotifications, onError);

                    myService.startService(function (data) {
                        console.log('Background service started');

                        myService.enableTimer(milliseconds, function (data) {
                            console.log('Timer started (ms):' + milliseconds);
                        });

                        myService.registerForBootStart(function (data) {
                            console.log('Background service registered for boot start');
                        }, onError);
                    }, onError);
                }
            }, onError);

//            function deregisterForBootStart() {
//                myService.deregisterForBootStart(function (r) {
//                    console.log('deregisterForBootStart called ok');
//                }, onError);
//            }
//            function setConfig() {
//                var helloToTxt = document.getElementById("helloToTxt");
//                var helloToString = helloToTxt.value;
//                var config = {
//                    "HelloTo": helloToString
//                };
//                myService.setConfiguration(config, function (r) {
//                    console.log('setConfig called ok');
//                }, onError);
//            }
        };

        initializeBackgroundService();

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $('form').submit(function (event) {
            //  TODO : Functionality : Fix this hard-coded functionality
            event.preventDefault();
            location.href = 'views/home.html';
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};