cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice/www/backgroundservice.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.BackgroundService",
        "clobbers": [
            "window.plugins.BackgroundServices"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.red_folder.phonegap.plugin.backgroundservice": "3.3",
    "org.apache.cordova.dialogs": "0.2.5",
    "org.apache.cordova.vibration": "0.3.6"
}
// BOTTOM OF METADATA
});