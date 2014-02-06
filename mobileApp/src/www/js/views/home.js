var urlJson = 'https://spreadsheets.google.com/feeds/cells/0AqAWn1xLDRvPdDA1Y1liWHI2LUdnS2VhR1V6SHVkUVE/1/public/basic?alt=json';

$(document).ready(function () {


    var loadNotifications = function () {
        console.log('Loading notifications about treatments...');

        //  TODO : Functionality : Make this call dynamic
        var url = 'http://localhost:8081/patients/52ef0890ca5844de1fee3d4f/notifications';

        var $container = $('#notifications');

        $.ajax({
                   url: url,
                   type: 'GET'
               }).done(function (notifications) {
            console.log('Obtained: ' + notifications.length + ' notifications.');
            $container.empty().append($('#notificationTemplate').render({notifications: notifications}));

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('There was an error getting user notifications: ' + jqXHR.status + '. Text: ' + textStatus);
            $container.empty().html('<div class="alert alert-danger">\n    Disculpe, no se pudieron cargar las notificaciones en este momento. Intente de nuevo m&aacute;s tarde.\n</div>');
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
                                                                                        markup: '#promotionTemplate ',
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

    var renderContactTab = function () {
        var contactInformationTafalla = {
            name: 'Clínica Odontológica Tafalla',
            street: 'C/ Diputación Foral, 4,1 A.',
            city: 'Tafalla',
            postalCode: 31300,
            phoneNumber: '948 755 169',
            email: 'tafalla@dentalnavarra.com'
        };

        var contactInformationAlsasua = {
            name: 'Clínica Dental Alsasua',
            street: 'C/ Alzania, 1, A.',
            city: 'Alsasua',
            postalCode: 31800,
            phoneNumber: '948 468 232',
            email: 'alsasua@dentalnavarra.com'
        };

        var contactInformationMilagro = {
            name: 'Clínica Dental Milagro',
            street: 'C/ Navas de Tolosa, 4 bajo.',
            city: 'Milagro',
            postalCode: 31120,
            phoneNumber: '948 861 231',
            email: 'milagro@dentalnavarra.com'
        };

        //  TODO : Functionality : make this a dynamic call.
        $('#contactInformation').append($('#contactInformationTemplate').render(contactInformationAlsasua));
    };

    loadNotifications();
    loadPromotions();
    renderContactTab();

    //  TODO : Functionality : test notifications!
//    modules.notification.popUp('un mensaje', 'un titulo', 'nombre del boton');
//    modules.notification.beep(10);
//    modules.notification.vibrate(2000);
});