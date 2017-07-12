/* esversion: 6, global window */ 
"use strict";
(function() {
  // window.open('about:blank', 'goals', 'height=200,width=600,top=200,left=400,status=false,menubar=false');
  
  function addGoals(goalList){
    // let goalList = ["Completed Application (WFS + EPT) (primary)", "Completed Zip Code (WFS + EPT)", "Reached", "Engagement", "Scheduled Training", "Showed up to Training", "Contracted"];

    //A little cleanup first:
    goalList.map((val)=>{
      return val.replace(/\s*[\[{(]primary[)}\]]\s*$/i, '');
    });

    let projectId = window.optly.page.experiment.projectId,
        experimentId = window.optly.page.experiment.experimentId;
    let modal_state = window.optly.page.goalDialog.stateStack;

    // function get_state(){
    //   return modal_state[modal_state.length-1].mode;
    // }

    function alreadyAdded(title){
      let index = goalList.indexOf(title);
      if (goalList[index]) goalList.splice(index, 1);
    }

    function resultsDialog(message){
      window.optly.ui.showCustomDialog({title:'Results', message: message});
    }

    let get_goals_api = `https://app.optimizely.com/api/project/${projectId}/goal.json?unaddable_included_experiment_id=${experimentId}`;
    let post_goals_api = `https://app.optimizely.com/api/experiments/${experimentId}/goal.json`;

    if (!goalList.length) return;

    // goalList = goalList.map(g=>g.replace(/^\s*(\[primary\]|\[secondary\])\s*/, ''));

    $.get(get_goals_api, function(results){
      let goals_to_be_added = [];
      let goals = (results.goals || {}).filter(function(goal){
        //Remove goals that are already added:
        if (goal.experiment_ids.indexOf(experimentId) !== -1){
          alreadyAdded(goal.title);
          return false;
        }
        return true;
      });

      var unfound = [];

      for (var i in goalList){
        let found_goal;
        let item = goalList[i];
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
          console.log('Found', item);
        }else{
          unfound.push(item);
          console.log('Unable to find', item);
        }
      }
      if (goals_to_be_added.length){
        resultsDialog('Adding these goals to the experiment:\n' + goals_to_be_added.map(g=>g.title).join(',\n'));
        console.log('Adding these goals to the experiment:', goals_to_be_added);
        for (var g in goals_to_be_added){
          let goal = goals_to_be_added[g];
          $.post(post_goals_api, {
            'goal_id': goal.goal_id,
          }, function(result){
            if (result.succeeded){
              console.log('Successfully added goal:', goal.title);
            }else{
              resultsDialog('API ERROR!');
              console.warn('API error:', result);
            }
          });
        }
      }else{
        resultsDialog('No goals to be added.');
        console.log('No goals to be added.');
      }
      if (unfound.length){
        resultsDialog('Unable to add these goals:\n' + unfound.join(',\n'));
        console.warn('Unable to add these goals:', unfound);
      }
    });
  }

  let vueComponent = {
    template: `
    <div class="dialog--narrow lego-dialog">
      <div class="lego-dialog__header">
        <div class="lego-dialog__title">${tr("[[ title ]]")}</div>
        </div> <div class="lego-dialog__body">
          <p class="weight--bold" data-test-section="alert-dialog-message">${tr("[[ description ]]")}</p>
          <textarea id="text" style="width: 100%; height: 200px; resize: vertical;"></textarea>
        </div>
        <div class="lego-dialog__footer lego-button-row--right">
          <button type="button" class="lego-button lego-button--plain" v-hide-dialog="" data-test-section="confirm-cancel-button">${tr("[[ cancelText ]]")}</button>
          <button type="submit" class="lego-button" data-test-section="confirm-submit-button" v-class="lego-button--danger: isWarning, lego-button--highlight: !isWarning" v-on="click: accept">${tr("[[ confirmText ]]")}</button>
        </div>
      </div>
    </div>`,
    methods: {
      accept: function(){
        // console.log('accept', arguments, this);
        let goalsList = $(this.$el).find('#text').val().split('\n');
        addGoals(goalsList);
        this.$dispatch("hideDialog");
      },
    },
    defaultData: {
      title: 'Quick-Add Goals',
      description: 'Paste in goals (one per line) to be added to the experiment:',
      confirmText: 'Accept',
      cancelText: 'Cancel',
    }
  };
  window.optly.ui.showDialog({component: vueComponent});
})();