var connect = require('connect');
var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('/Users/bazilio/Music'))
    .listen(3000);