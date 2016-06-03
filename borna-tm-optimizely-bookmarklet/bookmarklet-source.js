(function () {
	var editMatch = /app.optimizely.*edit\?experiment_id=(\d+$)/,
		match = location.href.match(editMatch),
		activeExperiments = (!match && window.optimizely) ? window.optimizely.activeExperiments : [],
		activeExperimentsMap = (activeExperiments.length ? activeExperiments.map(function (id) {
			return "optimizely_x" + id + "=0"
		}).join('&') : ''),
		url,
		activeTab;

	if(match) {
		activeTab = $('li[data-test-section^="variation-tab"]').indexOf($('[data-test-section="variation-tab-selected"]')[0]);
		url = decodeURIComponent($('.iframe-parent iframe')[0].src.replace(/https?:\/\/www\.optimizelyedit\.com\/|\?.*$/g, '')) + "?" + activeExperimentsMap + "optimizely_x" + match[1] + "=" + activeTab;
	} else {
		var query = location.search.replace('?','');
		url = decodeURIComponent(location.href.replace(/https?:\/\/www\.optimizelypreview\.com\/|\?.*$/g, '') + '?' + activeExperimentsMap + (query.length ? '&' + query : ''))
	}
	prompt('Copy Experiment Preview URL:', url);
})()