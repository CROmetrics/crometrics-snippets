javascript:"use strict";!function(){var a=function(b){return b.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/”|“/g,'"').replace(/’/g,"'").replace(/[\u00A0-\u2666]/g,function(a){return"&#"+a.charCodeAt(0)+";"})},b=window.open("about:blank"),c=new XMLHttpRequest;c.onreadystatechange=function(){if(4==c.readyState&&200==c.status){var d,e=JSON.parse(c.responseText),f={description:a(e.name),edit_url:"",hypothesis:"",target_urls:[],trello_card:e.url,members:[]},g=a(e.desc),h=/(https?:\/\/)?[^\.\s]+(\.[^\.\/\s]+)+[^\s(\[]+/g,i=/^##+ ?/.test(g)?g.split(/##+ ?([\w ]+):? ?\n*/g):g.split(/\*\*([\w ]+):? ?\*\*\n*/g);for(var j in i){var k=i[j].trim();if(k)if(1==j%2)d=k.toLowerCase().replace(" ","_");else if("hypothesis"==d){var l=k.split(/\n\n/g),m="",n=[];for(var j in l){var o=l[j];"Original:"==o.substr(0,9)?n=o.split("\n"):m+=o}n.length&&(f.variations=n),f[d]=m}else"dev_notes"==d||"notes"==d?f[d]=k:"target_urls"==d||"target_url"==d?(d="target_urls",f[d]=k.match(h)||[]):("variations"==d||"target_urls"==d||"audience_targeting"==d||"goals"==d)&&(f[d]=k.split(/\n+/g))}if(f.target_urls.length&&(f.edit_url=f.target_urls[0]),f.edit_url.length&&"http"!=f.edit_url.substr(0,4).toLowerCase()&&(f.edit_url="http://"+f.edit_url),e.members&&e.members.length){var p=!0,q=!1,r=void 0;try{for(var s,t=e.members[Symbol.iterator]();!(p=(s=t.next()).done);p=!0){var u=s.value;f.members.push({fullName:u.fullName,initials:u.initials,username:u.username})}}catch(a){q=!0,r=a}finally{try{!p&&t.return&&t.return()}finally{if(q)throw r}}}console.log(f);var v="\n      var _code = document.getElementById('code'),\n        _command = document.getElementById('command');\n      \n      function refresh(){\n        try{\n          var json = JSON.parse(_code.innerText);\n          _command.innerHTML = 'crowrap new json ' + btoa(JSON.stringify(json));\n        }catch(ex){\n          _command.innerHTML = 'INVALID JSON';\n          console.error(ex);\n        }\n      }\n      refresh();\n      _command.focus();\n      document.execCommand('selectAll');\n      document.execCommand('copy');\n\n      document.addEventListener('keyup', function (e) {\n        if (e.key != 'Meta' && e.key != 'Control'){\n          refresh();\n        }\n      });\n      ",w='<html><b>You can modify this json, and the command will automatically update below:</b><pre><code id="code" style="display: block;" contenteditable>'+JSON.stringify(f,null,2)+'</code></pre><div id="command" contenteditable style="background: #eee"></div><script>'+v+"</script></html>";b.location="data:text/html;base64,"+btoa(w)}},c.open("GET",location.origin+location.pathname+".json",!0),c.send()}();