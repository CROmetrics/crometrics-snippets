// jshint esversion: 6
(function(){
  'use strict';
  let feasibility = window.feasibility = window.feasibility || {};

  //Get globals:
  let globals = (globals=>{
    var iframe = document.createElement('iframe');
    iframe.src = "about:blank";
    document.body.appendChild(iframe);

    var windowVars = Object.keys(iframe.contentWindow);
    Object.keys(window).forEach(key=>{
      if (!windowVars.includes(key)) globals[key] = window[key];
    });

    document.body.removeChild(iframe);
  })(feasibility.globals = {});

  // Monkey-patch all functions on the given object so they'll log when called.
  // ignoreKeys is an array that'll skip monkey-patching any keys it contains.
  feasibility.injectFeelers = (obj, ignoreKeys = [])=>{
    // For all keys on the Object.
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      // IIFE to retain variable references between iterations.
      (function(funcName) { // jshint ignore:line
        var _func = obj[funcName];
        obj['_' + funcName] = _func;

        // Only if this key is a function.
        if(typeof _func === 'function') {
          // Skip ignored keys.
          if (Array.isArray(ignoreKeys) && !ignoreKeys.includes(funcName) ) {
            console.log('Monkey Patching - ', funcName, _func);
            // console.log('Old Func: ', _func);
            obj[funcName] = function() { // jshint ignore:line
              console.log('Executing: ' + funcName, _func);
              return _func.apply(this, arguments);
            };
            // console.log('New Func: ', obj[funcName]);
          }
        }
      })(keys[i]);
    }
  };

  feasibility.watchReactProps = (el)=>{
    if (!el) el = document.querySelector('[data-reactroot]');
    var getInstance = function(){
      try{
        var key = Object.keys(el)[0];
        return el[key]._currentElement._owner._instance;
      }catch(e){}
    };
    var propsWatcher = function(){
      console.log('[Feasibilty] watchReactProps element:', el);
      try{
        var instance = getInstance();
        if (!instance) return setTimeout(propsWatcher, 50);

        console.log('[Feasibilty] watchReactProps instance:', instance);

        //Monkeypatch the instance properties:
        instance._props = instance.props;
        Object.defineProperty(instance, 'props', {
          get: function() { return this._props; },
          set: function(p) {
            for (var v in p){
              if (p[v] != this._props[v]){
                console.log(`Diff of instance[${v}] : \n++${p[v]}\n--${this.props[v]}`);
              }
            }
            this._props = p;
          }
        });
      }catch(e){
        console.error('[Feasibility] Error watchReactProps', e);
      }
    };
    propsWatcher();
  };

  console.log('GLOBALS', feasibility.globals);
  console.log('window.feasibility:', feasibility);
})();