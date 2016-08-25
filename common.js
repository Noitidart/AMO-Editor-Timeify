// start - common helper functions
function getToday() {
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	return today.getTime();
}
function secondsToTime(secs) {
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

function getWeekStart() {
	// gets `today` that is of weekstart
	var today = new Date(getToday());
	var diff_till_weekstart = today.getDay() * 86400000;
	return today.getTime() - diff_till_weekstart;
}
