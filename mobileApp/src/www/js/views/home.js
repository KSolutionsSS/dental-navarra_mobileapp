var urlJson = "https://spreadsheets.google.com/feeds/cells/0AqAWn1xLDRvPdDA1Y1liWHI2LUdnS2VhR1V6SHVkUVE/1/public/basic?alt=json";

$(document).ready(function () {

    var loadPromotions = function () {
        var renderPromotions = function (promotions, container) {
            container.empty().append($('#promotionTemplate').render({promotions: promotions}));
        };

        var descriptionToUppercase = function (promotion) {
            promotion.descripcion = promotion.descripcion.toUpperCase();
            return promotion;
        };

        googleDocsSimpleParser.parseSpreadsheetCellsUrl({
                                                            url: urlJson,
                                                            done: function (people) {
                                                                renderPromotions(people, $("#promotions"));
                                                            },
                                                            transformer: descriptionToUppercase
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

//    loadPromotions();
    renderContactTab();

    //  TODO : Functionality : test notifications!
    modules.notification.popUp('un mensaje', 'un titulo', 'nombre del boton');
    modules.notification.beep(10);
    modules.notification.vibrate(2000);
});
