javascript:
var url = '/oli-inject/dist/';
var settings = {
  height: 600,
  width: 800,
};
window.open('https://crometrics.github.io/crometrics-snippets' + url, 'oli-settings', Object.keys(settings).map(key => key + '=' + settings[key]).join(','));