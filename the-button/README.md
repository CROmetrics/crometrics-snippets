*The* Button
----

This is a tampermonkey/greasemonkey script that adds a button to the optimizely interface. It helps generate the various links that we use for each experiment.

### Step 1: Observe the button
![The Button](http://i.imgur.com/3a5qdxn.png)

### Step 2: Push the button
Clicking the button opens a prompt window with a blob of content that you can then copy.

### Step 3: Profit
The panel contains something like this:
```
**Preview:**
v0 (Original): https://hired.com/?optimizely_x6137140326=0
v1 (David Posey): https://hired.com/?optimizely_x6137140326=1
v2 (Ashley Campo): https://hired.com/?optimizely_x6137140326=2
**Cross Browser testing:**
v0 (Original): https://www.browserstack.com/start#url=https%3A%2F%2Fhired.com%2F%3Foptimizely_x6137140326%3D0
v1 (David Posey): https://www.browserstack.com/start#url=https%3A%2F%2Fhired.com%2F%3Foptimizely_x6137140326%3D1
v2 (Ashley Campo): https://www.browserstack.com/start#url=https%3A%2F%2Fhired.com%2F%3Foptimizely_x6137140326%3D2
**Edit:**
https://app.optimizely.com/edit?experiment_id=6137140326
```

You can then copy and paste that into the Trello card for the experiment you are working on.