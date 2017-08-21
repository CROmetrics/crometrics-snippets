(function () {

  setTimeout(function(){

    var clientsTable = $('#clients-table').children('tbody');
    console.log(clientsTable);

    if (clientsTable.length > 0) {

      // Insert a New "Profitability" Column
      $('#clients-table th.td-item').after('<th class="td-profitability"><span>Profitability</span></th>');
      // Insert the Profitability Cell
      $('#clients-table td.td-item').after('<td class="td-profitability"></td>');

      clientsTable.each(function(i){
        var thisClient = $(this);
        var thisClientName = thisClient.find('.td-item a').text();

        if (clientNames.indexOf(thisClientName) > -1) {
          var beginDate = getParam('from');
          var endDate = getParam('till');
        var a = moment([Number(beginDate.substr(0,4)), Number(beginDate.substr(4,2))]);
        var b = moment([Number(endDate.substr(0,4)), Number(endDate.substr(4,2))]);
        var monthsBetween = Math.abs(b.diff(a, 'months'));
        var thisClientHours = Number(thisClient.find('.td-hours a').text());
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
  
})();
