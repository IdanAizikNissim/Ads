var model = require('../models/ad.js');
var utils = require('../utils/utils.js');

exports.getByStationId = function(req, res) {
	var limit = req.query.limit;
	var offset = req.query.offset;
	var stationId = req.params.id;

	// Filtering ads by station id
	var filtered = model.ads.ads.filter(function(ad) {
		return utils.containsId(ad.stations, stationId);
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