var fs = require('fs'),
    _ = require('lodash'),
    probe = require('node-ffprobe'),
    async = require('async'),
    sails = require('sails'),
    crypto = require('crypto');

var walk = function (dir, options, done) {
    options = _.extend({
        supportedExtensions: []
    }, options);

    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, options, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    _.each(options.supportedExtensions, function (ext) {
                        ext = '.' + ext;
                        if (file.indexOf(ext, this.length - ext.length) !== -1) {
                            results.push(file);
                        }
                    });

                    if (!--pending) {
                        done(null, results);
                    }

                }
            });
        });
    });
};

var getInfo = function (target, cb) {
    if (!_.isArray(target)) {
        target = [target];
    }
    async.mapLimit(target, 500, probe, function (err, results) {
        cb(err, results);
    });
};

var Indexer = function () {
    return {
        supportedExtensions: ['mp3', 'm4a'],
        directory: '/Users/bazilio/Music',
        index: function (cb) {
            walk(this.directory, {
                supportedExtensions: this.supportedExtensions
            }, function (err, results) {
                if (err) {
                    cb(err);
                    return;
                }

                getInfo(results, function (err, results) {
                    cb(err, results);
                })
            });
        }



    }
}

var indexer = new Indexer();

sails.on('ready', function () {
    indexer.index(function (err, res) {
        async.eachLimit(res, 10, function (info, done) {
            if (!info.metadata.artist || !info.metadata.title) {
                done();
                return;
            }

            Song.findOne({ hash: crypto.createHash('md5').update(info.metadata.artist + info.metadata.title).digest('hex')})
                .exec(function (err, song) {
                    if(err) {
                        console.log(err);
                    }
                    if (song) {
                        done();
                        return;
                    }

                    Song.create({
                        provider: 'fs',
                        uri: info.file.replace(indexer.directory, ""),
                        title: info.metadata.title,
                        artist: info.metadata.artist,
                        album: info.metadata.album

                    }).done(function (err) {
                            if (err) {
                                console.log(err);
                            }
                            done();
                        }
                    );
                }
            );
        }, function () {
            console.log('done!');
        })
    });
});


sails.load(function () {
    sails.initialize();
});




