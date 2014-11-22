// Ad object
var Ad = function(name, template, duration, timeFrame) {
	this.name = name;
	this.texts = [];
	this.images = [];
	this.template = template;
	this.duration = duration;
	this.timeFrame = timeFrame;

	this.addImage = function(image) {
		this.images.push(image);
	};

	this.addText = function(text) {
		this.texts.push(text);
	};
};

// TimeFrame object
var TimeFrame = function(dateTimeFrame, daysInWeek, hourTimeFrame) {
	this.dateTimeFrame = dateTimeFrame;
	this.daysInWeek = daysInWeek;
	this.hourTimeFrame = hourTimeFrame;
};

// DateTimeFrame object
var DateTimeFrame = function(start, end) {
	this.start = start;
	this.end = end;
};

// HourTimeFrame object
var HourTimeFrame = function(start, end) {
	this.start = start;
	this.end = end;
};

// Ads set
var ads = [];

var setAds = function() {
	var ad1DateTimeFrame = new DateTimeFrame(new Date("01/01/2014"), new Date("12/31/2014"));
	var ad1HourTimeFrame = new HourTimeFrame(new Date(0, 0, 0, 6, 0, 0, 0), new Date(0, 0, 0, 12, 0, 0, 0));
	var ad1TimeFrame = new TimeFrame(ad1DateTimeFrame, [2 - 1, 4 - 1], ad1HourTimeFrame);

	var ad1 = new Ad("Lego Movie", "templates/a.html", 30, ad1TimeFrame);
	ad1.addImage("images/lego/2.png");
	ad1.addImage("images/lego/3.png");
	ad1.addText("Lego movie!");
	ad1.addText("Best movie of 2014");
	ad1.addText("Now playing!");
	ad1.addText("Lego!");

	ads.push(ad1);
}; setAds();

// Doc ready
$(document).ready(function() {
	console.log(ads);

	// Render ads
	ads.forEach(function(ad) {
		// Check if should render
		if (shouldRender(ad)) {
			renderAd(ad);
		}
	});	
});

// Load ad template
// Render images and text to template
var renderAd = function(ad) {
	$("#template").load(ad.template, function() {
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
	});
};

// Check if ad timeframe is now
var shouldRender = function(ad) {
	var render = true;

	// Get current time
	var now = new Date();

	// Checking if day of week defined
	if (ad.timeFrame.daysInWeek) {
		// If today not exist in days of week
		render = $.inArray(now.getDay(), ad.timeFrame.daysInWeek) != -1 ? true : false;
	}
	
	// If still render -> check if day isnt date timeline
	if (render && ad.timeFrame.dateTimeFrame) {
		if (!(now.getTime() >= ad.timeFrame.dateTimeFrame.start.getTime() &&
			now.getTime() <= ad.timeFrame.dateTimeFrame.end.getTime())) {
			render = false;
		}
	}

	// If still render -> check if time isnt time timeline
	if (render && ad.timeFrame.hourTimeFrame) {
		if (!(now.getHours() >= ad.timeFrame.hourTimeFrame.start.getHours() &&
			now.getHours() <= ad.timeFrame.hourTimeFrame.end.getHours())) {
			render = false;
		}
	}

	return render;
};