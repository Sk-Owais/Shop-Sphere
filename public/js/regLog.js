$(document).ready(() => {
    $('#register').click(() => {
        $('#first-div').show()
        $('#second-div').hide()
    })

    $('#login').click(() => {
        $('#first-div').hide()
        $('#second-div').show()
    })

    $('#second-div').hide()

})

