# crometrics-snippets
Collection of CROmetrics snippets and patterns

### esper - Optimizely Analysis Tool
![Optimizely Analysis Tool](http://i.imgur.com/c1dmh17.png)

Bookmarklet originally based on: https://gist.github.com/danest/73eda651cd4fb4ec76fb/

Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/esper/esper.min.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>:

```
javascript:fetch('https://crometrics.github.io/crometrics-snippets/esper/esper.min.js').then(r=>r.text()).then(t=>new Function(t)());
```

### Feasibility Utilities
***Usage:*** Run the snippet and look at the console log.

#### Includes:

**Client Defined Globals:**
Originally based on: https://stackoverflow.com/questions/40752050/best-way-to-find-global-variables-in-javascript/40752328#40752328
Usage: `window.feasibility.globals`

**Identify Called Functions:**
Description: In case you ever have a reference and you need to know what functions get called and when on it you can run this against it.
Usage: `window.feasibility.injectFeelers(obj, ignoreKeys = [])`

#### Install:
Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/feasibility/utilities.min.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>:

```
javascript:fetch('https://crometrics.github.io/crometrics-snippets/feasibility/utilities.min.js').then(r=>r.text()).then(t=>new Function(t)())
```

### The Button
A tampermonkey/greasemonkey script that adds a button to the optimizely interface. [More info](/the-button)