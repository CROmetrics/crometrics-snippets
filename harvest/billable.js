// Calculates what your % billable time is for a single day.
// Usage: run on Harvest on the time entry page for any day, i.e. /time/day/etc.

(function() {
	function toTimestamp(minutes) {
		var hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		var padding = ":";
		if (minutes < 10) padding = ":0";
		return hours + padding + minutes;
	}
	var billableCount = 0;
	var billableMinutes = 0;
	var nonBillableCount = 0;
	var nonBillableMinutes = 0;
	if ($("tr").length === 0) {
		alert("No timeslots found.");
	} else {
	    $("tr").each(function() {
			var time = $(this).find("td.entry-time").text().trim().split(':');
			var hours = parseInt(time[0]);
			var minutes = parseInt(time[1]);
			minutes += (hours * 60);
			var client = $(this).find("span.client").text().trim();
			if (client === "(CROmetrics)") {
				nonBillableCount++;
				nonBillableMinutes += minutes;
			} else {
				billableCount++;
				billableMinutes += minutes;
			}
		});
		var billablePercent = (((billableMinutes / (billableMinutes + nonBillableMinutes))) * 100).toFixed(0);
		var billableTotal = toTimestamp(billableMinutes);
		var totalTime = toTimestamp(billableMinutes + nonBillableMinutes);
		var str = billableCount + " billable task(s) found (out of " + (billableCount + nonBillableCount) + ")\n";
		str += "Total billable time: " + billableTotal + " (out of " + totalTime + ") -- " + billablePercent + "%\n";
		alert(str);
	}
})();