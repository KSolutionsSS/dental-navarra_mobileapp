package com.nbempire.dentalnavarra.dao;

import com.nbempire.dentalnavarra.dto.RemembersDTO;

/**
 * TODO : Javadoc for
 * <p/>
 * Created on 2/10/14, at 9:51 PM.
 *
 * @author Nahuel Barrios <barrios.nahuel@gmail.com>.
 */
public interface RememberDao {

    RemembersDTO findRemembers(String patientId);
}
