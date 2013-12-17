$(document).ready(function () {

    $('#addMeetingFormName').typeahead({
                                           name: 'patients',
                                           local: [
                                               'Nahuel Barrios', 'Gustavo Vignolo', 'Claudia Safranchik', 'Anahi Barrios', 'Patricia Safranchik',
                                               'Nicolas Vignolo', 'Carolina Vignolo', 'Paola Safranchik', 'Cristian Caputto'
                                           ],
                                           limit: 10
                                       });

    $('#addMeetingFormTreatment').typeahead({
                                                name: 'treatments',
                                                local: [
                                                    'Limpieza', 'Implante', 'Consulta periódica'
                                                ],
                                                limit: 10
                                            });

});