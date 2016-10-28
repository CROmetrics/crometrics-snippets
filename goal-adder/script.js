(function() {
    let list = prompt('Paste in goals, one per line and they will be added to the experiment:').split('\n');
    // let list = ["Completed Application (WFS + EPT)", "Completed Zip Code (WFS + EPT)", "Reached", "Engagement", "Scheduled Training", "Showed up to Training", "Contracted"];

    let projectId = window.optly.page.experiment.projectId,
        experimentId = window.optly.page.experiment.experimentId;
    // let modal_state = window.optly.page.goalDialog.stateStack;

    function get_state(){
        return modal_state[modal_state.length-1].mode;
    }

    function already_added(title){
        let index = list.indexOf(title);
        if (list[index]) list.splice(index, 1);
    }

    let get_goals_api = `https://app.optimizely.com/api/project/${projectId}/goal.json?unaddable_included_experiment_id=${experimentId}`;
    let post_goals_api = `https://app.optimizely.com/api/experiments/${experimentId}/goal.json`;

    if (!list.length) return;

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

        for (var i in list){
            let found_goal;
            let item = list[i];
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