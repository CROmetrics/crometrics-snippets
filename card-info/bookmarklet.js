javascript:!function(){var t=window.open("about:blank"),e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==e.readyState&&200==e.status){var r,a=JSON.parse(e.responseText),n={description:a.name,edit_url:"",trello_card:a.url,hypothesis:"",target_urls:[]},s=a.desc.replace(/”|“/g,'"').replace(/[\u00A0-\u2666]/g,function(t){return"&#"+t.charCodeAt(0)+";"}),o=/(https?:\/\/)?[^\.\s]+(\.[^\.\/\s]+)+[^\s(\[]+/g,i=s.split(/\*\*([\w ]+):? ?\*\*\n*/g);for(var l in i){var u=i[l].trim();if(u)if(l%2==1)r=u.toLowerCase().replace(" ","_");else if("hypothesis"==r){var c=u.split(/\n\n/g),d="",g=[];for(var l in c){var p=c[l];"Original:"==p.substr(0,9)?g=p.split("\n"):d+=p}g.length&&(n.variations=g),n[r]=d}else"dev_notes"==r||"notes"==r?n[r]=u:"target_urls"==r||"target_url"==r?(r="target_urls",n[r]=u.match(o)):("variations"==r||"target_urls"==r||"audience_targeting"==r||"goals"==r)&&(n[r]=u.split(/\n+/g))}n.target_urls.length&&(n.edit_url=n.target_urls[0]),n.edit_url.length&&"http"!=n.edit_url.substr(0,4).toLowerCase()&&(n.edit_url="http://"+n.edit_url),console.log(n);var m="crowrap new json "+btoa(JSON.stringify(n)),h="<html><pre>"+JSON.stringify(n,null,2)+'</pre><div id="command" contenteditable>'+m+"</div><script>document.getElementById('command').focus();document.execCommand('selectAll');document.execCommand('copy');</script></html>";t.location="data:text/html;base64,"+btoa(h)}},e.open("GET",location.href+".json",!0),e.send()}();