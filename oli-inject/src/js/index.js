const Url = require('url');
let getData = fetch('https://localhost:8011/info.json').then(_ => _.json());

let $template = (popup, json)=>{
  let parentUri = Url.parse(popup.url);
  console.log(popup, json, parentUri);

  let setParam = (paramValue) => {
    let query = parentUri.query && parentUri.query.replace(new RegExp(`${json.query_param}=[^&]*`, 'ig'), '') || '';
    window.opener.location = `${parentUri.protocol}//${parentUri.host}${parentUri.pathname}?${json.query_param}=${paramValue}${query ? '&' + query : ''}${parentUri.hash || ''}`;
    window.close();
  };
  let $interior = $('<div>');

  if (json.pages){
    $interior.append(`<h3>Variations:</h3>`);
    let $ol = $(`<ol start="0">`).appendTo($interior);
    for (let variation of json.variations){
      let $vLi = $(`<li>`).appendTo($ol);
      $vLi.append(`<h4>${variation.name}</h4>`);
      $vLi.append(`<h5>Pages:</h5>`);
      let $ul = $(`<ul style="padding-left: 20px;">`).appendTo($vLi);
        for (let page of json.pages){
          let $li = $(`<li>
            <br>
            <ID: <code>${variation.tag + '.' + page.tag}</code><br>
            <small><a target="_blank" href="/${variation.tag + '.' + page.tag}.js">${variation.tag + '.' + page.tag}.js</a></small>
            <small><a target="_blank" href="/${variation.tag + '.' + page.tag}.css">${variation.tag + '.' + page.tag}.css</a></small>
          </li>`).appendTo($ul);
          $(`<button class="btn btn-primary">${page.name}</button>`).click(()=>{
            setParam(variation.tag + '.' + page.tag);
          }).prependTo($li);
        }
    }
    $interior.append(`<a target="_blank" class="btn btn-default" href="/shared.js">shared.js</a>`);
    $interior.append(`<a target="_blank" class="btn btn-default" href="/shared.css">shared.css</a>`);
  } else if (json.variations){
    $interior.append(`<h4>Variations:</h4>`);
    let $ol = $(`<ol start="0">`).appendTo($interior);
    for (var v in json.variations){
      let $li = $(`
      <li style="font-size: 1.2em;">
        <br>
        <small><a target="_blank" href="/${v}/inject.js">inject.js</a></small>
      </li>`).appendTo($ol);
      $(`<button class="btn btn-primary">${json.variations[v]}</button>`).click(()=>{
        setParam(v);
      }).prependTo($li);
    }
    $interior.append(`<a target="_blank" class="btn btn-default" href="/experiment.css">experiment.css</a>`);
  } else if (hosting == 'extension') { 
    $(`<button class="btn btn-primary">Preview Extension</button>`).click(()=>{
      setParam('extension');
    }).prependTo($interior);
    $interior.append(`<br>`);
    $interior.append(`<a target="_blank" href="/inject.js">inject.js</a> <a target="_blank" href="/extension.css">extension.css</a>`);
  } else if (hosting == 'project') {
    $(`<button class="btn btn-primary">ProjectJS local preview</button>`).click(() => {
      setParam('project&optimizely_disable=true');
    }).prependTo($interior);
    $interior.append(`<br>`);
    $interior.append(`<a target="_blank" href="/inject.js">inject.js</a>`);
  } else {
    $interior.append(`<h4>Not hosting any variations.</h4>`);
  }
  return $interior;
};

window.addEventListener('message', e=>{
  getData.then(json=>{
    $('#display').html($template(e.data, json));
  });
});

window.opener.postMessage('ready', '*');

