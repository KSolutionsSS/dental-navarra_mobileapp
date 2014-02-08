var urlJson = 'https://spreadsheets.google.com/feeds/cells/0AqAWn1xLDRvPdDA1Y1liWHI2LUdnS2VhR1V6SHVkUVE/1/public/basic?alt=json';

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


$(document).ready(function () {


    var loadRemembers = function (patient) {
        var expandRemember = function (event) {
            console.dir(event);
            var endDate = event.target.childNodes[0].childNodes[0].data;
            var message = event.target.childNodes[1].data;

            location.href = 'rememberNotification.html?message=' + message + '&endDate=' + endDate;
        };

        var list = [];
        if (patient.remembers) {
            console.log('Obtained: ' + patient.remembers.length + ' remembers about treatments.');
            list = patient.remembers;
        } else {
            console.log('0 remembers obtained from local storage.');
        }

        var $container = $('#notifications').empty();

        // TODO : Unhard-code this 'cuz if for testing
//        if (list.length === 0) {
//            list = [
//                {message: 'Te hiciste un tratamiento de limpieza hace 5 meses, tendrías que hacerte otro dentro de 1 mes.', endDate: '01/03/2014'},
//                {message: 'Tienes que hacerte un control radiográfico dentro de 1 mes.', endDate: '01/03/2014'},
//                {message: 'Tienes que hacerte el segundo implante.', endDate: '01/03/2014'},
//                {message: 'Deberías concurrir para un control general.', endDate: '01/03/2014'}
//            ];
//        }

        if (list.length > 0) {
            $container.append($('#notificationTemplate').render({notifications: list}));
            $container.find('li').click(expandRemember);
        } else {
            console.log('There is no remembers to display to the user, showing a message');
            $container.empty().html('<div class="alert alert-info">\n    Parece que usted a&uacute;n no tiene recordatorios.\n</div>');
        }
    };

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
                                                                                                now.setDate(now.getDate() + numberOfWeeks * 7);

                                                                                                return now.getDate() + '/' + (now.getMonth() + 1)
                                                                                                           + '/' + now.getFullYear();
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
                                                                console.log('There was an error getting promotions: ' + jqXHR.status + '. Text: '
                                                                                + textStatus);
                                                                $container.empty().html('<div class="alert alert-danger">\n    Disculpe, no se pudieron cargar las promociones en este momento. Intente de nuevo m&aacute;s tarde.\n</div>');
                                                            }
                                                        });
    };

    var renderContactTab = function (patient) {
        var officeName;
        var eachAttribute;
        for (eachAttribute in offices) {
            if (offices.hasOwnProperty(eachAttribute)) {
                if (patient.office === eachAttribute) {
                    officeName = eachAttribute;
                    break;
                }
            }
        }

        console.log('Storing office information: ' + officeName);

        patient.office = offices[officeName];
        localStorage.setItem('patient', JSON.stringify(patient));

        $('#contactInformation').append($('#contactInformationTemplate').render(patient.office));
    };

    var patient = JSON.parse(localStorage.getItem('patient'));
    loadRemembers(patient);
    loadPromotions();
    renderContactTab(patient);
});