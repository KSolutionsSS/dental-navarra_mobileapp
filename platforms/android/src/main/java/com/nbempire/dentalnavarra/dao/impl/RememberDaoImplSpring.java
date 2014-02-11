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

        String urlString = "http://dentalnavarra-intranet.herokuapp.com/patients/" + patientId + "/notifications";

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

        return response;
    }
}
