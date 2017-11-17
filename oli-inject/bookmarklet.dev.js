javascript:(function(){
  var url = 'http://localhost:3000/';
  var settings = {
    height: 700,
    width: 500,
  };
  var popup = window.open(url, 'oli-inject', Object.keys(settings).map(key => key + '=' + settings[key]).join(','));
  window.addEventListener('message', e=>{
    if (e.data === 'ready'){
      popup.postMessage({
        url: window.location.href,
      }, '*');
    }
  });
})();