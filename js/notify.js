// Enqueue Notify (0)
socket.on('enqueueNotify', function(data) {
    console.log("Enqueue Notify Alert")
    var title = data.title
    var user = data.user
    // Generate notify alert
    $.notify({
        title: '<strong>' + user + '</strong>',
        icon: 'fas fa-plus',
        message: 'added ' + title + ' to the queue'
    }, {
        type: 'info',
        delay: 800,
        animate: {
            enter: 'animated fadeInUp',
            exit: 'animated fadeOutRight'
        },
        placement: {
            from: "bottom",
            align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
    })
})
