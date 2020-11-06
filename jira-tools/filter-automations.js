/*
 * Jira Automation Filter for Tamper Monkey
 * @author jared.schoen@crometrics.com (09/15/20)
 * 
 * Filters out unnecessary automated notifications in Jira
 */

(function() {
    'use strict';

    // filter text
    const filterValues = /Dave Albert updated|Mike Leydet updated|client dashboard updated|Jira Misc Workflow Extensions updated/;

    // create styles for filter
    const notificationsFilterStylesHTML = `
      <style>
        .cro-notifications-filter {
          display: flex; align-items: center;
          line-height: 1.8;
          padding: 4px 8px;
          position: absolute; top: 0; right: 5px;
        }

        /* display none causes a bug */
        .cro-filter-out {
          opacity: 0;
          position: absolute;
          visibility: hidden;
        }
      </style>
    `;

    //Element matches polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    const observeSelector = (thisDoc, selector, callback, options = {timeout: null, once: false, onTimeout: null})=>{
      let processed = new Map();

      if (options.timeout || options.onTimeout){
        // console.log('------------------------------------------------------------------------------------------------------------------------------');
        // console.log('[OLI] WARNING: observeSelector options timeout and onTimeout are not yet implemented.');
        // console.log('------------------------------------------------------------------------------------------------------------------------------');
      }

      let obs, isDone = false;
      const done = ()=>{
        if (!obs) console.warn('observeSelector failed to run done()');
        if (obs) obs.disconnect();
        processed = undefined;
        obs = undefined;
        return isDone = true;
      };

      const processElement = el=>{
        if (processed && !processed.has(el)) {
          processed.set(el, true);
          callback(el);
          if (options.once){
            done();
            return true;
          }
        }
      };

      const lookForSelector = (el = thisDoc) => {
        if (el.matches && el.matches(selector)){
          if (processElement(el)) return true;
        }
        if (el.querySelectorAll){
          const elements = el.querySelectorAll(selector);
          if (elements.length) {
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i];
              if (processElement(el)) return true;
            }
          }
        }
      };
      lookForSelector();

      //We might finish before the mutation observer is necessary:
      if (!isDone){
        obs = new MutationObserver(mutationsList => {
          mutationsList.forEach(record=>{
            if (record && record.addedNodes && record.addedNodes.length){
              for (let i = 0; i < record.addedNodes.length; i++) {
                //Need to check from the parent element since sibling selectors can be thrown off if elements show up in non-sequential order
                const el = record.addedNodes[i].parentElement;
                // if (!el) console.warn('observeSelector element has no parent', record.addedNodes[i], record);
                //Note: This appears to also run when elements are removed from the DOM. If the element doesn't have a parent then we don't need to check it.
                if (el && lookForSelector(el)) return true;
              }
            }
          });
        });
        obs.observe(thisDoc, {
          attributes: false,
          childList: true,
          subtree: true
        });
      }

      return ()=>{
        done();
      };
    };

    const createFilter = () => {
      let activeObserver;
      // console.log('TEST createFilter');
      const notificationsFilter = document.createElement('div'),
            notificationsFilterHTML = '<label><input type="checkbox"> Filter Automation</label></div>';
      notificationsFilter.classList.add('cro-notifications-filter');
      notificationsFilter.innerHTML = notificationsFilterHTML;
      notificationsFilter.querySelector('input').addEventListener('click', (e) => {
        if (activeObserver) activeObserver();
        // console.log('TEST click');
        const iframeDoc = e.target.closest('html');
        // console.log('TEST filter clicked and checked =', e.target.checked);
        if (e.target.checked) {
          activeObserver = observeSelector(iframeDoc, 'ul[class^="NotificationsList"] li[class^="NotificationItem"]', item => {
            if (filterValues.test(item.innerText))
              item.classList.add('cro-filter-out');
          });
          window.localStorage.setItem('cro-filter-on', 'true');
        } else {
          activeObserver = observeSelector(iframeDoc, 'ul[class^="NotificationsList"] li[class^="NotificationItem"].cro-filter-out', item => {
            item.classList.remove('cro-filter-out');
          });
          window.localStorage.setItem('cro-filter-on', 'false');
        }
      });

      return notificationsFilter;
    };

    const addFilter = (thisDoc) => {
      // console.log('addFilter');
      const tabs = thisDoc.querySelector('div[role="tablist"]');
      // console.log('TEST tabs', tabs);
      if (!tabs) return;

      thisDoc.head.insertAdjacentHTML('beforeend', notificationsFilterStylesHTML);
      // console.log('TEST styles added');
      tabs.insertAdjacentElement('afterbegin', createFilter());
      // remember filter setting
      if (window.localStorage.getItem('cro-filter-on') === 'true')
        tabs.querySelector('.cro-notifications-filter input').click();
    };

    // console.log('TEST pre doc ready');

    observeSelector(document, 'body[class] > .atlaskit-portal-container', notificationContainer => {
      // console.log('notificationContainer', notificationContainer);
      if (notificationContainer.querySelector('iframe[src*="notificationsDrawer"]')) {
        const iframeDoc = notificationContainer.querySelector('iframe[src*="notificationsDrawer"]').contentDocument;
        addFilter(iframeDoc);
      }
      const observer = new MutationObserver(() => {
        window.setTimeout(() => {
          // console.log('TEST mutation', mutations);
          // console.log('mutation check', (!document.querySelector('body[class] > .atlaskit-portal-container iframe[src*="notificationsDrawer"]') || document.querySelector('body[class] > .atlaskit-portal-container .cro-notifications-filter')));
          // console.log(notificationContainer.querySelector('iframe'));
          // console.log(document.querySelector('body[class] > .atlaskit-portal-container iframe'));
          // console.log(notificationContainer.querySelector('iframe[src*="notificationsDrawer"]'));
          // console.log(document.querySelector('body[class] > .atlaskit-portal-container iframe[src*="notificationsDrawer"]'));
          if (!document.querySelector('body[class] > .atlaskit-portal-container iframe[src*="notificationsDrawer"]') || document.querySelector('body[class] > .atlaskit-portal-container .cro-notifications-filter'))
            return;

          const iframeDoc = document.querySelector('body[class] > .atlaskit-portal-container iframe[src*="notificationsDrawer"]').contentDocument;
          addFilter(iframeDoc);
        }, 0);
      });
      observer.observe(notificationContainer, {attributes: true, childList: true, subtree: true});
    });

})();