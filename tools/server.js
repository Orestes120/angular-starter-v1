/**
 * Mock server (point browser to: http://localhost:3000).
 * Uses the 'express' plug-in.
 * @author Ariel Cordoba
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    app = express(),
    config = { secret: "angularsecret" };

app.set('superSecret', config.secret);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// This is where you can add mock resources.
require('./users')(app, jwt);
// require('./dashboard')(app);
// require('./configuration')(app);
// require('./systemInfo')(app);
// require('./interfaces')(app);
// require('./alerts')(app);
// require('./ports')(app);
// //require('./portMon')(app);

// This will allow the browser to load static files under "./build"
//app.use(express.static('ui'));



// This is boilerplate server stuff.
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Mock server listening at http://localhost:%s', port);
});