let getData = fetch('https://localhost:8011/info.json').then(_ => _.json());

getData.then(console.log);

let aFileParts = '<a id="a"><b id="b">hey!</b></a>';
let blob = new Blob([aFileParts], { type: 'text/html' });

((url = '/oli-inject/dist/', settings = {
  height: 600,
  width: 800,
})=>{
  url = window.location.host.substr(9) === 'localhost' ? '/' : 'https://crometrics.github.io/crometrics-snippets' + url;
  window.open(url, 'oli-settings', Object.keys(settings).map(key=>key+'='+settings[key]).join(','));
})();

window.open(URL.createObjectURL(blob), 'oli-settings', stringify({
  height: 200,
  width: 200,
}));

window.open(URL.createObjectURL(blob), 'oli-settings', stringify({
  height: 200,
  width: 200,
}));