(function() {
  // let input_list = prompt('Paste in goals, one per line and they will be added to the experiment:').split('\n');
  // let input_list = ["Completed Application (WFS + EPT) (primary)", "Completed Zip Code (WFS + EPT)", "Reached", "Engagement", "Scheduled Training", "Showed up to Training", "Contracted"];

  var get_goal_list = (callback) =>{
    if (location.origin.toLowerCase() === "https://trello.com"){
      $.get(location.origin + location.pathname + '.json', function(data){
        var split = /^##+ ?/.test(data.desc) ? data.desc.split(/##+ ?([\w ]+):? ?\n*/g) : data.desc.split(/\*\*([\w ]+):? ?\*\*\n*/g);
        for (var v = 0; v < split.length; v++){
          var val = split[v];
          if (/^\s*Goals?\s*/i.test(val)){
            var list = split[v+1].trim().split('\n');
            callback(list);
            return;
          }
        }
      })
    }else{
      callback(prompt('Paste in goals, one per line and they will be added to the experiment:').split('\n'));
    }
  }

  get_goal_list(function(input_list){
    //A little cleanup first:
    input_list.map((val)=>{
      return val.replace(/\s*[\[{(]primary[)}\]]\s*$/i, '');
    });
    
  });

  //A little cleanup first:
  input_list.map((val)=>{
    return val.replace(/\s*[\[{(]primary[)}\]]\s*$/i, '');
  });

  let projectId = window.optly.page.experiment.projectId,
      experimentId = window.optly.page.experiment.experimentId;
  let modal_state = window.optly.page.goalDialog.stateStack;

  function get_state(){
    return modal_state[modal_state.length-1].mode;
  }

  function already_added(title){
    let index = input_list.indexOf(title);
    if (input_list[index]) input_list.splice(index, 1);
  }

  let get_goals_api = `https://app.optimizely.com/api/project/${projectId}/goal.json?unaddable_included_experiment_id=${experimentId}`;
  let post_goals_api = `https://app.optimizely.com/api/experiments/${experimentId}/goal.json`;

  if (!input_list.length) return;

  $.get(get_goals_api, function(results){
    let goals_to_be_added = [];
    let goals = (results.goals || {}).filter(function(goal){
      //Remove goals that are already added:
      if (goal.experiment_ids.indexOf(experimentId) !== -1){
        already_added(goal.title);
        return false;
      }
      return true;
    });

    var unfound = [];

    for (var i in input_list){
      let found_goal;
      let item = input_list[i];
      for (var g in goals){ //Dat efficiency
        let goal = goals[g];
        if (goal.title === item){
          if (!found_goal){
            found_goal = goal;
          }else{//if multiple matches, then this isn't going to work.
            console.log('found duplicate of ', item);
            found_goal = undefined;
            break;
          }
        }
      }
      if (found_goal){
        goals_to_be_added.push(found_goal);
        console.log('found', item);
      }else{
        unfound.push(item);
        console.log('Unable to find', item);
      }
    }
    if (goals_to_be_added.length){
      alert('Adding these goals to the experiment:\n' + goals_to_be_added.map(g=>g.title).join(',\n'));
      console.log('Adding these goals to the experiment:', goals_to_be_added);
      for (var g in goals_to_be_added){
        let goal = goals_to_be_added[g];
        $.post(post_goals_api, {
          'goal_id': goal.goal_id,
        }, function(result){
          if (result.succeeded){
            console.log('Successfully added goal:', goal.title);
          }else{
            alert('API ERROR!');
            console.warn('API error:', result);
          }
        });
      }
    }else{
      console.log('No goals to be added.');
    }
    if (unfound.length){
      alert('Unable to add these goals:\n' + unfound.join(',\n'));
      console.warn('Unable to add these goals:', unfound);
    }
  });
})();