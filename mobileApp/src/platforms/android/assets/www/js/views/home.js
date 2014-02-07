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


    var loadNotifications = function (patient) {
        console.log('Loading notifications about treatments...');

        var $container = $('#notifications');
        $.ajax({
                   url: 'http://localhost:8081/patients/' + patient._id + '/notifications',
                   type: 'GET'
               }).done(function (notifications) {
                           var expandNotification = function (event) {
                               console.dir(event);
                               var endDate = event.target.childNodes[0].childNodes[0].data;
                               var message = event.target.childNodes[1].data;

                               location.href = 'rememberNotification.html?message=' + message + '&endDate=' + endDate;
                           };

                           console.log('Obtained: ' + notifications.length + ' notifications.');

                           $container.empty().append($('#notificationTemplate').render({notifications: notifications}));
                           $container.find('li').click(expandNotification);
                       }).fail(function (jqXHR, textStatus, errorThrown) {
                                   console.log('There was an error getting user notifications: ' + jqXHR.status + '. Text: ' + textStatus);
                                   $container.empty().html('<div class="alert alert-danger">\n    Disculpe, no se pudieron cargar las notificaciones en este momento. Intente de nuevo m&aacute;s tarde.\n</div>');

                                   // TODO : Unhard-code this.
                                   var dummyNotifications = [
                                       {message: 'Te hiciste un tratamiento de limpieza hace 5 meses, tendrías que hacerte otro dentro de 1 mes.', endDate: '01/03/2014'},
                                       {message: 'Tienes que hacerte un control radiográfico dentro de 1 mes.', endDate: '01/03/2014'},
                                       {message: 'Tienes que hacerte el segundo implante.', endDate: '01/03/2014'},
                                       {message: 'Deberías concurrir para un control general.', endDate: '01/03/2014'}
                                   ];
                                   $container.append($('#notificationTemplate').render({notifications: dummyNotifications}));
                                   $container.find('li').click(function (event) {
                                       console.dir(event);
                                       var endDate = event.target.childNodes[0].childNodes[0].data;
                                       var message = event.target.childNodes[1].data;

                                       location.href = 'rememberNotification.html?message=' + message + '&endDate=' + endDate;
                                   });
                               });
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

        patient.office = offices[officeName];
        localStorage.setItem('patient', JSON.stringify(patient));

        $('#contactInformation').append($('#contactInformationTemplate').render(patient.office));
    };

    var patient = JSON.parse(localStorage.getItem('patient'));
    loadNotifications(patient);
    loadPromotions();
    renderContactTab(patient);
});