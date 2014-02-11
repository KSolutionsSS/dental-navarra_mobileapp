var urlJson = 'https://spreadsheets.google.com/feeds/cells/' + PROMOTIONS_GOOGLE_SPREADSHEET_KEY + '/1/public/basic?alt=json';

var offices = {
    tafalla: {
        name: "Clínica Odontológica Tafalla",
        street: "C/ Diputación Foral, 4,1 A.",
        city: "Tafalla",
        postalCode: 31300,
        phoneNumber: "948 755 169",
        email: "tafalla@dentalnavarra.com"
    },
    alsasua: {
        name: 'Clínica Dental Alsasua',
        street: 'C/ Alzania, 1, A.',
        city: 'Alsasua',
        postalCode: 31800,
        phoneNumber: '948 468 232',
        email: 'alsasua@dentalnavarra.com'
    },
    milagro: {
        name: 'Clínica Dental Milagro',
        street: 'C/ Navas de Tolosa, 4 bajo.',
        city: 'Milagro',
        postalCode: 31120,
        phoneNumber: '948 861 231',
        email: 'milagro@dentalnavarra.com'
    }
};

var app = app || {};
app.views = app.views || {};

app.views.home = (function () {

    var loadRemembers = function () {
        var expandRemember = function (event) {
            $liSpan = $(event.target);

            var endDate = $liSpan.find('.badge').html();
            var message = $liSpan.text();

            app.displayNextView('#rememberNotificationView', message, endDate);
        };

        var $container = $('#notifications').empty();
        if (patient.remembers) {
            console.log('Obtained: ' + patient.remembers.length + ' remembers about treatments.');

            $container.append($('#notificationTemplate').render({notifications: patient.remembers}));
            $container.find('li').click(expandRemember);
        } else {
            console.log('There is no remembers to display to the user, showing a message');
            $container.empty().html('<div class="alert alert-info">\n    Parece que usted a&uacute;n no tiene recordatorios.\n</div>');
        }
    };

    return {
        init: function (patient) {

            var loadPromotions = function () {
                console.log('Loading promotions...');

                var $container = $('#promotions');

                googleDocsSimpleParser.parseSpreadsheetCellsUrl({
                                                                    url: urlJson,
                                                                    done: function (promotions) {
                                                                        var renderPromotions = function (promotions, container) {
                                                                            $.templates({
                                                                                            promotions: {
                                                                                                markup: "#promotionTemplate",
                                                                                                helpers: {
                                                                                                    calculateEndDate: function (numberOfWeeks) {
                                                                                                        var now = new Date();
                                                                                                        now.setDate(now.getDate() + numberOfWeeks
                                                                                                            * 7);

                                                                                                        return now.getDate() + '/' + (now.getMonth()
                                                                                                            + 1) + '/' + now.getFullYear();
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        });

                                                                            container.html($.render.promotions({promotions: promotions}));
                                                                        };

                                                                        console.log('Obtained: ' + promotions.length + ' promotions.');
                                                                        renderPromotions(promotions, $container);
                                                                    },
                                                                    fail: function (jqXHR, textStatus, errorThrown) {
                                                                        console.log('There was an error getting promotions: ' + jqXHR.status
                                                                                        + '. Text: ' + textStatus);
                                                                        $container.empty().html('<div class="alert alert-danger">\n    Disculpe, no se pudieron cargar las promociones en este momento. Intente de nuevo m&aacute;s tarde.\n</div>');
                                                                    }
                                                                });
            };

            var renderContactTab = function () {
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

                        $('#contactInformation').html($('#contactInformationTemplate').render(patient.office));
                    } else {
                        console.log('Can\'t display office information, an error ocurred while looking for patient.office: ' + patient.office);
                    }
                } else {
                    console.log('Contact information should be already visible');
                }
            };

            //  TODO : Delete this line or context.
//    patient.remembers = [
//        {message: 'Tienes que hacerte el segundo implante.', endDate: '01/03/2014'},
//        {message: 'deberías concurrir para un control general.', endDate: '01/03/2014'}
//    ];
//    localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));

            loadRemembers();
            loadPromotions();
            renderContactTab();
        },
        updateRemembers: function () {
            loadRemembers();
        }
    };
}());