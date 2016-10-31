var tpd; // time per day
var tpd_sorted;
var gInterval;
function render(storage) {
	// console.log('storage:', storage);
	if (!storage.tpd) {
		tpd = {};
	} else {
		tpd = storage.tpd;
	}

	tpd_sorted = [];
	for (var day in tpd) {
		tpd_sorted.push({ day, sec:tpd[day] });
	}

	tpd_sorted.sort( (a,b) => a - b );

	var txt = ['Day;Date;Time Spent (hh:mm:ss)'];

	var weekstart = getWeekStart();
	// txt.push('Week Start: ' + formatDate(new Date(weekstart)));
	var total_sec_week = 0;
	for (entry of tpd_sorted) {
		// if (entry.day < weekstart) {
		// 	continue;
		// } else {
			total_sec_week += entry.sec;

			let date = new Date(parseInt(entry.day));
			txt.push(formatDate(date) + ';' + formatTimeSpent(entry.sec));
		// }
	}

	txt.splice(0, 0, 'Week Time Spent: ' + formatTimeSpent(total_sec_week), '');

	document.getElementById('root').textContent = txt.join('\n');

	if (!gInterval) {
		gInterval = setInterval(refreshStorage, 1000);
	}
}

function refreshStorage() {
	storageCall('local', 'get', 'tpd').then(render);
}

function formatTimeSpent(secs) {
	var { h, m, s } = secondsToTime(secs);
	if (h < 10) { h = '0' + h; }
	if (m < 10) { m = '0' + m; }
	if (s < 10) { s = '0' + s; }

	return [h,m,s].join(':');
}
function formatDate(date) {
	var month = date.getMonth();
	var yr = date.getFullYear();
	var day = date.getDate();

	var wkday = date.getDay();

	var monthstr = {
		1: 'Jan',
		2: 'Feb',
		3: 'Mar',
		4: 'Apr',
		5: 'May',
		6: 'Jun',
		7: 'Jul',
		8: 'Aug',
		9: 'Sep',
		10: 'Oct',
		11: 'Nov',
		12: 'Dec'
	};

	var wkdaystr = {
		0: 'Sun',
		1: 'Mon',
		2: 'Tue',
		3: 'Wed',
		4: 'Thur',
		5: 'Fri',
		6: 'Sat'
	}

	return wkdaystr[wkday] + ';' + monthstr[month+1] + ' ' + day + ', ' + yr;
}






function disableTimer(e) {
	e.stopPropagation();
	e.preventDefault();

	chrome.runtime.sendMessage('disable-timer');
}

function enableTimer(e) {
	e.stopPropagation();
	e.preventDefault();

	chrome.runtime.sendMessage('enable-timer');
}

document.addEventListener('DOMContentLoaded', function() {
	refreshStorage();
	document.getElementById('enable').addEventListener('click', enableTimer, false);
	document.getElementById('disable').addEventListener('click', disableTimer, false);
}, false);
