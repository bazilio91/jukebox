// Start sails and pass it command line arguments
var connect = require('connect');
require('sails').lift(require('optimist').argv);


var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('/Users/bazilio/Music'))
    .listen(3000);