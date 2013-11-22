var crypto = require('crypto');
/**
 * @class Song
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        provider: {
            type: 'String',
            required: true
        },
        uri: {
            type: 'String',
            required: true
        },
        title: {
            type: 'String',
            required: true
        },
        artist: {
            type: 'String',
            required: true
        },
        album: 'String',
        hash: {
            type: 'String',
            required: true
        }

    },
    beforeValidation: function (values, next) {
        values.hash = crypto.createHash('md5').update(values.artist + values.title).digest('hex');
        next();
    }

};
