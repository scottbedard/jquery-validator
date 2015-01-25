$(function() {

    $('#signup').submit(function(event) {

        var validationError = $(this).validate(1);

        if (validationError) {
            event.preventDefault()
            alert (validationError)
        }

    })

})