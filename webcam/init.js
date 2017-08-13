/* jshint esversion: 6 */
(function(){
  // 'use strict';
  class Webcam extends HTMLElement{
    constructor(){
      super();
      let shadow = this.attachShadow({mode: 'closed'});
      let stylesheet = document.createElement('style');
      stylesheet.innerHTML = Webcam.styles;


      this.el = document.createElement('div');
      this.el.classList.add('float');
      shadow.appendChild(stylesheet);
      shadow.appendChild(this.el);

      this.video = document.createElement('video');
      this.video.autoplay = true;
      this.el.appendChild(this.video);

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

      if (navigator.getUserMedia) {       
          navigator.getUserMedia(
            {video: true}, 
            (stream)=>{
              this.video.src = window.URL.createObjectURL(stream);
            }, 
            (e)=>{
              //video error
            }
          );
      }

      this.launch();
    }
    launch() {
      // this.el.innerHTML = 'good';
    }
    static get styles(){
      return `
        :host{
          position: fixed;
          bottom: 0;
          left: 0;
          background: white;
          z-index: 9000;
        }
        video{
          z-index: 9001;
          width: 50vh;
        }
      `;
    }
  }
  if (window.location.protocol === 'https:'){
    // Define the new element
    let int = Math.random().toString().substr(2), name = 'webcam-'+int;
    customElements.define(name, Webcam);
    let webcam = document.createElement(name);
    document.body.appendChild(webcam);
  }else{
    alert('Site must use https to access the webcam.');
  }
})();
