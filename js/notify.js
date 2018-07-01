// 0. Enqueue
// 1. Host Change
// 2. Empty Queue
// 3. Beta Message

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

// Change Host (1)
socket.on('changeHostNotify', function(data) {
    console.log("Host Change Notify Alert")
    var user = data.user

    $.notify({
        title: '<strong>Host Changed: </strong>',
        icon: 'fas fa-users',
        message: user + " is now the host."
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
    });
})

// Empty Queue (2)
socket.on('emptyQueueNotify', function(data) {
    console.log("Empty Queue Notify Alert")
    var user = data.user

    $.notify({
        title: '<strong>' + user + '</strong>',
        icon: 'fas fa-trash',
        message: "emptied the queue"
    }, {
        type: 'warning',
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
    });
})

// Beta Message (3)
socket.on('betaNotify', function(data) {
    console.log("Beta Notify Alert")

    $.notify({
        title: '<strong>Warning: </strong>',
        icon: 'fas fa-trash',
        message: "HTML5 Player is in beta. It does not work 100% with more than 2 people."
    }, {
        type: 'warning',
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
    });
})

//------------------------------------------------------------------------------
// Not part of the server function
//------------------------------------------------------------------------------


// Made into its own function to reduce spam
// When pressing sync button
function syncAlert() {
    // Sync notify
    $.notify({
        title: '<strong>Sync: </strong>',
        icon: 'fas fa-users',
        message: " The room is now synced with you"
    }, {
        type: 'success',
        delay: 400,
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
}

// When user gets out of sync from the host
function disconnectedAlert() {
    $.notify({
        title: '<strong>Warning: </strong>',
        icon: 'fas fa-users',
        message: " You are now out of sync of the host"
    }, {
        type: 'danger',
        delay: 400,
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
}

// When playNext is called
function playNextAlert() {
    $.notify({
        title: '<strong>Queue</strong>',
        icon: 'fas fa-list-alt',
        message: " is empty!"
    }, {
        type: 'warning',
        delay: 400,
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
    });
}

// When user enters a url, but the url is invalid
function invalidURL() {
    $.notify({
        title: '<strong>Error: </strong>',
        icon: 'fas fa-id-card',
        message: "Entered invalid video url"
    }, {
        type: 'danger',
        delay: 400,
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
}

function betaAlert() {
    $.notify({
        title: '<strong>Warning: </strong>',
        icon: 'fas fa-trash',
        message: "HTML5 Player is in beta. It does not work 100% with long videos"
    }, {
        type: 'warning',
        delay: 3200,
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
}
