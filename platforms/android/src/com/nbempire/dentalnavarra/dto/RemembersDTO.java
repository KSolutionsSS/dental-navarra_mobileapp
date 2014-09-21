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

package com.nbempire.dentalnavarra.dto;

import com.nbempire.dentalnavarra.domain.Remember;

/**
 * TODO : Javadoc for
 * <p/>
 * Created on 2/10/14, at 9:20 PM.
 *
 * @author Nahuel Barrios <barrios.nahuel@gmail.com>.
 */
public class RemembersDTO {

    private Remember[] remembers;

    public Remember[] getRemembers() {
        return remembers;
    }

    /**
     * Default constructor that initializes the remembers array to prevent {@code NullPointerException}.
     */
    public RemembersDTO() {
        this.remembers = new Remember[0];
    }
}
