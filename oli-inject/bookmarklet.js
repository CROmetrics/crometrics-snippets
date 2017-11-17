javascript: (function () {
  var url = '/oli-inject/dist/';
  var settings = {
    height: 700,
    width: 500,
  };
  var popup = window.open('https://crometrics.github.io/crometrics-snippets' + url, 'oli-inject', Object.keys(settings).map(key => key + '=' + settings[key]).join(','));
  window.addEventListener('message', e => {
    if (e.data === 'ready') {
      popup.postMessage({
        url: window.location.href,
      }, '*');
    }
  });
})();