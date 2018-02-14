// ==UserScript==
// @name         [Harvest] Profitability View
// @author       CROmetrics
// @version      1.00
// @namespace    crometrics-harvest
// @description  Show profitability numbers in client reports
// @include      https://crometrics.harvestapp.com/reports?*
// @run-at       document-body
// @require		 http://code.jquery.com/jquery-3.2.1.min.js
// @require		 https://momentjs.com/downloads/moment.min.js
// ==/UserScript==

(function() {
    'use strict';

    function getParam(name, url) {
	    if (!url) {
	      url = window.location.href;
	    }
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

    var clientMonthly = {
        "Demo": 20000
    };

    var clientNames = Object.keys(clientMonthly);

    setTimeout(function(){

    	var clientsTable = $('#clients-table').children('tbody');

    	if (clientsTable.length > 0) {

	    	// Insert a New "Profitability" Column Header
	    	$('#clients-table th.td-item').after('<th class="td-profitability"><span>Profitability</span></th>');
	    	// Insert the Profitability Cell
	    	$('#clients-table td.td-item').after('<td class="td-profitability"></td>');
	    	// --- And one for the footer too
	    	$('#clients-table td.left').after('<td class="td-profitability"></td>');

	    	clientsTable.each(function(i){
	    		var thisClient = $(this);
	    		var thisClientName = thisClient.find('.td-item a').text();

	    		if (clientNames.indexOf(thisClientName) > -1) {
	    			var beginDate = getParam('from');
	    			var endDate = getParam('till');
                    var beginMoment = moment(beginDate, "YYYY-MM-DD");
                    var endMoment = moment(endDate, "YYYY-MM-DD");

					var monthsBetween = Math.abs(endMoment.diff(beginMoment, 'months'));
					var thisClientHours = Number(thisClient.find('.td-hours a').text());

					// Profitability = (Monthly Retainer * Months in Range) / Client Hours Spent in Range
                    // OverheadCost = Monthly Revenue * 47.5%
                    // Margin = Monthly Revenue - (Hours * $160/hr Hourly Rate) - OverheadCost
                    // Net Margin = Margin / Monthly Revenue

                    var totalRevenue = clientMonthly[thisClientName] * monthsBetween

                    // Fixed Hourly, Calculate Margin
                    // var thisClientProfitability = Math.floor(totalRevenue - (thisClientHours * 160) - (totalRevenue * 0.475));
                    // thisClientProfitability = Math.round((thisClientProfitability / totalRevenue)*100);
                    // var thisClientProfitabilityStr = "" + thisClientProfitability + "%";

                    // Fixed Margin, Calculate Hourly
                    // var thisClientProfitability = Math.abs(((totalRevenue * 0.1) - totalRevenue + (totalRevenue * 0.475)) / thisClientHours);
                    // var thisClientProfitabilityStr = "$" + Math.floor(thisClientProfitability) + " / hr";

                    var thisClientProfitability = Math.floor((clientMonthly[thisClientName] * monthsBetween) / thisClientHours);
                    var thisClientProfitabilityStr = "$" + thisClientProfitability + " / hr";

                    thisClient.find('.td-profitability').text(thisClientProfitabilityStr);
	    		}
	    	});

    	}
    	else {
    		console.log("[Harvest] Profitability View: Abort! Not a Client Report!");
    	}

    }, 500);
})();
