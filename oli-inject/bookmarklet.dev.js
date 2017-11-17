javascript:
var settings = {
  height: 600,
  width: 800,
};
window.open('localhost:300/', 'oli-settings', Object.keys(settings).map(key => key + '=' + settings[key]).join(','));