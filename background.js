// start - opening dashboard
function openDashboard() {
	chrome.tabs.create({
		url: chrome.extension.getURL('dashboard.html')
	});
}
chrome.browserAction.onClicked.addListener(openDashboard);

// start - toggling timer
chrome.runtime.onMessage.addListener(function handleMessage(request, sender, sendResponse) {
	// console.log(request, sender, sendResponse);
	switch(request) {
		case 'enable-timer':
				chrome.browserAction.setBadgeText({text:''});
				startInterval();
			break;
		case 'disable-timer':
				chrome.browserAction.setBadgeText({text:'Off'});
				clearInterval(gInterval);
				gInterval = null;
			break;
	}
});

// start - timing interval
var gInterval;
const CHECK_INTERVAL = 10000; // ms
var tpd = chrome.storage.local.get('tpd', startChecking); // time per day
function startChecking(storage) {
	// console.log('storage:', storage);
	if (!storage.tpd) {
		tpd = {};
	} else {
		tpd = storage.tpd;
	}
	startInterval();
}
function startInterval() {
	gInterval = setInterval(queryTabs, CHECK_INTERVAL);
}
function queryTabs() {
	chrome.tabs.query({
		url: [
			'https://addons.mozilla.org/*/editors/review/*'
			// 'https://addons.mozilla.org/*/firefox/files/browse/*/file/*'
		]
	}, checkTabs);
}
function checkTabs(tabs) {
	if (tabs.length) {
		var today = getToday();
		var increment_sec = CHECK_INTERVAL / 1000; // stored as seconds
		if (!tpd[today]) {
			tpd[today] = increment_sec;
		} else {
			tpd[today] += increment_sec;
		}
		// console.log('total time spent:', secondsToTime(tpd[today]));
		chrome.storage.local.set({
			tpd
		});
	} else {
		// console.log('not on any review tabs');
	}
}
