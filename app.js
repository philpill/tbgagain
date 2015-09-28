var express = require('express'),
    app = express(),
    server = require('http').createServer(app).listen(3000),
    io = require('socket.io').listen(server),
    tbga = require('./tbga-server');

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));

app.use('/media', express.static(__dirname + '/static/media'));

app.get('/', function(req, res) {
    res.render('index');
});

tbga.init(io);
