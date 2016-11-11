Card Info Snippet
=====

This bookmarklet will attempt to generate an `experiment.json` file for you based on info it finds in an experiment Trello card. This information can then be used to spin up a new experiment directory using [CroWrap](https://github.com/CROmetrics/crowrap).

## Installation:
Create a new bookmark in your browser, and point the url to the contents of [bookmarklet.js](https://raw.githubusercontent.com/CROmetrics/crometrics-snippets/master/card-info/bookmarklet.js).

## Usage:
Run the bookmarklet when viewing an experiment card in Trello from your browser.

This will open a new browser tab containing information like the following:
```
{
  "description": "WIN-22: Landing Win On All The Page",
  "edit_url": "http://www.website.com/place-for-awesome/wow/",
  "trello_card": "https://trello.com/c/GbzoN8u6/1760-win-22-landing-win-on-all-the-page",
  "hypothesis": "With the new design of the awesome, conversion for winning and form filling will be better on the winning than on the junk pages.",
  "target_urls": [
    "www.website.com/place-for-awesome/wow/",
    "www.website.com/place-for-awesome/this/",
    "www.website.com/place-for-awesome/is/",
    "https://website.com/place-for-awesome/crazy/"
  ],
  "variations": [
    "Original: (no change)",
    "Var 1: They don't think it be like it is, but it do"
  ],
  "audience_targeting": [
    "Everyone"
  ],
  "goals": [
    "Fancy get all the things (primary)",
    "Learn all of the data infos",
    "Get all of the monies",
    "Engagement"
  ],
  "dev_notes": "Utilize magic, and produce the delicious eye sugar."
}
```

Below the JSON it shows a massive [crowrap](https://github.com/CROmetrics/crowrap) command, like this:
```
crowrap new json TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gVmVzdGlidWx1bSBzY2VsZXJpc3F1ZSBtb2xsaXMganVzdG8gc2l0IGFtZXQgY3Vyc3VzLiBVdCBub24gbmliaCBleC4gUHJhZXNlbnQgZWdlc3RhcyBwbGFjZXJhdCBkdWkgdml0YWUgbGFvcmVldC4gU2VkIGJsYW5kaXQgbWF1cmlzIHZpdGFlIG51bGxhIGV1aXNtb2QgdGluY2lkdW50LiBFdGlhbSBjdXJzdXMsIGFudGUgc2VkIGF1Y3RvciBwZWxsZW50ZXNxdWUsIHNlbSBleCBwbGFjZXJhdCBsb3JlbSwgdmVsIGdyYXZpZGEgb2RpbyB0b3J0b3Igc2VkIGV4LiBTZWQgY29udmFsbGlzIG1hc3NhIGVnZXQgc29sbGljaXR1ZGluIGVsZW1lbnR1bS4gVml2YW11cyB1bHRyaWNpZXMgbmliaCB2ZWwgbGVjdHVzIGxvYm9ydGlzIHBvc3VlcmUuIFNlZCBibGFuZGl0IGxvcmVtIGFjIHRpbmNpZHVudCBhbGlxdWFtLiBQcmFlc2VudCBtYXR0aXMgbmlzbCB2ZWwgZXggdmVzdGlidWx1bSB0aW5jaWR1bnQuIEN1cmFiaXR1ciBhbGlxdWFtIGV1IGVsaXQgYWMgc29kYWxlcy4gU3VzcGVuZGlzc2UgbWF4aW11cyBxdWFtIGVsaXQsIGVnZXQgdHJpc3RpcXVlIG1hc3NhIGN1cnN1cyBuZWMuIEluIGVsZW1lbnR1bSBsYWN1cyBuaXNpLCBxdWlzIHJob25jdXMgc2VtIGludGVyZHVtIG5vbi4gUGVsbGVudGVzcXVlIGF0IGRpYW0gc2l0IGFtZXQgdG9ydG9yIHZ1bHB1dGF0ZSB2YXJpdXMuIFByYWVzZW50IGFsaXF1ZXQgbWF1cmlzIG5lYyBsaWJlcm8gZmFjaWxpc2lzIGNvbnNlcXVhdC4gVml2YW11cyBuaWJoIG1hZ25hLCBwb3J0YSBldSBjb252YWxsaXMgc2l0IGFtZXQsIGVsZWlmZW5kIHZlbCBlcmF0Lg==
```

Copy the provided command, and paste it into your console while in the appropriate client's folder. 
Running the command will initialize an experiment directory with the experiment.json shown above. It also generates the appropriate number of variations, filling in their description information.

###Development notes
In order to come up with the bookmarklet version I've been putting the code into [babel](https://babeljs.io/repl/) then run it through [compression](http://jscompress.com/), then slap `javascript:` at the start of the line.

###Wishlist
~~David suggested that it would be nice to have the PM + Engineer name get exported into the experiment.json file.~~
The script now adds the names of the people on the trello card
