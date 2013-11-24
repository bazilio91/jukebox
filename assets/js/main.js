require.config({
    shim: {
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        log4javascript: {
            exports: 'log4javascript'
        },

        sync: {
            deps: [
                'backbone'
            ]
        },
        io: {
            deps: [
                'underscore',
                'jquery',
                'socket.io'
            ],
            exports: 'io'
        },
        sailsio: {
            deps: [
                'io'
            ]
        },
        templates: {
            exports: 'JST'
        }

    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash.underscore',
        'socket.io': 'socket.io',
        'io': 'sails.io',
        log: '../bower_components/loglevel/dist/loglevel',
        cookies: '../bower_components/cookies-js/src/cookies',
        templates: 'templates'
    }
});

define(['app', 'routers/Router'], function (App, Router) {
    window.jukebox = App;
    new Router();
    Backbone.history.start({pushState: true});
});