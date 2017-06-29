(function (e, t) {
    var n = window.jQuery || window.$ || window.optimizely && window.optimizely.$;
    n("head").append("<scr" + "ipt>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-49590743-2', 'derp',{'name': 'optimizelyspytool'});ga('optimizelyspytool.send', 'pageview','/" + (!t ? "x/" : "") + "'+location.hostname);</sc" + "ript>");
    n("#opt_container,#opt_styles,#opt_backdrop").remove();
    n("body").append("<div id='opt_backdrop'/>");
    n("head").append("<style id='opt_styles'>            #opt_backdrop {position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:99999998}            #opt_container{                position:fixed;                overflow-y:auto;                background:#FFF;                padding:20px;                left:50%;top:50%;                border-radius:4px;                box-shadow:0 0 28px -1px black;                -webkit-box-shadow:0 0 28px -1px black;                min-width:300px;                min-height:300px;                z-index:99999999;            }            #account_stats > p {                width: 25%;float: left;text-align: center;font-size:20px;            }            .center {text-align:center;}            #opt_container code {padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;white-space:nowrap;border-radius:4px;}            #opt_container .container {width:100% !important;}            #opt_container b {font-weight:bold !important;}            #opt_container label {display:inline-block;margin: 5px;padding: 5px;border-radius: 3px;color: black;}            #opt_container .btn {padding:10px;border-radius:2px;-webkit-border-radius:2px;cursor:pointer;border:1px solid transparent;}            #opt_container .btn-info,#opt_container .label-info {background:#428bca;border-color:#357ebd;}            #opt_container .btn-info:hover,#opt_container .label-info:hover {background:#3276b1;border-color:#285e8e;}            #opt_container .btn-success,#opt_container .label-success {background:#5cb85c;border-color:#4cae4c;}            #opt_container .btn-success:hover,#opt_container .label-success:hover {background:#47a447;border-color:#398439;}            #opt_container .btn-warning, #opt_container .label-warning{background:#f0ad4e;border-color:#eea236}            #opt_container .btn-warning:hover, #opt_container .label-warning:hover{background:#ed9c28;border-color:#d58512;}            #opt_container .btn-danger, #opt_container .label-danger{background:#d9534f;border-color#d43f3a;}            #opt_container .btn-danger:hover, #opt_container .label-danger:hover{background:#d2322d;border-color#ac2925;}            #opt_container .btn-primary, #opt_container .label-primary{background:#428bca;color:black !important;border-color:#357ebd;}            #opt_container .btn-primary:hover, #opt_container .label-primary:hover{background:#3276b1;border-color#285e8e;}   #opt_container pre {width:95%;overflow:hidden;word-wrap:break-word;}         #opt_container .row {width:100%;display:inline-block;margin:0;padding:5px;}            #opt_container .well {background-color:#f5f5f5;padding:10px;border:1px solid #e3e3e3;box-shadow:inset 0 1px 1px rgba(0,0,0,.05);-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);}  #opt_container .pull-right {float:right} #opt_container .pull-left {float:left;}          #opt_container .closeme {position: relative;top: -7px;right: -47%;cursor: pointer;font-size: 10px;background: #FFF;color:#35AFE3;border-radius: 8px;padding: 4px;}        </style>");
    n("body").append(n("<div id='opt_container'/>"));
    n("#opt_backdrop").click(function () {
        n("#opt_backdrop,#opt_container").remove()
    });
    if (!t) return n("#opt_container").append("<h1>Missing optimizely code.</h1>");
    var r = t.data || {},
        i = r.audiences || {},
        s = r.variations || {},
        o = r.experiments || {},
        u = r.segments || {},
        a = r.visitor || {};
    window.ooo = {
        o: t,
        d: r,
        a: i,
        v: s,
        e: o,
        s: u,
        vi: a,
        init: function () {
            this.launch();
            n(window).resize(this.resize);
            this.resize()
        },
        resize: function () {
            var e = n(window).width(),
                t = n(window).height();
            n("#opt_container").css({
                height: t / 1.25 + "px",
                width: e / 1.5 + "px",
                "margin-top": "-" + t / 2.5 + "px",
                "margin-left": "-" + e / 3 + "px"
            })
        },
        get_experiment_id: function (e) {
            if (!e) return Object.keys(this.e);
            return !this.e[e] ? alert("Experiment #" + e + " not found.") : this.e[e]
        },
        get_experiment_name: function (e) {
            return this.is_experiment(e) ? this.e[e].name : false
        },
        launch: function () {
            var r = this;
            n("#opt_container").append("                    <div id='ooo_container' class='container'>                        <section id='ooo_container_visitors' class='container'>                            <div class='well'><br>                                <h1 class='header center'>This Site: <b>" + e.location.host + "</b></h1>                                <div id='account_stats' class='row' style=''>                                    <p class='col-xs-3'><u>Total Experiments</u><br><span>" + Object.keys(o).length + "</span></p>                                    <p class='col-xs-3'><u>Approx. Library Size</u><br><span>" + (JSON.stringify(t).length / 1e3).toFixed() + " KB</span></p>                                    <p class='col-xs-3'><u>Total Variations</u><br><span>" + Object.keys(s).length + "</span></p>                                    <p class='col-xs-3'><u>Account Owner</u><br><span>" + function () {
                return t.getAccountId()
            }() + "</span></p>                                </div>                            </div><br>                            <div id='ooo_filters' class='row center'>                                <div class='btn-group' data-toggle='buttons'>                                    <span style='font-weight:bolder;font-size:16px;'>Experiment Status:&emsp;</span>                                    <button class='btn info btn-info' filter='all' >                                        ALL EXPERIMENTS                                    </button>                                    <button class='btn info btn-info' filter='live' >                                        LIVE EXPERIMENTS                                    </button>                                    <button class='btn info btn-info' filter='paused' >                                        PAUSED EXPERIMENTS                                    </button>                                </div><br>                                <div id='view_people' class='btn-group' data-toggle='button'>                                    <span style='font-weight:bolder;font-size:16px;'>Browse Visitor Criteria:&emsp;</span>                                    <button class='btn btn-warning' show='ooo_audiences' id='view_audiences' >AUDIENCES</button>                                    <button class='btn btn-warning' show='ooo_visitor_you' id='view_visitor_you'>YOUR SEGMENTS</button>                                    <button class='btn btn-warning' show='ooo_visitor_all' id='view_visitor_all'>ALL SEGMENTS</button>                                    <button class='btn btn-warning btn-lg' show='my_variants' id='show_my_variants'>MY EXPERIENCE</button>                                </div>                                <hr>                                <section id='ooo_container_visitor' class='container'>                                    <div class='row-fluid'>                                        <div style='display:none;' id='ooo_audiences' class='well blue col-xs-12'>                                            <a class='closeme'>CLOSE</a>                                            " + r.render_audiences() + "                                        </div>                                        <div style='display:none;' id='ooo_visitor_you' class='well blue col-xs-12'>                                            <a class='closeme'>CLOSE</a>                                            " + r.render_your_segments() + "                                        </div>                                        <div style='display:none;' id='ooo_visitor_all' class='well blue col-xs-12'>                                            <a class='closeme'>CLOSE</a>                                            " + r.render_all_segments() + "                                        </div>                                        <div id='my_variants' class='center well alert alert-info' style='display:none'>                                            <a class='closeme'>CLOSE</a>                                            " + this.render_my_variants() + "                                        </div>                                    </div>                                </section>                                                            </div>                            <div id='alert' class='center well alert alert-warning' style='display:none;'>                                <a class='closeme'>CLOSE</a>                            </div>                        </section>                        <section id='ooo_container_experiments' class='container'>                        </section>                    </div>                </body></html>");
            var i = function () {
                n.each(r.get_experiment_id().reverse(), function (e, t) {
                    n("body").find("#ooo_container_experiments").append(r.add_experiment(t))
                });
                n(".closeme").click(function () {
                    n(this).parent().hide();
                    n("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active")
                });
                n(".show_variations, .experiment_name").click(function () {
                    var e = n(this),
                        t = e.parents(".ooo_experiment");
                    t.find(".variation_section").toggle();
                    t.find("button.show_variations").text(t.find(".variation_section").is(":visible") ? "HIDE VARIATIONS" : "VIEW VARIATIONS")
                });
                n(".nav > li").click(function () {
                    n("#ooo_container > section").hide();
                    switch (n(this).attr("id")) {
                    case "nav_experiments":
                        n("#ooo_container_experiments").show();
                        break;
                    case "nav_variatuions":
                        n("#ooo_container_variations").show();
                        break
                    }
                });
                n(".show_code").click(function () {
                    var e = n(this);
                    e.parent().find("pre").toggle();
                    e.text(e.parent().find("pre").is(":visible") ? "Hide Campaign Script" : "View Campaign Script")
                });
                n("[filter]").click(function () {
                    n("[experiment_id]").hide();
                    var e = n(this).attr("filter");
                    n("#ooo_container_visitor > div > div").hide();
                    if (e == "all") {
                        n("[experiment_id").show();
                        n("#alert").html("").hide();
                        return
                    }
                    var t = "." + e + "_experiment";
                    n(t).show();
                    n("#alert").css("display", n(t).length ? "none" : "block").html(n(t).length ? "" : "<h2> There are no " + (e == "ooo" ? "" : e) + " experiments to show :(")
                });
                n("#view_people button").click(function () {
                    var e = n(this),
                        t = e.attr("show"),
                        r = n("#" + t),
                        i = r.is(":visible");
                    n("#ooo_container_visitor .well").hide();
                    r.css("display", i ? "none" : "block");
                    n("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active")
                });
                n("#show_my_variants").click(function () {
                    var e = n(this),
                        t = n(e.attr("show")),
                        r = t.is(":visible");
                    t.css("display", r ? "none" : "block");
                    n("#ooo_filters > div >  button, #ooo_filters > div > label").removeClass("active")
                })
            };
            var u = 1,
                a = setInterval(function () {
                    if (u > 5) {
                        clearInterval(a);
                        return p.document.write("<h2> Failed to load. Please try clicing the bookmark again</h2>")
                    }
                    if (!n) return u++;
                    clearInterval(a);
                    i()
                }, 100)
        },
        add_experiment: function (e) {
            var t = this,
                r = t.e[e] || {},
                i = r.variation_ids || {},
                s = Object.keys(i).length || 0,
                o = t.get_experiment_name(e),
                u = r.manual || false,
                a = ~n.inArray(e, t.d.state.activeExperiments),
                f = a ? " live_experiment" : " paused_experiment",
                l = r.section_ids.length,
                c = r.code || "",
                h = n("<div experiment_id='" + e + "' class='row " + f + "'/>");
            h.append("<div  class='col-sm-12 well ooo_experiment' experiment_container_id='" + e + "'>                    <i class='icon-plus'></i> <h3><a class='experiment_name' >" + o + "</a></h3>                    &emsp;<code class='show_variations'>Experiment ID: " + e + "</code>                    &emsp;<code class='show_variations'>" + (l ? "MVT (" + l + " Elements)" : "A/B/n") + " |                     " + s + " Variations</code>                    &emsp;" + (a ? "<label style='font-size:100%;' class='label label-success label-large show_variations'>LIVE</label>" : "<label style='font-size:100%;' class='label label-grey'>Not Running</label>") + "                    &emsp;" + (s ? "<button class='show_variations btn btn-danger'>VIEW VARIATIONS</button>" : "") + "                    &emsp;" + (u ? "<label class='label label-warning'>Manually Activated</label>" : "") + "                    " + (c ? "&emsp;<button class='show_code btn btn-small btn-info'>VIEW SCRIPTS</button><pre class='pre-scrollable script_display' style='display:none;'></pre>" : "") + "                    <section style='display:none;' id='' class='variation_section container'></section>                </div>");
            h.find("pre.script_display").text(c);
            h.find(".variation_section").append(t.render_experiment_page(e));
            return h
        },
        render_your_segments: function () {
            if (!a.segments) return "<h2 class='center'><label class='badge badge-danger'>You are not part of any segments!</label></h2>";
            var e = this,
                t = e.s,
                r = a.segments,
                i = 0,
                s = "<h2>Here are the segments you are part of: </h2><br><br>";
            n.each(r, function (n, r) {
                if (!t[n]) return;
                s += "<label class='segment col-sm-5 label label-" + e.colors[i] + "'>" + t[n].name + " = " + r + "</label>";
                i = i == 3 ? 0 : i + 1
            });
            return s
        },
        render_all_segments: function () {
            if (!this.s) return "<h2 class='center'><label class='badge badge-danger'>There are no segments created.</label></h2>";
            var e = this,
                t = e.s,
                r = "<h2>Here are all segments being targeted towards on this site: </h2><hr>",
                i = 0;
            n.each(t, function (n, s) {
                r += "<label class='segment col-sm-5 label label-" + e.colors[i] + "'>" + t[n].name + "</label>";
                i = i == 3 ? 0 : i + 1
            });
            return r
        },
        render_my_variants: function () {
            var e = this,
                t = e.o.variationNamesMap || {},
                r = 0,
                i = "<h2>Here are the tests and variations you are currently a part of!</h2>";
            if (!t || !Object.keys(t).length) return "<h2 class='center'><label class='badge badge-danger'>You are not in any experiments! Shame...</label></h2>";
            n.each(t, function (t, n) {
                i += "<label class='segment col-sm-12 label label-" + e.colors[r] + "' style='width:90%;left:5%;'>&emsp;" + e.e[t].name + " - &emsp;<code>" + n + "</code></label>";
                r = r == 3 ? 0 : r + 1
            });
            return i
        },
        render_audiences: function () {
            if (!this.a) return "<h2 class='center'><label badge badge-danger'>There are no audiences created.</label></h2>";
            var e = this,
                t = this.a,
                r = 0,
                i = "<h2>Here are all audiences being observed in analytics on this site: </h2><hr>";
            n.each(this.a, function (t, n) {
                i += "<label class='segment col-sm-5 label label-" + e.colors[r] + "'>" + n.name + "</label>";
                r = r == 3 ? 0 : r + 1
            });
            return i
        },
        render_experiment_page: function (e) {
            var t = this,
                r = t.ooo_popup,
                i = t.e[e] || {},
                o = i.name,
                u = function () {
                    var e = {};
                    var r = -1;
                    n.each(i.variation_ids, function (n, i) {
                        r++;
                        if (!t.v[i]) return console.log("Variation " + i + " not found.");
                        e[i] = {
                            id: i,
                            code: s[i].code,
                            name: s[i].name,
                            index: r
                        }
                    });
                    return e
                }();
            var a = n("<div/>");
            n.each(u, function (r, i) {
                var s = n("<div class='row ooo_experiment_variation' variation_id='" + i.id + "'/>"),
                    o = function () {
                        var t = location.href;
                        t += (t.split("?")[1] ? "&" : "?") + "optimizely_x" + e + "=" + i.index;
                        return t
                    }();
                s.append("<div class='col-sm-3'><h3>" + i.name + " " + (!o ? "" : "<a href='" + o + "' class='pull-right btn btn-primary'>Preview Variation</a>") + "</h3>                    </div>                    <div class='col-sm-9'>                        <pre class='col-sm-12'>" + (i.code ? t.htmlspecialchars(i.code) : "Empty Variant Code") + "</pre>                    </div>");
                a.append(s).append("<hr>")
            });
            return a
        },
        is_experiment: function (e) {
            return !!this.e[e]
        },
        is_variation: function (e) {
            return !!this.v[e]
        },
        htmlspecialchars: function (e) {
            return e.replace(/&/g, "&").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
        },
        colors: ["success", "danger", "warning", "primary", "info"],
        end: ""
    };
    e.ooo.init()
})(window, window.optimizely)