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

var urlJson = 'https://spreadsheets.google.com/feeds/cells/' + PROMOTIONS_GOOGLE_SPREADSHEET_KEY + '/1/public/basic?alt=json';

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

var patient = patient || {};
var analytics = analytics || {};

var app = app || {};
app.views = app.views || {};

app.views.home = (function () {

    var isInitialised;

    var sections = (function () {

        var contact = (function () {
            var $contactTab;

            var render = function (callback) {
                var officeName;
                var eachAttribute;

                if (typeof patient.office === 'string') {
                    console.log('Looking for patient.office: ' + patient.office);

                    for (eachAttribute in offices) {
                        if (offices.hasOwnProperty(eachAttribute)) {
                            if (patient.office === eachAttribute) {
                                officeName = eachAttribute;
                                break;
                            }
                        }
                    }

                    if (officeName) {
                        console.log('Storing office information: ' + officeName);

                        patient.office = offices[officeName];
                        localStorage.setItem('patient', JSON.stringify(patient));
                    } else {
                        console.log('Can\'t display office information, an error ocurred while looking for patient.office: ' + patient.office);
                    }
                }

                $contactTab = $('#contactInformation');
                $contactTab.html($('#contactInformationTemplate').render(patient.office));

                callback();
            };

            var bindEvents = function () {
                if (analytics.api) {
                    var onClick = analytics.execute.sendEvent.bind(undefined, analytics.keys.CATEGORY_ACTIONS, analytics.keys.ACTION_VIEW_MAP,
                                                                   patient.office.city);
                    $contactTab.find('a[href^=geo]').click(onClick);


                    onClick = analytics.execute.sendEvent.bind(undefined, analytics.keys.CATEGORY_ACTIONS, analytics.keys.ACTION_CALL_OFFICE,
                                                               patient.office.city);
                    $contactTab.find('a[href^=tel]').click(onClick);


                    onClick = analytics.execute.sendEvent.bind(undefined, analytics.keys.CATEGORY_ACTIONS, analytics.keys.ACTION_SEND_MAIL,
                                                               patient.office.city);
                    $contactTab.find('a[href^=mailto]').click(onClick);


                    onClick = analytics.execute.sendEvent.bind(undefined, analytics.keys.CATEGORY_ACTIONS, analytics.keys.ACTION_VIEW_WEB, undefined);
                    $contactTab.find('a[href^=http]').click(onClick);
                }
            };

            return {
                init: function () {
                    render(bindEvents);
                }
            };
        }());

        var remembers = (function () {
            var loadRemembers = function () {
                var expandRemember = function (remembers, event) {
                    var $li = $(event.target).parent();

                    var meetingDate = $li.attr('data-meetingDate');
                    var remember = remembers.filter(function (each) {
                        return each.meetingDate === meetingDate;
                    })[0];

                    app.displayNextView('#rememberNotificationView', remember);
                };

                var $container = $('#notifications').empty();
                $container.append($.render.remembers({remembers: patient.remembers || []}));
                if (patient.remembers) {
                    $container.find('li').click(expandRemember.bind(undefined, patient.remembers));
                }
            };

            return {
                load: loadRemembers
            };
        }());

        var promotions = (function () {
            var loadPromotions = function () {
                console.log('Loading promotions...');

                var $container = $('#promotions');

                var googleDocsSimpleParserConfiguration = {
                    url: urlJson,
                    done: function (promotions) {
                        console.log('Obtained: ' + promotions.length + ' promotions.');

                        $container.html($.render.promotions({
                                                                promotions: modules.patient.getPersonalizedPromotions(patient, promotions)
                                                            }));
                    },
                    fail: function (jqXHR, textStatus, errorThrown) {
                        console.log('There was an error getting promotions: ' + jqXHR.status + '. Text: ' + textStatus);
                        $container.empty().html('<div class="alert alert-danger">\n    Disculpe, no se pudieron cargar las promociones en este momento. Intente de nuevo m&aacute;s tarde.\n</div>');
                    }
                };

                googleDocsSimpleParser.parseSpreadsheetCellsUrl(googleDocsSimpleParserConfiguration);
            };

            return {
                load: loadPromotions
            };
        }());

        var settings = (function () {
            var bindEvents = function () {
                var $settings = $('#settings');
                $settings.find('button:nth-child(1)').click(function (event) {
                    app.displayNextView('#changePasswordView');
                });
            };

            return {
                init: function () {
                    bindEvents();
                }
            };
        }());

        return {
            contact: contact,
            remembers: remembers,
            promotions: promotions,
            settings: settings
        };
    }());

    return {
        init: function () {

            var bindAnalyticsScreenViewEvents = function () {
                if (analytics.api) {
                    $('a.panel-title').click(function (event) {
                        var href = event.currentTarget.href;
                        href = href.substring(href.lastIndexOf('#'));

                        var label;
                        switch (href) {
                            case '#panel-notifications':
                                label = "Recordatorios";
                                break;
                            case '#panel-promotions':
                                label = "Promociones";
                                break;
                            case '#panel-settings':
                                label = "Configuración";
                                break;
                            case '#panel-contact':
                                label = "Contacto";
                                break;
                        }

                        analytics.execute.sendEvent(analytics.keys.CATEGORY_SECTIONS, analytics.keys.ACTION_OPEN, label);
                    });
                }
            };

            //  TODO : Delete this line or context. It's used when testing from desktop browser.
//            patient.remembers = [
//                {message: 'Tienes que hacerte el segundo implante.', meetingDate: '01/03/2014'},
//                {message: 'deberías concurrir para un control general.', meetingDate: '01/03/2014'}
//            ];
//            localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));

            sections.remembers.load();
            sections.promotions.load();
            sections.contact.init();
            sections.settings.init();

            bindAnalyticsScreenViewEvents();

            isInitialised = true;
        },
        updateRemembers: function () {
            sections.remembers.load();
        },
        isInitialised: function () {
            console.log('isInitialised: ' + isInitialised);
            return isInitialised;
        },
        checkForNewPromotions: sections.promotions.load()
    };
}());