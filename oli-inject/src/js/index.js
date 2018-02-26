const Url = require('url');

let $template = (popup, json) => {
  let parentUri = Url.parse(popup.url);
  console.log(popup, json, parentUri);

  const getNewUrl = (paramValue, optimizelyDisable = false) => {
    let query = parentUri.query && parentUri.query.replace(new RegExp(`${json.query_param}=[^&]*`, 'ig'), '').replace(/^&+/, '') || '';
    if (optimizelyDisable && query.indexOf('optimizely_disable=true') === -1) query = 'optimizely_disable=true' + (query.length ? '&' + query : '');
    return `${parentUri.protocol}//${parentUri.host}${parentUri.pathname}?${json.query_param}=${paramValue}${query.length ? '&' + query : ''}${parentUri.hash || ''}`;
  };

  const setParam = (...args) => {
    window.opener.location = getNewUrl(...args);
    window.close();
  };
  let $el = $('<div>');

  if (json.pages) {
    $el.append(`<h3>Variations:</h3>`);
    let $ol = $(`<ol start="0">`).appendTo($el);
    for (let variation of json.variations) {
      let $vLi = $(`<li>`).appendTo($ol);
      $vLi.append(`<h4>${variation.name}</h4>`);
      $vLi.append(`<h5>Pages:</h5>`);
      let $ul = $(`<ul style="padding-left: 20px;">`).appendTo($vLi);
      for (let page of json.pages) {
        let tag = variation.tag + '.' + page.tag;
        let $li = $(`<li>
            <br>
            <ID: <code>${tag}</code><br>
            <small><a target="_blank" href="/${tag}.js">${tag}.js</a></small>
            <small><a target="_blank" href="/${tag}.css">${tag}.css</a></small>
          </li>`).appendTo($ul);
        $(`<a href="${getNewUrl(tag,true)}" class="btn btn-primary">${page.name} + PJS</a>`).click(e => {
          e.preventDefault();
          setParam(tag, true);
        }).prependTo($li);
        $(`<a href="${getNewUrl(tag)}" class="btn btn-primary">${page.name}</a>`).click(e => {
          e.preventDefault();
          setParam(tag);
        }).prependTo($li);
      }
    }
    $el.append(`<a target="_blank" class="btn btn-default" href="/shared.js">shared.js</a>`);
    $el.append(`<a target="_blank" class="btn btn-default" href="/shared.css">shared.css</a>`);
  } else if (json.variations) {
    $el.append(`<h4>Variations:</h4>`);
    let $ol = $(`<ol start="0">`).appendTo($el);
    for (var v in json.variations) {
      let $li = $(`
      <li style="font-size: 1.2em;">
        <br>
        <small><a target="_blank" href="/${v}/inject.js">inject.js</a></small>
      </li>`).appendTo($ol);
      $(`<a href="${getNewUrl(v)}" class="btn btn-primary">${json.variations[v]}</a>`).click(e => {
        e.preventDefault();
        setParam(v);
      }).prependTo($li);
      $(`<a href="${getNewUrl(v,true)}" class="btn btn-primary">${json.variations[v]} + PJS</a>`).click(e => {
        e.preventDefault();
        setParam(v, true);
      }).prependTo($li);
    }
    $el.append(`<a target="_blank" class="btn btn-default" href="/experiment.css">experiment.css</a>`);
  } else if (json.hosting == 'extension') {
    $(`<button class="btn btn-primary">Preview Extension</button>`).click(() => {
      setParam('extension');
    }).appendTo($el);
    $el.append(`<br>`);
    $el.append(`<a target="_blank" href="/inject.js">inject.js</a> <a target="_blank" href="/extension.css">extension.css</a>`);
  } else if (json.hosting == 'project') {
    $(`<button class="btn btn-primary">ProjectJS local preview</button>`).click(() => {
      setParam('project&optimizely_disable=true');
    }).appendTo($el);
    $el.append(`<br>`);
    $el.append(`<a target="_blank" href="/inject.js">inject.js</a>`);
  } else {
    $el.append(`<h4>Not hosting any variations.</h4>`);
  }
  return $el;
};

let $error = e => {
  console.error(e);
  let $el = $('<div>');
  $el.append(`<h3>Whoops! Unable to connect to OLI!</h3><p>Run this bookmark after first hosting something with OLI.</p>`);
  $(`<button class="btn btn-primary">Close</button>`).click(() => {
    window.close();
  }).appendTo($el);
  return $el;
};

let $bookmarklet = e => {
  let $el = $('<div>');
  let snippet = require('../../bookmarklet').replace(/\n/g, '');
  $el.append(`
  <p>Install the <a href="${snippet}">bookmarklet</a>.</p>
  <p>Run it on the page you want to inject OLI into. Make sure you are hosting something before running the bookmarklet.</p>`);
  return $el;
};

window.addEventListener('message', e => {
  if (e.data && e.data.url) {
    fetch('https://localhost:8011/info.json').then(_ => _.json()).then(json => {
      $('#display').html($template(e.data, json));
    }).catch(e => {
      $('#display').html($error(e));
    });
  }
});

if (!window.opener) {
  $('#display').html($bookmarklet);
} else {
  window.opener.postMessage('ready', '*');
}