/* jshint esversion: 6 */
(function(){
  'use strict';
  let $ = window.jQuery || window.$ || window.optimizely && window.optimizely.$;

  if (!$ || !$.fn || !$.fn.jquery){
    alert('jQuery is required, but not found.');
    return;
  }

  const COLORS = ["success", "danger", "warning", "primary", "info"];
  const end = "";

  class Esper extends HTMLElement{
    constructor(){
      super();
      let shadow = this.attachShadow({mode: 'closed'});
      let stylesheet = document.createElement('style');
      stylesheet.innerHTML = Esper.styles

      // $("#opt_container,#opt_styles,#opt_backdrop").remove();
      this.$container = $("<div id='opt_container'/>");
      this.$backdrop = $("<div id='opt_backdrop'/>").click(()=>{
        this.remove();
      });
      
      
      //note: old jQuery isn't able to work with the shadow dom, so do it native.
      shadow.appendChild(stylesheet);
      shadow.appendChild(this.$container[0]);
      shadow.appendChild(this.$backdrop[0]);

      if (!window.optimizely) return this.$container.append("<h1>Error: Missing Optimizely.</h1>");
      if (!$) return this.$container.append("<h1>Error: Missing jQuery.</h1>");
      
      //TODO: USE window.optimizely.get('data')
      let data = window.optimizely.data || {};
      let xData = window.optimizely.get && window.optimizely.get('data') || {};

      this.X = !!window.optimizely.get;
      this.C = !!window.optimizely.getAccountId;
      this.state = data.state || {};
      this.audiences = data.audiences || {};
      this.xAudiences = xData.audiences || {};
      this.variations = data.variations || {};
      this.xVariations = xData.variations || {};
      this.experiments = data.experiments || {};
      this.xExperiments = xData.experiments || {};
      this.xCampaigns = xData.campaigns || {};
      this.segments = data.segments || {};
      this.visitor = data.visitor || {};
      this.accountId = xData.accountId || window.optimizely.getAccountId();
      this.revision = optimizely.revision || xData.revision;

      this.launch();
      $(window).resize(this.resize);
      this.resize();
    }
    resize(){
      let w = $(window).width(), h = $(window).height();
      this.$container.css({
        height: h / 1.25 + "px",
        width: w / 1.5 + "px",
        "margin-top": "-" + h / 2.5 + "px",
        "margin-left": "-" + w / 3 + "px"
      });
    }
    launch() {
      let $display = $(`
        <div id="ooo_container" class="container">
          <section id="ooo_container_visitors" class="container">
            <div class="well"><br>
              <h1 class="header center">This Site: <b>${window.location.host}</b></h1>
              <div id='account_stats' class="row">
                <div class="col">
                  <div>${this.X?'OptX(✔)':'OptX(✗)'}</div><div>${this.C?'Classic(✔)':'Classic(✗)'}</div>
                </div>
                <div class="col">
                  <u>Account Owner</u><br><span>${this.accountId}</span>
                </div>
                <div class="col">
                  <u>Snippet Revision</u><br><span>${this.revision}</span>
                </div>
                <div class="col">
                  <u>Approx. Library Size</u><br><span>${(JSON.stringify(window.optimizely).length / 1e3).toFixed()} KB</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <u>X Experiments</u><br><span>${Object.keys(this.xExperiments).length}</span>
                </div>
                <div class="col">
                  <u>X Variations</u><br><span>${Object.keys(this.xVariations).length}</span>
                </div>
                <div class="col">
                  <u>X Audiences</u><br><span>${Object.keys(this.xAudiences).length}</span>
                </div>
                <div class="col">
                  <u>X Campaigns</u><br><span>${Object.keys(this.xCampaigns).length}</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <u>Classic Experiments</u><br><span>${Object.keys(this.experiments).length}</span>
                </div>
                <div class="col">
                  <u>Classic Variations</u><br><span>${Object.keys(this.variations).length}</span>
                </div>
                <div class="col">
                  <u>Classic Audiences</u><br><span>${Object.keys(this.audiences).length}</span>
                </div>
              </div>
            </div><br>
            <div id="ooo_filters" class="row center">
              <div class="btn-group" data-toggle="buttons">
                <span style="font-weight:bolder;font-size:16px;">Experiment Status:&emsp;</span>
                <button class="btn info btn-info" filter="all">ALL EXPERIMENTS</button>
                <button class="btn info btn-info" filter="live">LIVE EXPERIMENTS</button>
                <button class="btn info btn-info" filter="paused">PAUSED EXPERIMENTS</button>
              </div><br>
              <div id="view_people" class="btn-group" data-toggle="button">
                <span style="font-weight:bolder;font-size:16px;">Browse Visitor Criteria:&emsp;</span>
                <button class="btn btn-warning" show="ooo_audiences" id="view_audiences">AUDIENCES</button>
                <button class="btn btn-warning" show="ooo_visitor_you" id="view_visitor_you">YOUR SEGMENTS</button>
                <button class="btn btn-warning" show="ooo_visitor_all" id="view_visitor_all">ALL SEGMENTS</button>
                <button class="btn btn-warning btn-lg" show="my_variants" id="show_my_variants">MY EXPERIENCE</button>
              </div>
              <hr>
              <section id="ooo_container_visitor" class="container">
                <div class="row-fluid">
                  <div style="display:none;" id="ooo_audiences" class="well blue col-xs-12">
                    <a class="closeme">CLOSE</a> ${this.renderAudiences()}
                  </div>
                  <div style="display:none;" id="ooo_visitor_you" class="well blue col-xs-12">
                    <a class="closeme">CLOSE</a> ${this.renderYourSegments()}
                  </div>
                  <div style="display:none;" id="ooo_visitor_all" class="well blue col-xs-12">
                    <a class="closeme">CLOSE</a> ${this.renderAllSegments()}
                  </div>
                  <div id="my_variants" class="center well alert alert-info" style="display:none">
                    <a class="closeme">CLOSE</a> ${this.renderMyVariants()}
                  </div>
                </div>
              </section>

            </div>
            <div id="alert" class="center well alert alert-warning" style="display:none;">
              <a class="closeme">CLOSE</a>
            </div>
          </section>
          <section id="ooo_containerExperiments" class="container">
          </section>
        </div>
      `).appendTo(this.$container);

      let $displayExperiments = $display.find('#ooo_containerExperiments'),
          $alert = $display.find("#alert");

      $.each(this.getExperimentId().reverse(), (e, t)=>{
        $displayExperiments.append(this.addExperiment(t));
      });
      $display.find(".closeme").click(function (){
        $(this).parent().hide();
        $display.find("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active");
      });
      $display.find("[filter]").click(function (){
        $display.find("[experiment_id]").hide();
        let filter = $(this).attr("filter");
        $display.find("#ooo_container_visitor > div > div").hide();
        let $experiments = $displayExperiments.find("." + filter + "Experiment").show();
        if ($experiments.length){
          $alert.html("").css("display", "none");
        }else{
          $alert.css("display", "block").html("<h2> There are no " + (filter == "ooo" ? "" : filter) + " experiments to show :(");
        }
      });
      $display.find("#view_people button").click(function (){
        let $this = $(this),
          t = $this.attr("show"),
          r = $display.find("#" + t),
          i = r.is(":visible");
        $display.find("#ooo_container_visitor .well").hide();
        r.css("display", i ? "none" : "block");
        $display.find("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active");
      });
      $display.find("#show_my_variants").click(function (){
        let $this = $(this),
          t = $display.find($this.attr("show")),
          r = t.is(":visible");
        t.css("display", r ? "none" : "block");
        $display.find("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active");
      });
    }
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
    static get styles(){
      return `
        :host{
          font-size: 13px;
        }

        #opt_backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .4);
          z-index: 99999998
        }
        #opt_container {
          position: fixed;
          overflow-y: auto;
          background: #FFF;
          padding: 20px;
          left: 50%;
          top: 50%;
          border-radius: 4px;
          box-shadow: 0 0 28px -1px black;
          -webkit-box-shadow: 0 0 28px -1px black;
          min-width: 300px;
          min-height: 300px;
          z-index: 99999999;
        }
        .well .col {
          width: 25%;
          float: left;
          text-align: center;
        }
        .center {
          text-align: center;
        }
        code {
          padding: 2px 4px;
          font-size: 90%;
          color: #c7254e;
          background-color: #f9f2f4;
          white-space: nowrap;
          border-radius: 4px;
        }
        .container {
          width: 100% !important;
        }
        b {
          font-weight: bold !important;
        }
        label {
          display: inline-block;
          margin: 5px;
          padding: 5px;
          border-radius: 3px;
          color: black;
        }
        .btn {
          padding: 10px;
          border-radius: 2px;
          -webkit-border-radius: 2px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .btn-info,
        .label-info {
          background: #428bca;
          border-color: #357ebd;
        }
        .btn-info:hover,
        .label-info:hover {
          background: #3276b1;
          border-color: #285e8e;
        }
        .btn-success,
        .label-success {
          background: #5cb85c;
          border-color: #4cae4c;
        }
        .btn-success:hover,
        .label-success:hover {
          background: #47a447;
          border-color: #398439;
        }
        .btn-warning,
        .label-warning {
          background: #f0ad4e;
          border-color: #eea236
        }
        .btn-warning:hover,
        .label-warning:hover {
          background: #ed9c28;
          border-color: #d58512;
        }
        .btn-danger,
        .label-danger {
          background: #d9534f;
          border-color#d43f3a;
        }
        .btn-danger:hover,
        .label-danger:hover {
          background: #d2322d;
          border-color#ac2925;
        }
        .btn-primary,
        .label-primary {
          background: #428bca;
          color: black !important;
          border-color: #357ebd;
        }
        .btn-primary:hover,
        .label-primary:hover {
          background: #3276b1;
          border-color#285e8e;
        }
        pre {
          width: 95%;
          overflow: hidden;
          word-wrap: break-word;
        }
        .row {
          width: 100%;
          display: inline-block;
          margin: 0;
          padding: 5px;
        }
        .well {
          background-color: #f5f5f5;
          padding: 10px;
          border: 1px solid #e3e3e3;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
        }
        .pull-right {
          float: right
        }
        .pull-left {
          float: left;
        }
        .closeme {
          position: relative;
          top: -7px;
          right: -47%;
          cursor: pointer;
          font-size: 10px;
          background: #FFF;
          color: #35AFE3;
          border-radius: 8px;
          padding: 4px;
        }
        .segment {
          float:none
        }`;
    }
  }
  // Define the new element
  let int = Math.random().toString().substr(2), name = 'optimizely-analysis-'+int;
  customElements.define(name, Esper);
  let esper = document.createElement(name);
  document.body.appendChild(esper);
})();