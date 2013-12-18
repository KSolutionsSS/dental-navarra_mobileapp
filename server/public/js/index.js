$(document).ready(function () {

    var addMeetingForm = (function () {

        return {
            init: function () {

                $.getJSON('/patients', function (data) {

                    var values = data.map(app.domain.patient.generateFullName);

                    $('#addMeetingFormName').typeahead({
                                                           name: 'patients',
                                                           local: values,
                                                           template: '<p><i class="glyphicon glyphicon-user"></i>{{value}}</p>',
                                                           engine: Hogan,
                                                       });
                });


                $.getJSON('/treatments', function (data) {

                    var values = data.map(function (each) {
                        return each.description;
                    });

                    $('#addMeetingFormTreatment').typeahead({
                                                                name: 'treatments',
                                                                valueKey: 'description',
                                                                local: values,
                                                                template: '<p><i class="fa fa-stethoscope"></i>{{description}}</p>',
                                                                engine: Hogan,
                                                                limit: 10
                                                            });
                });

            }
        };
    }());

    addMeetingForm.init();

});