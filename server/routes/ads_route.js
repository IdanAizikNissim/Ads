var model = require('../models/ad.js');

exports.getAdsByStationId = function(req, res) {
	var limit = req.query.limit;
	var offset = req.query.offset;
	var stationId = req.params.id

	// Filtering ads by station id
	var filtered = model.ads.ads.filter(function(ad) {
		return inStation(ad.stations, stationId);
	});

	// Limit and offset 
	if (offset && limit) {
		filtered = filtered.slice(offset, limit);
	}

	res.send(filtered);
};

exports.getAll = function(req, res) {
	res.send(model.ads);
};

// Check if ad contains station
var inStation = function(stations, id) {
	var value = false;

	stations.forEach(function(station) {
		if (station.id == id) {
			value = true;
			return;
		}
	});
	return value;
};