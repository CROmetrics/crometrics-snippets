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
        "Taulia": 5700,
        "Cutco": 10000,
        "Incapsula": 6000,
        "Sierra Club": 12000,
        "ExecRank": 10000,
        "Ring": 6000,
        "TinTri": 4500,
        "Healthy Paws": 7000,
        "Digital Room": 7000,
        "Hint Water": 6000,
        "Navex": 7000,
        "Imperva": 7750,
        "Coldwell Banker": 7000,
        "HotChalk": 10000,
        "Borrowell": 8000,
        "Tree Hut Design": 8500,
        "FilmStruck": 8000,
        "Alimed": 8000,
        "FreshDirect": 11000,
        "Freedom Financial": 10000,
        "Gump's": 8000,
        "Smart Communications": 7000,
        "The Information": 6000,
        "LovetoKnow": 8000,
        "Bonnier": 14000,
        "The Penny Hoarder": 8500,
        "Habit.com": 45000,
        "MoMa": 4000,
        "New Pig": 4000,
        "Regent Seven Seas": 4000,
        "Greentech Media": 4000
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
                    var beginDateArray = beginDate.match(/(\d+)-(\d+)-(\d+)/);
                    var endDateArray = endDate.match(/(\d+)-(\d+)-(\d+)/);
					var a = moment({
						'year': beginDateArray[1],
						'month': beginDateArray[2],
						'date': beginDateArray[3]
					});
					var b = moment({
						'year': endDateArray[1],
						'month': endDateArray[2],
						'date': endDateArray[3]
					});
					var monthsBetween = Math.abs(b.diff(a, 'months'));
					var thisClientHours = Number(thisClient.find('.td-hours a').text());

					// Profitability = (Monthly Retainer * Months in Range) / Client Hours Spent in Range
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