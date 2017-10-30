(function () {

  var todayDateParam = moment().format("YYYYMMDD");
  var threeMonthBackDate = moment().subtract(3, "months");
  var lastMonthBackDate = moment().subtract(1, "months");
  var threeMonthBackDateParam = threeMonthBackDate.format("YYYYMMDD");
  var lastMonthBackDateParam = lastMonthBackDate.format("YYYYMMDD");

  // i.e. https://crometrics.harvestapp.com/reports?from=20170101&till=20170401&kind=custom#clients
  var threeMonthProfitability = "https://crometrics.harvestapp.com/reports?from=" + threeMonthBackDateParam + "&till=" + todayDateParam + "&kind=custom#clients";
  var lastMonthProfitability = "https://crometrics.harvestapp.com/reports?from=" + lastMonthBackDateParam + "&till=" + todayDateParam + "&kind=custom#clients";

  console.log(threeMonthProfitability);

  setTimeout(function(){
    document.querySelectorAll('#sub-nav .sub-nav-tabs').append('<li><a href="' + lastMonthProfitability + '">Last Month</a>');	
    document.querySelectorAll('#sub-nav .sub-nav-tabs').append('<li><a href="' + threeMonthProfitability + '">Last 3 Months</a>');	
  }, 500);
  
})();
