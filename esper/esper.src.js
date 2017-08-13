(function start(){
  'use strict';
  let $ = window.jQuery;

  if (!$ || !$.fn || !$.fn.jquery){
    fetch('https://code.jquery.com/jquery-3.2.1.min.js').then(r=>r.text()).then(t=>{
      new Function(t)();
      start();
    });
    return;
  }

  const COLORS = ["success", "danger", "warning", "primary", "info"];
  const end = "";

  class Esper extends HTMLElement{
    constructor(){
      super();
      this.forensics();
    }
    forensics(){
      if (window.optimizely){
        this.optimizely = {};
        if (window.optimizely.data && !window.optimizely.data.note){
          let data = window.optimizely.data;
          this.optimizelyClassic = {
            accountId: window.optimizely.getAccountId(),
            revision: window.optimizely.revision,
            state: data.state || {},
            audiences: data.audiences || {},
            variations: data.variations || {},
            experiments: data.experiments || {},
            segments: data.segments || {},
            visitor: data.visitor || {},
          };
        }
        if (window.optimizely.get){
          let data = window.optimizely.get('data');
          this.optimizelyX = {
           accountId: data.accountId,
           revision: data.revision,
           audiences: data.audiences || {},
           variations: data.variations || {},
           experiments: data.experiments || {},
           campaigns: data.campaigns || {},
          };
        }
      }

      if (window.DYO){
        this.dynamicYield = {
          experiments: window.DYO.oexps || {}
        };
      }

      if (window.monetate){
        this.monetate = {
          // experiments: window.monetate || {}
        };
      }

      if (window.SentientAscend){
        this.sentient = {
          // experiments: window.SentientAscend || {}
        };
      }

    }

    connectedCallback(){
      let shadow = this.attachShadow({mode: 'closed'});
      let stylesheet = document.createElement('style');
      stylesheet.innerHTML = require("./esper.scss");

      // $("#opt_container,#opt_styles,#opt_backdrop").remove();
      this.$container = $("<div id='opt_container'/>");
      this.$backdrop = $("<div id='opt_backdrop'/>").click(()=>{
        this.remove();
      });

      // note: old jQuery isn't able to work with the shadow dom, so do it native.
      shadow.appendChild(stylesheet);
      shadow.appendChild(this.$container[0]);
      shadow.appendChild(this.$backdrop[0]);

      // if (!window.optimizely) return this.$container.append("<h1>Error: Missing Optimizely.</h1>");
      // if (!$) return this.$container.append("<h1>Error: Missing jQuery.</h1>");

      this.launch();
      // this.textContent = 'Just a basic custom element.';
    } 
    disconnectedCallback(){

    } 
    attributeChangedCallback() {

    }
    
    $makeTabs(tabs){
      let $section = $(`<div class="tab-section">`);
      let $links = $(`<ul class="links">`).appendTo($section);
      let $tabs = $(`<div class="tabs">`).appendTo($section);
      let tabCount = 0;
      for (let t in tabs){
        let [label, $content] = tabs[t];
        // let key = label.replace(/[^\w]/g, '');
        let $tab = $(`<div class="tab"></div>`).append($content).appendTo($tabs);
        let $link = $(`<a href="#">${label}</a>`).appendTo($links).click(e=>{
          e.preventDefault();
          $tabs.find('> .active').removeClass('active');
          $tab.addClass('active');
          $links.find('> li > .active').removeClass('active');
          $link.addClass('active');
        }).wrap('<li>');
        if (!(tabCount++)) $tab.add($link).addClass('active');
      }
      return $section;
    }

    launch() {
      let $display = $(`<div id="ooo_container" class="container"></div>`).appendTo(this.$container);
      this.$stats().appendTo($display);

      let tabs = [];
      if (this.optimizely){
        if (this.optimizelyClassic){
          tabs.push(['OptiClassic', this.$optimizelyClassic()]);
        }
        if (this.optimizelyX){
          tabs.push(['OptiX', this.$optimizelyClassic()]);
        }
      }
      if (this.dynamicYield){
        tabs.push(['Dynamic Yield', $(`<p>coming soon...</p>`)]);
      }
      if (this.monetate){
        tabs.push(['Monetate', $(`<p>coming soon...</p>`)]);
      }
      if (this.sentient){
        tabs.push(['Sentient', $(`<p>coming soon...</p>`)]);
      }
      this.$makeTabs(tabs).addClass('horizontal').appendTo($display);
    }

    $stats(){
      let $section = $(`<h1 class="header center">${window.location.host}</h1>`);
      // let $section = $(
      // `<section class="container">
      //   <div class="well">
      //     <h1 class="header center">${window.location.host}</h1>
      //     <div id="account_stats" class="row">
            
      //     </div>
      //   </div>
      // </section>`);
      // let $info = $section.find('#account_stats');
      // if (this.optimizely){
      //   let hasX = this.optimizely && this.optimizelyX, hasClassic = this.optimizely && this.optimizelyClassic;
      //   $info.append(
      //   `<div class="col">
      //     <div>${hasX?'OptX(✔)':'OptX(✗)'}</div><div>${hasClassic?'Classic(✔)':'Classic(✗)'}</div>
      //   </div>`);
      //   // <div class="col">
      //   //   <u>Account Owner</u><br><span>${this.accountId}</span>
      //   // </div>
      //   // <div class="col">
      //   //   <u>Snippet Revision</u><br><span>${this.revision}</span>
      //   // </div>
      //   // <div class="col">
      //   //   <u>Approx. Library Size</u><br><span>${(JSON.stringify(window.optimizely).length / 1e3).toFixed()} KB</span>
      //   // </div>
      // }
      return $section;
    }

    $optimizelyClassic(){
      let data = this.optimizelyClassic;
      let tabs = [
        ["Info", `<div class="col-3">
          <dl class="box">
            <dt>Account Owner</dt>
            <dd>${data.accountId}</dd>
          </dl>
          <dl class="box">
            <dt>Snippet Revision</dt>
            <dd>${data.revision}</dd>
          </dl>
          <dl class="box">
            <dt>Approx. Library Size</dt>
            <dd>${(JSON.stringify(window.optimizely).length / 1e3).toFixed()} KB</dd>
          </dl>
          <dl class="box">
            <dt>Classic Experiments</dt>
            <dd>${Object.keys(data.experiments).length}</dd>
          </dl>
          <dl class="box">
            <dt>Classic Variations</dt>
            <dd>${Object.keys(data.variations).length}</dd>
          </dl>
          <dl class="box">
            <dt>Classic Audiences</dt>
            <dd>${Object.keys(data.audiences).length}</dd>
          </dl>
        </div>`]
      ];

      // tabs.push(['all experiments', this.renderAudiences()]);
      // tabs.push(['live experiments', $(`<p>
      //   ${Math.random()} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit assumenda maxime necessitatibus illo aliquam consequuntur unde veritatis aspernatur nulla, facere? Excepturi eius maiores suscipit necessitatibus porro nam dolor, adipisci beatae.
      // </p>`)]);
      // tabs.push(['paused experiments', $(`<p>
      //   ${Math.random()} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit assumenda maxime necessitatibus illo aliquam consequuntur unde veritatis aspernatur nulla, facere? Excepturi eius maiores suscipit necessitatibus porro nam dolor, adipisci beatae.
      // </p>`)]);
      // tabs.push(['audiences', $(`<p>
      //   ${Math.random()} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit assumenda maxime necessitatibus illo aliquam consequuntur unde veritatis aspernatur nulla, facere? Excepturi eius maiores suscipit necessitatibus porro nam dolor, adipisci beatae.
      // </p>`)]);
      // tabs.push(['your segments', $(`<p>
      //   ${Math.random()} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit assumenda maxime necessitatibus illo aliquam consequuntur unde veritatis aspernatur nulla, facere? Excepturi eius maiores suscipit necessitatibus porro nam dolor, adipisci beatae.
      // </p>`)]);
      // tabs.push(['all segments', $(`<p>
      //   ${Math.random()} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit assumenda maxime necessitatibus illo aliquam consequuntur unde veritatis aspernatur nulla, facere? Excepturi eius maiores suscipit necessitatibus porro nam dolor, adipisci beatae.
      // </p>`)]);
      // tabs.push(['my experience', $(`<p>
      //   ${Math.random()} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit assumenda maxime necessitatibus illo aliquam consequuntur unde veritatis aspernatur nulla, facere? Excepturi eius maiores suscipit necessitatibus porro nam dolor, adipisci beatae.
      // </p>`)]);

      let experiments = '', live = 0, paused = 0;
      for (let i in data.experiments){
        let item = data.experiments[i];
        experiments += `<label class="segment col-sm-5 label">${item.name}</label>`;
      }
      tabs.push(['Experiments', `
        <h2>Experiments:</h2><hr>
        ${experiments || '<label class="badge badge-danger">There are no Experiments.</label>'}
      `]);

      let audiences = '';
      for (let i in data.audiences){
        let item = data.audiences[i];
        audiences += `<label class="segment col-sm-5 label">${item.name}</label>`;
      }
      tabs.push(['Audiences', `
        <h2>Audiences:</h2><hr>
        ${audiences || '<label class="badge badge-danger">There are no Audiences.</label>'}
      `]);

      let segments = '';
      for (let i in data.segments){
        let item = data.segments[i];
        segments += `<label class="segment col-sm-5 label">${item.name}</label>`;
      }
      tabs.push(['Segments', `
        <h2>Segments:</h2><hr>
        ${segments || '<label class="badge badge-danger">There are no Segments.</label>'}
      `]);

      return this.$makeTabs(tabs).addClass('vertical');
    }

    // $optimizelyX(){
    //   let $optimizely = $(`
    //     <div class="optimizely">
    //       <section id="ooo_container_visitors" class="container">
    //         <div class="well"><br>
    //           <h1 class="header center">This Site: <b>${window.location.host}</b></h1>
    //           <div id='account_stats' class="row">
    //             <div class="col">
    //               <div>${this.X?'OptX(✔)':'OptX(✗)'}</div><div>${this.C?'Classic(✔)':'Classic(✗)'}</div>
    //             </div>
    //             <div class="col">
    //               <u>Account Owner</u><br><span>${this.accountId}</span>
    //             </div>
    //             <div class="col">
    //               <u>Snippet Revision</u><br><span>${this.revision}</span>
    //             </div>
    //             <div class="col">
    //               <u>Approx. Library Size</u><br><span>${(JSON.stringify(window.optimizely).length / 1e3).toFixed()} KB</span>
    //             </div>
    //           </div>
    //           <div class="row">
    //             <div class="col">
    //               <u>X Experiments</u><br><span>${Object.keys(this.xExperiments).length}</span>
    //             </div>
    //             <div class="col">
    //               <u>X Variations</u><br><span>${Object.keys(this.xVariations).length}</span>
    //             </div>
    //             <div class="col">
    //               <u>X Audiences</u><br><span>${Object.keys(this.xAudiences).length}</span>
    //             </div>
    //             <div class="col">
    //               <u>X Campaigns</u><br><span>${Object.keys(this.xCampaigns).length}</span>
    //             </div>
    //           </div>
    //           <div class="row">
    //             <div class="col">
    //               <u>Classic Experiments</u><br><span>${Object.keys(this.experiments).length}</span>
    //             </div>
    //             <div class="col">
    //               <u>Classic Variations</u><br><span>${Object.keys(this.variations).length}</span>
    //             </div>
    //             <div class="col">
    //               <u>Classic Audiences</u><br><span>${Object.keys(this.audiences).length}</span>
    //             </div>
    //           </div>
    //         </div><br>
    //         <div id="ooo_filters" class="row center">
    //           <div class="btn-group" data-toggle="buttons">
    //             <span style="font-weight:bolder;font-size:16px;">Experiment Status:&emsp;</span>
    //             <button class="btn info btn-info" filter="all">ALL EXPERIMENTS</button>
    //             <button class="btn info btn-info" filter="live">LIVE EXPERIMENTS</button>
    //             <button class="btn info btn-info" filter="paused">PAUSED EXPERIMENTS</button>
    //           </div><br>
    //           <div id="view_people" class="btn-group" data-toggle="button">
    //             <span style="font-weight:bolder;font-size:16px;">Browse Visitor Criteria:&emsp;</span>
    //             <button class="btn btn-warning" show="ooo_audiences" id="view_audiences">AUDIENCES</button>
    //             <button class="btn btn-warning" show="ooo_visitor_you" id="view_visitor_you">YOUR SEGMENTS</button>
    //             <button class="btn btn-warning" show="ooo_visitor_all" id="view_visitor_all">ALL SEGMENTS</button>
    //             <button class="btn btn-warning btn-lg" show="my_variants" id="show_my_variants">MY EXPERIENCE</button>
    //           </div>
    //           <hr>
    //           <section id="ooo_container_visitor" class="container">
    //             <div class="row-fluid">
    //               <div style="display:none;" id="ooo_audiences" class="well blue col-xs-12">
    //                 <a class="closeme">CLOSE</a> ${this.renderAudiences()}
    //               </div>
    //               <div style="display:none;" id="ooo_visitor_you" class="well blue col-xs-12">
    //                 <a class="closeme">CLOSE</a> ${this.renderYourSegments()}
    //               </div>
    //               <div style="display:none;" id="ooo_visitor_all" class="well blue col-xs-12">
    //                 <a class="closeme">CLOSE</a> ${this.renderAllSegments()}
    //               </div>
    //               <div id="my_variants" class="center well alert alert-info" style="display:none">
    //                 <a class="closeme">CLOSE</a> ${this.renderMyVariants()}
    //               </div>
    //             </div>
    //           </section>

    //         </div>

    //       </section>
    //     </div>
    //   `);
    //   let $optimizelyExperiments = $('<section id="ooo_containerExperiments" class="container"></section>').appendTo($optimizely),
    //       $alert = $(`
    //         <div id="alert" class="center well alert alert-warning" style="display:none;">
    //           <a class="closeme">CLOSE</a>
    //         </div>`).appendTo($optimizely);

    //   $.each(this.getExperimentId().reverse(), (e, t)=>{
    //     $optimizelyExperiments.append(this.addExperiment(t));
    //   });
    //   $optimizely.find(".closeme").click(function (){
    //     $(this).parent().hide();
    //     $optimizely.find("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active");
    //   });
    //   $optimizely.find("[filter]").click(function (){
    //     $optimizely.find("[experiment_id]").hide();
    //     let filter = $(this).attr("filter");
    //     $optimizely.find("#ooo_container_visitor > div > div").hide();
    //     let $experiments = $optimizelyExperiments.find("." + filter + "Experiment").show();
    //     if ($experiments.length){
    //       $alert.html("").css("display", "none");
    //     }else{
    //       $alert.css("display", "block").html("<h2> There are no " + (filter == "ooo" ? "" : filter) + " experiments to show :(");
    //     }
    //   });
    //   $optimizely.find("#view_people button").click(function (){
    //     let $this = $(this),
    //       t = $this.attr("show"),
    //       r = $optimizely.find("#" + t),
    //       i = r.is(":visible");
    //     $optimizely.find("#ooo_container_visitor .well").hide();
    //     r.css("display", i ? "none" : "block");
    //     $optimizely.find("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active");
    //   });
    //   $optimizely.find("#show_my_variants").click(function (){
    //     let $this = $(this),
    //       t = $optimizely.find($this.attr("show")),
    //       r = t.is(":visible");
    //     t.css("display", r ? "none" : "block");
    //     $optimizely.find("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active");
    //   });
    //   return $optimizely;
    // }


    
    getExperimentId(id) {
      if (!id) return Object.keys(this.experiments);
      return !this.experiments[id] ? alert("Experiment #" + id + " not found.") : this.experiments[id];
    }
    getExperimentName(id) {
      return this.isExperiment(id) ? this.experiments[id].name : false;
    }
    addExperiment(id) {
      let experiment = this.experiments[id] || {},
        variations = experiment.variation_ids || {},
        varCount = Object.keys(variations).length,
        active = ~$.inArray(id, this.state.activeExperiments);
      
      let variationsLabel = `${experiment.section_ids.length ? `MVT (${experiment.section_ids.length} Elements)` : "A/B/n"} | ${varCount} Variations`;
      let statusLabel = active ? `<label style="font-size:100%;" class="label label-success label-large show_variations">LIVE</label>`:`<label style="font-size:100%;" class="label label-grey">Not Running</label>`;
      let $experiment = $(`<div experiment_id="${id}" class="row ${active?" liveExperiment":" pausedExperiment"} allExperiment">
        <i class="icon-plus"></i>
         <h3><a class="experiment_name">${this.getExperimentName(id)}</a></h3>&emsp;
         <code class="show_variations">Experiment ID: ${id}</code>&emsp;
         <code class="show_variations">${variationsLabel}</code>&emsp;
         ${statusLabel}&emsp;
         ${(varCount ? `<button class="show_variations btn btn-danger">View Variations</button>`: "")} &emsp;
         ${(experiment.manual ? `<label class="label label-warning">Manually Activated</label>`: "")}
         ${(experiment.code ? `&emsp;<button class="show_code btn btn-small btn-info">View Script</button><pre class="pre-scrollable script_display" style="display:none;">${this.htmlspecialchars(experiment.code)}</pre>` : "")}
         <section style="display:none;" class="variation_section container"></section>
      </div>`);
      let $variationsSection = $experiment.find(".variation_section").append(this.renderVariationsSection(id));
      $experiment.find(".show_variations").click(function (){
        $variationsSection.toggle();
        $experiment.find("button.show_variations").text($variationsSection.is(":visible") ? "Hide Variations" : "View Variations");
      });
      $experiment.find(".show_code").click(function (){
        let $this = $(this), $code = $this.parent().find("pre");
        $code.toggle();
        $this.text($code.is(":visible") ? "Hide Script" : "View Script");
      });
      return $experiment;
    }
    renderYourSegments() {
      if (!this.visitor.segments) return "<h2 class='center'><label class='badge badge-danger'>You are not part of any segments!</label></h2>";
      let r = this.visitor.segments,
        i = 0,
        s = "<h2>Here are the segments you are part of: </h2><br><br>";
      $.each(r, (n, r)=>{
        if (!this.segments[n]) return;
        s += "<label class='segment col-sm-5 label label-" + COLORS[i] + "'>" + this.segments[n].name + " = " + r + "</label>";
        i = i == 3 ? 0 : i + 1;
      });
      return s;
    }
    renderAllSegments() {
      if (!this.segments) return "<h2 class='center'><label class='badge badge-danger'>There are no segments created.</label></h2>";
      let r = "<h2>Here are all segments being targeted towards on this site: </h2><hr>",
        i = 0;
      $.each(this.segments, (n, s)=>{
        r += "<label class='segment col-sm-5 label label-" + COLORS[i] + "'>" + this.segments[n].name + "</label>";
        i = i == 3 ? 0 : i + 1;
      });
      return r;
    }
    renderMyVariants() {
      let t = window.optimizely.variationNamesMap || {},
        r = 0,
        i = "<h2>Here are the tests and variations you are currently a part of!</h2>";
      if (!t || !Object.keys(t).length) return "<h2 class='center'><label class='badge badge-danger'>You are not in any experiments! Shame...</label></h2>";
      $.each(t, (t, n)=>{
        i += "<label class='segment col-sm-12 label label-" + COLORS[r] + "' style='width:90%;left:5%;'>&emsp;" + this.experiments[t].name + " - &emsp;<code>" + n + "</code></label>";
        r = r == 3 ? 0 : r + 1;
      });
      return i;
    }
    renderAudiences() {
      if (!this.audiences) return "<h2 class='center'><label badge badge-danger'>There are no audiences created.</label></h2>";
      let r = 0,
        i = "<h2>Here are all audiences being observed in analytics on this site: </h2><hr>";
      $.each(this.audiences, (t, n)=>{
        i += "<label class='segment col-sm-5 label label-" + COLORS[r] + "'>" + n.name + "</label>";
        r = r == 3 ? 0 : r + 1;
      });
      return i;
    }
    renderVariationsSection(eId) { //was render_experiment_page
      let experiment = this.experiments[eId];
      let $variations = $("<div/>");
      $.each(experiment.variation_ids, (index, vId)=>{
        let name = this.variations[vId].name;
        let code =  this.variations[vId].code;
        let previewLink = (()=>{
          let link = location.href;
          link += (link.split("?")[1] ? "&" : "?") + "optimizely_x" + eId + "=" + index;
          return `<a href="${link}" class="pull-right btn btn-primary" target="_blank">Preview Variation</a>`;
        })();
        let $variation = $(`
          <div class="row oooExperiment_variation" variation_id="${vId}">
            <div class="col-sm-3">
              <h3>${name} ${previewLink}</h3>
            </div>
            <div class="col-sm-9">
              <pre class="col-sm-12">${(code ? this.htmlspecialchars(code) : "Empty Variant Code")}</pre>
            </div>
          </div>
        `);
        $variations.append($variation).append("<hr>");
      });
      return $variations;
    }
    isExperiment(e) {
      return !!this.experiments[e];
    }
    isVariation(e) {
      return !!this.variations[e];
    }
    htmlspecialchars(e) {
      return e.replace(/&/g, "&").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
  }
  // Define the new element
  let int = Math.random().toString().substr(2), name = 'optimizely-analysis-'+int;
  customElements.define(name, Esper);
  let esper = document.createElement(name);
  document.body.appendChild(esper);
})();