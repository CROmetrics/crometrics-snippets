"use strict";
(function(){
  var clean_utf8 = function(string){
    return string
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/”|“/g,'"')
      .replace(/’/g,'\'')
      .replace(/[\u00A0-\u2666]/g, function(c) {
        return '&#' + c.charCodeAt(0) + ';';
      });
  };
  var popup = window.open('about:blank');
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);
      // console.log(data);
      var experiment_json = {
        'description': clean_utf8(data.name),
        'edit_url': '',
        // 'id': '',
        'hypothesis': '',
        'target_urls': [],
        'trello_card': data.url,
        'members': [],
      };

      //Begin parsing the card description:
      var clean_desc = clean_utf8(data.desc);
      var url_test = /(https?:\/\/)?[^\.\s]+(\.[^\.\/\s]+)+[^\s(\[]+/g;
      //Some cards are using ####headers, some are using **bold** headings: 
      var split = /^##+ ?/.test(clean_desc) ? clean_desc.split(/##+ ?([\w ]+):? ?\n*/g) : clean_desc.split(/\*\*([\w ]+):? ?\*\*\n*/g);
      var key;
      for (var v in split){
        var val = split[v].trim();
        // console.log(val);
        if (!val) continue;
        if (v%2 == 1){
          key = val.toLowerCase().replace(' ', '_');
        }else if (key == 'hypothesis'){
          var var_split = val.split(/\n\n/g);
          var hypothesis = "";
          var variations = [];
          for (var v in var_split){
            var var_val = var_split[v]
            //Sometimes the variations are under the hypothesis section...
            if (var_val.substr(0,9) == 'Original:'){
              variations = var_val.split("\n");
            }else{
              hypothesis += var_val;
            }
          }
          if (variations.length) experiment_json['variations'] = variations;
          experiment_json[key] = hypothesis;
        }else if (key == 'dev_notes' || key == 'notes'){
          experiment_json[key] = val;
        }else if (key == 'target_urls' || key == 'target_url'){
          key = 'target_urls';
          experiment_json[key] = val.match(url_test) || [];//Needs a fallback
        }else if (key == 'variations' || key == 'target_urls' || key == 'audience_targeting' || key == 'goals'){
          experiment_json[key] = val.split(/\n+/g);
        }
      }
      if (experiment_json.target_urls.length){
        experiment_json.edit_url = experiment_json.target_urls[0];
      }
      if (experiment_json.edit_url.length && experiment_json.edit_url.substr(0,4).toLowerCase() != 'http')
        experiment_json.edit_url = 'http://' + experiment_json.edit_url;
      
      //Add the members list to the json:
      if (data.members && data.members.length){
        for (const member of data.members){
          experiment_json.members.push({
            'fullName': member.fullName,
            'initials': member.initials,
            'username': member.username
          });
        }
      }

      console.log(experiment_json);

      //Note: Prompt limits the content to 2000 characters!
      // prompt('experiment.json file contents:', JSON.stringify(experiment_json, null, 2));

      //Output the result to a new browser tab:
      var script = `
      var _code = document.getElementById('code'),
        _command = document.getElementById('command');
      
      function refresh(){
        try{
          var json = JSON.parse(_code.innerText);
          _command.innerHTML = 'crowrap new json ' + btoa(JSON.stringify(json));
        }catch(ex){
          _command.innerHTML = 'INVALID JSON';
          console.error(ex);
        }
      }
      refresh();
      _command.focus();
      document.execCommand('selectAll');
      document.execCommand('copy');

      document.addEventListener('keyup', function (e) {
        if (e.key != 'Meta' && e.key != 'Control'){
          refresh();
        }
      });
      `;
      var html = '<html><b>You can modify this json, and the command will automatically update below:</b><pre><code id="code" style="display: block;" contenteditable>'+JSON.stringify(experiment_json, null, 2)+'</code></pre><div id="command" contenteditable style="background: #eee"></div><script>'+script+'</script></html>';
      popup.location = 'data:text/html;base64,' + btoa(html);
      // popup.location = 'data:application/json;charset=utf-8,'+JSON.stringify(experiment_json, null, 2);
    }
  };
  //Note: don't use location.href because it can include #, which messes up the .json part.
  xmlhttp.open("GET", location.origin + location.pathname + '.json', true);
  xmlhttp.send();
})();