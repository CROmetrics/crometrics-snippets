# crometrics-snippets
Collection of CROmetrics snippets and patterns

## Installation Instructions
Drag the bookmarklet link to your bookmarks bar, or right click and save the link as a bookmark.

## esper - Optimizely Analysis Tool
![Optimizely Analysis Tool](http://i.imgur.com/c1dmh17.png)
This opens a panel which displays information about the optimizely snippet running on the active page.

***Usage:*** Run the bookmarklet on a site that has optimizely running.

***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/esper/esper.min.js').then(r=>r.text()).then(t=>new Function(t)())">ESPER</a> bookmarklet.***

Legacy version (soon to be phased out):
***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/esper/esper.old.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>.***


Bookmarklet originally based on: https://gist.github.com/danest/73eda651cd4fb4ec76fb/



## X Pages - Link spider
Crawls around a site pulling out potential Page definitions for optimizely X

***Usage:*** Open the homepage of a site, run the bookmarklet.

***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/xpages/xpages.js').then(r=>r.text()).then(t=>new Function(t)())">xpages</a> bookmarklet.***


## Optimizely Goal Adder
This bookmarklet helps to add a list of goals to a classic experiment. You click it while looking at the edit page and it opens a panel for you to paste goals in (copied from the trello card spec).

***Usage:*** Run the bookmarklet from Optimizely classic's edit experiment UI.

***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/goal-adder/goals.min.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>.***

## Inject Webcam bookmarklet
Adds your webcam to a webpage (sticky bottom left).

***Usage:*** Run the bookmarklet on a https site.

***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/webcam/init.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>.***


## Feasibility Utilities
***Usage:*** Run the snippet and look at the console log.

#### Includes:

**Client Defined Globals:**

Originally based on: https://stackoverflow.com/questions/40752050/best-way-to-find-global-variables-in-javascript/40752328#40752328

***Usage:*** `window.feasibility.globals`

**Identify Called Functions:**

Description: In case you ever have a reference and you need to know what functions get called and when on it you can run this against it.

***Usage:*** `window.feasibility.injectFeelers(obj, ignoreKeys = [])`

#### Install:
***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/feasibility/utilities.min.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>.***



## The Button
A tampermonkey/greasemonkey script that adds a button to the optimizely interface. [More info](/the-button)

## Inject jQuery
<a href="javascript:fetch('https://code.jquery.com/jquery-3.2.1.min.js').then(r=>r.text()).then(t=>new Function(t)())">jQuery</a>

## Hide the Optimizely QA Ball
***Usage:*** Run the bookmarklet on an Optimizely preview link. Run it again to bring the QA ball back.

***Install the <a href="javascript:fetch('https://crometrics.github.io/crometrics-snippets/optimizely/hide-ball.js').then(r=>r.text()).then(t=>new Function(t)())">bookmarklet</a>.***