# crometrics-snippets
Collection of CROmetrics snippets and patterns

### esper - Optimizely Espionage Tool
Originally based on this: https://gist.github.com/danest/73eda651cd4fb4ec76fb/

Install the [bookmarklet](javascript:(($)=>$.getScript("https://crometrics.github.io/crometrics-snippets/esper/esper.min.js"))(window.jQuery || window.$ || window.optimizely && (window.optimizely.$ || window.optimizely.get && window.optimizely.get('jquery')));):

```
javascript:(($)=>$.getScript("https://crometrics.github.io/crometrics-snippets/esper/esper.min.js"))(window.jQuery || window.$ || window.optimizely && (window.optimizely.$ || window.optimizely.get && window.optimizely.get('jquery')));
```

### The Button
A tampermonkey/greasemonkey script that adds a button to the optimizely interface. [More info](/the-button)