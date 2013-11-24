define(['backbone', 'underscore', 'templates', 'log', 'cookies'], function (Backbone, _, JST, log, Cookies) {
    return Backbone.View.extend({
        template: JST['player'],
        events: {
            'click .js-player__play': 'onPlay',
            'click .js-player__pause': 'onPause',
            'click .js-player__volume-up': 'onVolumeUp',
            'click .js-player__volume-down': 'onVolumeDown',
            'click .js-player__next': 'onNext',
            'click .js-player__prev': 'onPrev'
        },

        songs: [],
        current: 0,
        audio: null,

        initialize: function () {
            var self = this;
            window.jukebox.socket.get('/song', {limit: 20, where: {
                artist: 'Daft Punk'
            }}, function (list) {
                self.songs = list;
                self.setSong(list[0]);
            });
        },
        render: function () {
            var self = this;
            this.el.innerHTML = this.template();
            this.delegateEvents();

            this.audio = this.$el.find('audio')[0];
            this.audio.addEventListener("ended", function () {
                self.audio.currentTime = 0;
                self.next();
            });
            var volumeFromCookie = Cookies.get('volume');
            if (volumeFromCookie) {
                this.setVolume(volumeFromCookie);
            }
            return this;
        },

        onNext: function (e) {
            this.next();

            e.preventDefault(e);
        },

        next: function () {
            var song = this.songs[++this.current];
            if (song) {
                this.setSong(song);
                this.play();
            }

            return this;
        },

        onPause: function (e) {
            this.audio.pause();
            e.preventDefault();
        },

        onPlay: function (e) {
            this.play();
            e.preventDefault();
        },

        play: function (song) {
            if (song) {
                this.setSong(song);
            }

            this.audio.play();
        },
        setSong: function (song) {
            this.audio.src = 'http://' + window.location.hostname + ':3000' + song.uri;
            this.$el.find('.js-player__info')[0].innerText = song.artist + ' - ' + song.title;
        },

        onVolumeUp: function (e) {
            this.setVolume(Math.min(this.audio.volume += 0.1, 1));
            e.preventDefault();
        },

        onVolumeDown: function (e) {
            this.setVolume(Math.max(this.audio.volume -= 0.1, 0));
            e.preventDefault();
        },

        setVolume: function (vol) {
            if (vol > 1 || vol < 0) {
                console.log(vol);
                log.warn('Volume set is out of 0..1 range: %s', vol);
                return;
            }

            vol = Math.round(vol * Math.pow(10, 3)) / Math.pow(10, 3);
            Cookies.set('volume', vol);
            console.log('Volume set to %f', vol);
            this.audio.volume = vol;
        }


    });

});