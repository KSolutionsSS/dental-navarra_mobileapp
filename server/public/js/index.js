$(document).ready(function () {

    var patients, treatments;
    var fadeDuration = 200;

    var addMeetingForm = (function () {
        var $alertMessage = $('.alert');

        var onSubmit = function (event) {
            event.preventDefault();
            $alertMessage.fadeOut(fadeDuration);

            var patient = app.util.array.getObject(patients, function (eachPatient) {
                return app.domain.patient.generateFullName(eachPatient) === $('#addMeetingFormName').val();
            });

            var newMeeting = {
                date: new Date(), treatment: {
                    _id: app.util.array.getId(treatments, function (eachTreatment) {
                        return eachTreatment.description === $('#addMeetingFormTreatment').val();
                    })
                }
            };

            if (!patient.medicalHistory) {
                patient.medicalHistory = [];
            }
            patient.medicalHistory.push(newMeeting);

            $.ajax({
                       type: "PUT",
                       url: '/patients/' + patient._id,
                       data: patient,
                       success: function (data) {
                           $alertMessage.fadeIn(fadeDuration);
                       },
                       error: function (err) {
                           console.log('Ocurrió un error intentando actualizar el historial de un paciente:');
                           console.log(err);
                       }
                   });
        };

        return {
            init: function () {
                $alertMessage.hide();
                $alertMessage.find('button').click(function () {
                    $alertMessage.fadeOut();
                });

                $.getJSON('/patients', function (data) {

                    patients = data;
                    var values = patients.map(app.domain.patient.generateFullName);

                    $('#addMeetingFormName').typeahead({
                                                           name: 'patients',
                                                           local: values,
                                                           template: '<p><i class="glyphicon glyphicon-user"></i>{{value}}</p>',
                                                           engine: Hogan,
                                                       });
                });

                $.getJSON('/treatments', function (data) {

                    treatments = data;
                    var values = treatments.map(function (each) {
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

                $('#addMeetingForm').submit(onSubmit);
            }
        };
    }());

    var newPatientForm = (function () {

        var onSubmit = function (event) {
            event.preventDefault();

            var newPatient = {name: $('#addPatientFormName').val(), lastName: $('#addPatientFormLastName').val(), secondLastName: $('#addPatientFormSecondLastName').val(), email: $('#addPatientFormEmail').val(), age: app.util.date.getYears($('#addPatientFormBirthDate').val())};

            $.ajax({
                       type: "POST",
                       url: '/patients',
                       data: newPatient,
                       success: function (data) {
                           location.reload();
                       },
                       error: function (err) {
                           console.log('Ocurrió un error intentando crear un nuevo paciente');
                       }
                   });
        };

        return {
            init: function () {
                $('#addPatientForm').submit(onSubmit);
            }
        };
    }());

    addMeetingForm.init();

    newPatientForm.init();

});