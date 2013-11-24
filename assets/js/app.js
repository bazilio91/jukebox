/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */
define(['io', 'log'], function (io, log) {

    var socket = io.connect();
    if (typeof console !== 'undefined') {
        log.trace('Connecting to Sails.js...');
    }

    socket.on('connect', function socketConnected() {
        // Listen for Comet messages from Sails
        socket.on('message', function messageReceived(message) {
            log.trace('New comet message received :: ', message);
        });
    });

    return {
        socket: socket
    }
});