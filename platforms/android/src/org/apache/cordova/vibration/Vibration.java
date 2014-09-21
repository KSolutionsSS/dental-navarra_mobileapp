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
package org.apache.cordova.vibration;

import android.content.Context;
import android.os.Vibrator;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * This class provides access to vibration on the device.
 */
public class Vibration extends CordovaPlugin {

    /**
     * Constructor.
     */
    public Vibration() {
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action
     *         The action to execute.
     * @param args
     *         JSONArray of arguments for the plugin.
     * @param callbackContext
     *         The callback context used when calling back into JavaScript.
     *
     * @return True when the action was valid, false otherwise.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("vibrate")) {
            this.vibrate(args.getLong(0));
        } else {
            return false;
        }

        // Only alert and confirm are async.
        callbackContext.success();
        return true;
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------

    /**
     * Vibrates the device for the specified amount of time.
     *
     * @param time
     *         Time to vibrate in ms.
     */
    public void vibrate(long time) {
        // Start the vibration, 0 defaults to half a second.
        if (time == 0) {
            time = 500;
        }
        Vibrator vibrator = (Vibrator) this.cordova.getActivity().getSystemService(Context.VIBRATOR_SERVICE);
        vibrator.vibrate(time);
    }
}
