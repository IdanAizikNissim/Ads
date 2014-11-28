var model = require('../models/station.js');

exports.getAll = function(req, res) {
	res.send(model.stations);
};

exports.getById = function(req, res) {
	var stationId = req.params.id;

	var filtered = model.stations.stations.filter(function(station) {
		return (station.id == stationId);
	});

	res.send(filtered);
};