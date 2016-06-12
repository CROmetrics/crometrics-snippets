(function(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			// console.log(data);
			var experiment_json = {
				'description': data.name,
				'edit_url': '',
				// 'id': '',
				'trello_card': data.url,
				'hypothesis': '',
				'target_urls': [],
			};
			var split = data.desc.split(/\*\*([\w ]+):? ?\*\*\n*/g);
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
				}else if (key == 'target_url'){//single url
					experiment_json['target_urls'] = [val];
				}else if (key == 'dev_notes' || key == 'notes'){
					experiment_json[key] = val;
				}else if (key == 'variations' || key == 'target_urls' || key == 'audience_targeting' || key == 'goals'){
					experiment_json[key] = val.split(/\n+/g).slice(0,-1);//throw out last value
				}
			}
			if (experiment_json.target_urls.length) experiment_json.edit_url = experiment_json.target_urls[0];
			if (experiment_json.edit_url.length && experiment_json.edit_url.substr(0,4).toLowerCase() != 'http')
				experiment_json.edit_url = 'http://' + experiment_json.edit_url;
			console.log(experiment_json);
			prompt('experiment.json file contents:', JSON.stringify(experiment_json, null, 2));
		}
	};
	xmlhttp.open("GET", location.href + '.json', true);
	xmlhttp.send();
})();