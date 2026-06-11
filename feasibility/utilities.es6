(function () {
  'use strict';

  function globals(globals) {
    const iframeEl = document.createElement('iframe');
    iframeEl.src = 'about:blank';
    document.body.append(iframeEl);

    const windowVars = Object.keys(iframeEl.contentWindow);

    for (const key of Object.keys(window)) {
      if (!windowVars.includes(key)) {
        globals[key] = window[key];
      }
    }

    document.body.remove(iframeEl);
  }

  function monkeyPatchBefore(object, key, callback) {
    const original = object[key];

    object[key] = function (...args) {
      try {
        callback(...args);
      } catch (e) {
        console.error(e);
      }

      return typeof original === 'function' && original.apply(this, args);
    };
  }

  // Monkey-patch all functions on the given object so they'll log when called.
  // ignoreKeys is an array that'll skip monkey-patching any keys it contains.
  function injectFeelers(obj, ignoreKeys = []) {
    // For all keys on the Object.
    for (const key of Object.keys(obj)) {
      // IIFE to retain variable references between iterations.
      (function (funcName) {
        const _func = obj[funcName];

        obj[`_${funcName}`] = _func;

        // Only if this key is a function.
        if (
          typeof _func === 'function' &&
          Array.isArray(ignoreKeys) &&
          !ignoreKeys.includes(funcName)
        ) {
          // Skip ignored keys.
          console.log('Monkey Patching - ', funcName, _func);
          // console.log('Old Func: ', _func);
          obj[funcName] = function (...args) {
            console.log(`Executing: ${funcName}`, _func);
            return _func.apply(this, args);
          };
          // console.log('New Func: ', obj[funcName]);
        }
      })(key);
    }
  }

  function watchReactProps(inputEl) {
    const el = inputEl || document.querySelector('[data-reactroot]');

    const getInstance = () => {
      try {
        return el[Object.keys(el)[0]]._currentElement._owner._instance;
      } catch (e) {
        console.error('[Feasibility] Error getInstance', e);
        return null;
      }
    };

    const propsWatcher = () => {
      console.log('[Feasibilty] watchReactProps element:', el);
      try {
        const instance = getInstance();

        if (!instance) {
          return setTimeout(propsWatcher, 50);
        }

        console.log('[Feasibilty] watchReactProps instance:', instance);

        //Monkeypatch the instance properties:
        instance._props = instance.props;

        Object.defineProperty(instance, 'props', {
          get() {
            return this._props;
          },
          set(p) {
            for (var v in p) {
              if (p[v] !== this._props[v]) {
                console.log(
                  `Diff of instance[${v}] : \n++${p[v]}\n--${this.props[v]}`,
                );
              }
            }
            this._props = p;
          },
        });
      } catch (e) {
        console.error('[Feasibility] Error watchReactProps', e);
      }
    };
    propsWatcher();
  }

  function onCustomEvent(event, callback, options = { passive: true }) {
    const fullCallback = (e) => callback(e.detail, e);
    window.addEventListener(event, fullCallback, options);

    return () => {
      window.removeEventListener(event, fullCallback);
    };
  }

  function dispatchCustomEvent(event, detail, options) {
    window.dispatchEvent(new CustomEvent(event, { detail, ...options }));
  }

  function waitForDataLayer(dataLayerKey = defaultDataLayerKey) {
    return new Promise((resolve) => {
      (function poll() {
        if (
          !window[dataLayerKey] ||
          typeof window[dataLayerKey].push !== 'function'
        )
          return setTimeout(poll, 50);

        return resolve(window[dataLayerKey]);
      })();
    });
  }

  async function onDataLayerPush(
    callback,
    { dataLayerKey = defaultDataLayerKey, withPastData = true } = {},
  ) {
    const dataLayer = await waitForDataLayer(dataLayerKey);

    if (withPastData) {
      // Send preexisting data to the callback
      for (const data of dataLayer) {
        callback(data[0]);
      }
    }

    monkeyPatchBefore(dataLayer, 'push', callback);
  }

  function onDataLayerEvent(callback, dataLayerEvent = defaultDataLayerEvent) {
    return onCustomEvent(dataLayerEvent, callback);
  }

  async function dispatchDataLayerPushEvents({
    dataLayerEvent = defaultDataLayerEvent,
    dataLayerKey = defaultDataLayerKey,
  } = {}) {
    const dataLayer = await waitForDataLayer(dataLayerKey);

    monkeyPatchBefore(dataLayer, 'push', (data) => {
      dispatchCustomEvent(dataLayerEvent, data);
    });
  }

  const config = {
    globals,
    injectFeelers,
    watchReactProps,
    monkeyPatchBefore,
    onCustomEvent,
    onDataLayerPush,
    dispatchDataLayerPushEvents,
    onDataLayerEvent,
  };

  window.feasibility = window.feasibility || config;

  console.log('window.feasibility:', window.feasibility);
})();
