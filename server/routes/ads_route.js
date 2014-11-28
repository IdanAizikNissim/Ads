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

	// Offset and limit
	filtered = adsOffsetAndLimit(filtered, offset, limit);

	res.send(filtered);
};

exports.getByStationIdNow = function(req, res) {
	var limit = req.query.limit;
	var offset = req.query.offset;
	var stationId = req.params.id;

	// Filtering ads by station id
	var filtered = model.ads.ads.filter(function(ad) {
		return utils.containsId(ad.stations, stationId);
	});

	// Filter by timeFrame
	var filtered = filtered.filter(function(ad) {
		return adTimeFrameIsNow(ad);
	});

	// Offset and limit
	filtered = adsOffsetAndLimit(filtered, offset, limit);

	res.send(filtered);
};

exports.getAll = function(req, res) {
	res.send(model.ads);
};

var adsOffsetAndLimit = function(ads, offset, limit) {
	// offset 
	if (offset) {
		ads = ads.slice(offset, ads.length);
	}

	// limit
	if (limit) {
		ads = ads.slice(0, limit);
	}

	return ads;
};

// Check if current time is in ad's timeFrame
var adTimeFrameIsNow = function(ad) {
	var inTimeFrame = false;
	var time;

	// Get current time
	var now = new Date();

	// Checking if day of week defined
	if (ad.timeFrame.days) {
		// If today not exist in days of week
		ad.timeFrame.days.forEach(function(day) {
			if (now.getDay() == day.day) {
				inTimeFrame = true;
				time = day.time;
			}
		});
	}

	// Check if day isnt date timeline
	if (inTimeFrame && ad.timeFrame.date) {
		if (!(now.getTime() >= new Date(ad.timeFrame.date.start).getTime() &&
			now.getTime() <= new Date(ad.timeFrame.date.end).getTime())) {
			inTimeFrame = false;
		}
	}

	// Check if time isnt time timeline
	if (inTimeFrame && time) {
		if (!(now.getHours() >= new Date(time.start).getHours() &&
			now.getHours() <= new Date(time.end).getHours())) {
			inTimeFrame = false;
		}
	}

	return inTimeFrame;
};