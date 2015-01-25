$(function() {
    $('#validate').on('click', function() {
        var validationErrors = $('#form').validate();
        if (validationErrors)
            console.log (validationErrors);
        else
            console.log ('success')
    });
})