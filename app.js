var express = require('express');
var bodyParser = require('body-parser');
var ads = require('./server/routes/ads_route.js');
var stations = require('./server/routes/stations_route.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ######
// ROUTES
// ######
app.get('/', function (req, res) {
	res.send('index.html');
});
app.get('/screen/:screenId', function (req, res) {
	res.redirect('/index.html?station=' + req.params.screenId);
});

app.get('/stations', stations.getAll);
app.get('/stations/:id', stations.getById);
app.get('/ads', ads.getAll);
app.get('/ads/station/:id?', ads.getByStationId);

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log('Ads app listening at http://%s:%s', host, port)
})