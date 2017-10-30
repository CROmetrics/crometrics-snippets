(function () {

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

    // var clientsTable = $('#clients-table').children('tbody');
    var clientsTable = document.querySelectorAll('#clients-table > tbody');
    console.log(clientsTable);

    if (clientsTable.length > 0) {

      // Insert a New "Profitability" Column
      // $('#clients-table th.td-item').after('<th class="td-profitability"><span>Profitability</span></th>');
      // Insert the Profitability Cell
      // $('#clients-table td.td-item').after('<td class="td-profitability"></td>');

      // Insert a New "Profitability" Column
      document.querySelectorAll('#clients-table th.td-item')[0].insertAdjacentHTML('afterend', '<th class="td-profitability"><span>Profitability</span></th>');
      // Insert the Profitability Cell
      document.querySelectorAll('#clients-table th.td-item')[0].insertAdjacentHTML('afterend', '<td class="td-profitability"></td>');

      for(let i=0; i<clientsTable.length; i++){
        var client = clientsTable[i];
        var clientName = client.querySelectorAll('.td-item a')[0].textContent;
        var hours = client.querySelectorAll('.td-hours a')[0].textContent;

        if(clientNames.indexOf(thisClientName) > -1){        
          var beginDate = getParam('from');
          var endDate = getParam('till');
          var a = moment([Number(beginDate.substr(0,4)), Number(beginDate.substr(4,2))]);
          var b = moment([Number(endDate.substr(0,4)), Number(endDate.substr(4,2))]);
          var monthsBetween = Math.abs(b.diff(a, 'months'));
          var clientHours = Number(hours);
          var clientProfitability = Math.floor((window.clientMonthly[clientName] * monthsBetween) / clientHours);
          var clientProfitabilityStr = "$" + clientProfitability + " / hr";
          client.querySelectorAll('.td-profitability').textContent = clientProfitabilityStr;
        }

      } // end for loop 

      // clientsTable.each(function(i){
      //   var thisClient = $(this);
      //   var thisClientName = thisClient.find('.td-item a').text();

      //   if (clientNames.indexOf(thisClientName) > -1) {
      //     var beginDate = getParam('from');
      //     var endDate = getParam('till');
      //     var a = moment([Number(beginDate.substr(0,4)), Number(beginDate.substr(4,2))]);
      //     var b = moment([Number(endDate.substr(0,4)), Number(endDate.substr(4,2))]);
      //     var monthsBetween = Math.abs(b.diff(a, 'months'));
      //     var thisClientHours = Number(thisClient.find('.td-hours a').text());
      //     // var thisClientHours = Number(hours);
      //     var thisClientProfitability = Math.floor((window.clientMonthly[thisClientName] * monthsBetween) / thisClientHours);
      //     var thisClientProfitabilityStr = "$" + thisClientProfitability + " / hr";
      //     thisClient.find('.td-profitability').text(thisClientProfitabilityStr);
      //   }
      // });

    }
    else {
      console.log("[Harvest] Profitability View: Abort! Not a Client Report!");
    }

  }, 500);
  
})();

