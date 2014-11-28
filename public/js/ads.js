// Ad object
var Ad =function(name, templateUrl, displayDuration, texts, images, timeFrame) {
	this.name = name;
	this.texts = texts;
	this.images = images;
	this.templateUrl = templateUrl;
	this.displayDuration = displayDuration;
	this.timeFrame = timeFrame;

	this.addImage = function(image) {
		this.images.push(image);
	};

	this.addText = function(text) {
		this.texts.push(text);
	};

	this.startTimer = function() {
		var timer = window.setInterval(function () {
			window.clearInterval(timer);
			nextAd();
		}, this.displayDuration * 1000);
	}
};

// TimeFrame object
var TimeFrame = function(date, days) {
	this.date = date;
	this.days = days;
};

// DateTimeFrame object
var DateTimeFrame = function(start, end) {
	this.start = start;
	this.end = end;
};

// DayTimeFrame object
var DayTimeFrame = function(day, time) {
	this.day = day;
	this.time = time;
};

// Convert json ad to Ad object (w/ methods)
var adJsonToAd = function(adJson) {
	var texts = [];
	var images = [];

	// Get texts
	adJson.texts.forEach(function(text) {
		texts.push(text.text);
	});

	// Get images
	adJson.images.forEach(function(image) {
		images.push(image.url);
	});
	
	// Get timeFrame
	var days = [];

	// Get days
	adJson.timeFrame.days.forEach(function(day) {
		days.push(new DayTimeFrame(
			day.day, 
			new DateTimeFrame(new Date(day.time.start), new Date(day.time.end))
		));
	});

	var timeFrame = new TimeFrame(
		new DateTimeFrame(new Date(adJson.timeFrame.date.start), new Date(adJson.timeFrame.date.end)),
		days
	);

	return new Ad(adJson.name, adJson.templateUrl, adJson.displayDuration, texts, images, timeFrame);
};

var offset = 0;

// Doc ready
$(document).ready(function() {
	// Get screen params
	var screenId = getURLParameter('station');
	if (screenId) {
		// Append template div for ads
		$('<div/>', {
			'id': 'template'
		}).appendTo('body');

		// Get station's ads and render
		getAds(screenId, true, offset++, 1, renderAds, false);
	} else {
		// Get stations (screens) and render
		getStations();
	}
});

var getStations = function() {
	$.getJSON('/stations', function(data) {
		var stations = [];
		$.each(data['stations'], function(key, station) {
			stations.push("<div class='station' id='" + station.id + "'><a href='/screen/" + station.id + "'>"
				+ station.name + "</a></div>");
		});

		$('<div/>', {
			'class': 'stations',
			html: stations.join('')
		}).appendTo('body')
	});
};

var getAds = function(stationId, now, offset, limit, callback, callbackParam) {
	var url = '/ads/station/' + stationId;

	// If current time ads
	if (now) {
		url += '/now'
	}

	// Offset
	if (offset != undefined) {
		url += '?offset=' + offset;
	}

	// Limit
	if (limit != undefined) {
		url += (offset != undefined) ? '&' : '?';
		url += 'limit=' + limit;
	}

	console.log('Request for ads at: ' + url);

	$.getJSON(url, function(data) {
		// Call callback with data
		callback(data, callbackParam);
	});
};

var renderAds = function(ads, doShouldRender) {
	ads.forEach(function(ad) {
		// Covert adJson
		ad = adJsonToAd(ad);

		// Check if should render
		var render = doShouldRender ? shouldRender(ad) : true;

		if (render) {
			console.log('render: ' + ad.name);
			renderAd(ad);
			return;
		}
	});
}

// Load ad template
// Render images and text to template
var renderAd = function(ad) {
	$("#template").load(ad.templateUrl, function(responseText, textStatus, req) {
		// Check if falid to load template
		if (req.status == '404') {
			$('#template').append('<h1>Failed to load: ' + ad.templateUrl + ' template! Message: ' + req.responseText + '</h1>');
			return;
		}

  		$imagesDoms = $(".adImage");
  		// Load images
  		ad.images.forEach(function(image, index) {
  			$imagesDoms[index].src = image;
  		});

  		$textDoms = $(".adText");
  		// Load texts
  		ad.texts.forEach(function(text, index) {
  			$textDoms[index].innerText = text;
  		});

  		ad.startTimer();
	});
};

// Check if ad timeframe is now
var shouldRender = function(ad) {
	var render = false;
	var time;

	// Get current time
	var now = new Date();

	// Checking if day of week defined
	if (ad.timeFrame.days) {
		// If today not exist in days of week
		ad.timeFrame.days.forEach(function(day) {
			if (now.getDay() == day.day) {
				render = true;
				time = day.time;
			}
		});
	}
	
	// If still render -> check if day isnt date timeline
	if (render && ad.timeFrame.date) {
		if (!(now.getTime() >= ad.timeFrame.date.start.getTime() &&
			now.getTime() <= ad.timeFrame.date.end.getTime())) {
			render = false;
		}
	}

	// If still render -> check if time isnt time timeline
	if (render && time) {
		if (!(now.getHours() >= time.start.getHours() &&
			now.getHours() <= time.end.getHours())) {
			render = false;
		}
	}

	return render;
};

var nextAd = function() {
	$("#template").empty();
	getAds(getURLParameter('station'), true, offset++, 1, renderAds, false);
};

var getURLParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}