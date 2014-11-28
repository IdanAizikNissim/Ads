exports.containsId = function(array, id) {
	var value = false;

	array.forEach(function(v) {
		if (v.id == id) {
			value = true;
			return;
		}
	});

	return value;
};