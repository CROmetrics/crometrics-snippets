// ==UserScript==
// @name         Optimizely Client Sort
// @namespace    http://crometrics.com/
// @version      0.1
// @description  Alphabetizes the Optimizely Client List dropdown
// @author       David
// @match        https://app.optimizely.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.match(/app.optimizely.com/)) {  
        var $sortedClients = $(".accounts-list").sort(function(a,b) {          
            if($(a).find('a > div:eq(0)').text() < $(b).find('a > div:eq(0)').text()) {
                return -1;
            } else {
                return 1;
            }
        });     
        $("ul.list-unstyled.max-scroll--large").html($sortedClients);
    }
})();