// ==UserScript==
// @name         Optimizely links
// @namespace    http://crometrics.com/
// @version      0.1
// @description  Pull out the relevant links from an experiment page and format the links for Trello
// @author       Andrew W.
// @match        https://app.optimizely.com/edit?experiment_id=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	var editMatch = /app.optimizely.*edit\?experiment_id=(\d+$)/,
		match = location.href.match(editMatch);

    if(match) {
        var experiment_id = match[1];
        var $button = $('<button>').html('CROmetrics').addClass('lego-button lego-button--small push--right');

        var getExperimentInfo = function(){
            var preview_base_url = decodeURIComponent($('.iframe-parent iframe')[0].src.replace(/https?:\/\/www\.optimizelyedit\.com\/|\?.*$/g, '')) + "?optimizely_x" + experiment_id + "=";
            var preview_links = "**Preview:**\n",
                browserstack_links = "**Cross Browser testing:**\n",
                edit_link = "**Edit:**\n" + location.href + "\n";

            var $tabs = $('li[data-test-section^="variation-tab"]');
            $tabs.each(function(i){
                //console.log(i);
                var preview_url = preview_base_url + i,
                    browserstack_url = 'https://www.browserstack.com/start#url=' + encodeURIComponent(preview_url),
                    name = $(this).find('.js-variations__list__item__name').html();
                preview_links += 'v' + i + ' ('+name+')' + ': ' + preview_url + "\n";
                browserstack_links += 'v' + i + ' ('+name+')' + ': ' + browserstack_url + "\n";
            });
            return preview_links + "\n" + browserstack_links + "\n" + edit_link;
        };

        $button.click(function(){
            var output = getExperimentInfo();
            /*global prompt*/
            prompt('Experiment info:', output);
        });

        $(document).ready(function(){
            $('#toolbar .editor-save').prepend($button);
        });
    }
})();
