# crometrics-snippets
Collection of CROmetrics snippets and patterns

### The Button
A tampermonkey/greasemonkey script that adds a button to the optimizely interface. Look in `/the-button` for more info.

### esper - Optimizely Espionage Tool
Originally based on this: https://gist.github.com/danest/73eda651cd4fb4ec76fb/

Install the bookmarklet:

```
javascript:(($)=>$.getScript("https://crometrics.github.io/crometrics-snippets/esper/esper.min.js"))(window.jQuery || window.$ || window.optimizely && (window.optimizely.$ || window.optimizely.get && window.optimizely.get('jquery')));
```