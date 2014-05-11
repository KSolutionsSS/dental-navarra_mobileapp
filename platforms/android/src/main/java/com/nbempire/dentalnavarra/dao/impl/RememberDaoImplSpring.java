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

package com.nbempire.dentalnavarra.dao.impl;

import android.util.Log;
import com.nbempire.dentalnavarra.dao.RememberDao;
import com.nbempire.dentalnavarra.dto.RemembersDTO;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * TODO : Javadoc for
 * <p/>
 * Created on 2/10/14, at 9:51 PM.
 *
 * @author Nahuel Barrios <barrios.nahuel@gmail.com>.
 */
public class RememberDaoImplSpring implements RememberDao {

    /**
     * Tag for class' log.
     */
    private static final String TAG = RememberDaoImplSpring.class.getSimpleName();

    @Override
    public RemembersDTO findRemembers(String patientId) {
        RestTemplate restTemplate = new RestTemplate();

        // Add a JSON converter (use GSON instead of Jackson because is a smaller library)
        restTemplate.getMessageConverters().add(new GsonHttpMessageConverter());

        String urlString = "http://desa-dentalnavarra-intranet.herokuapp.com/patients/" + patientId + "/notifications";
        Log.d(TAG, "Getting resource: " + urlString);

        RemembersDTO response = null;
        URI url = null;
        try {
            url = new URI(urlString);

            response = restTemplate.getForObject(url, RemembersDTO.class);
        } catch (URISyntaxException e) {
            Log.e(TAG, "There was an error creating the URI: " + urlString);
        } catch (RestClientException restClientException) {
            Log.e(TAG, "There was an error getting remembers from URL: " + url);
            Log.e(TAG, restClientException.getMessage());
        }

        return response != null ? response : new RemembersDTO();
    }
}
