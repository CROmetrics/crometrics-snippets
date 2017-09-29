/* jshint esversion: 6 */
(function(){
  // 'use strict';
  class Webcam extends HTMLElement{
    constructor(){
      super();
    }
    connectedCallback(){
      let shadow = this.attachShadow({mode: 'closed'});
      let stylesheet = document.createElement('style');
      stylesheet.innerHTML = Webcam.styles;
      shadow.appendChild(stylesheet);
      
      this.yClass = 'bottom';
      this.xClass = 'left';
      this.sizeClass = 's1';
      
      let el = this.el = document.createElement('div');
      el.updateClass = ()=>{
        el.className = `float ${this.sizeClass} ${this.yClass} ${this.xClass}`;
      };
      el.updateClass();
      shadow.appendChild(el);
     
      let video = this.video = document.createElement('video');
      video.autoplay = true;
      el.appendChild(video);

      let controls = this.controls = document.createElement('div');
      controls.className = 'controls';
      el.appendChild(controls);

      controls.innerHTML = `
        <div class="s1">1x</div>
        <div class="s2">2x</div>
        <div class="s3">3x</div>
        <div class="fullscreen">FS</div>
        <div class="close">X</div>
      `;
      let close = controls.querySelector('.close');
      close.addEventListener('click', ()=>{
        this.remove();
      });
      let s1 = controls.querySelector('.s1');
      s1.addEventListener('click', ()=>{
        this.sizeClass = 's1';
        el.updateClass();
      });
      let s2 = controls.querySelector('.s2');
      s2.addEventListener('click', ()=>{
        this.sizeClass = 's2';
        el.updateClass();
      });
      let s3 = controls.querySelector('.s3');
      s3.addEventListener('click', ()=>{
        this.sizeClass = 's3';
        el.updateClass();
      });
      let fullscreen = controls.querySelector('.fullscreen');
      fullscreen.addEventListener('click', ()=>{
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen(); //safari, chrome
      });

      let dragging = (e)=>{
        let xPer = e.clientX/window.innerWidth;
        let yPer = e.clientY/window.innerHeight;

        this.xClass = xPer > 0.333?(xPer < 0.666?'center':'right'):'left';
        this.yClass = yPer > 0.333?(yPer < 0.666?'middle':'bottom'):'top';

        el.updateClass();
      };
      let dragStart = (e)=>{
        // console.log(e);
        if (e.which === 1){ //Only do it for left click
          window.addEventListener('mousemove', dragging);
        }
      };
      shadow.addEventListener('mousedown', dragStart);
      let dragEnd = (e)=>{
        // console.log(e);
        window.removeEventListener('mousemove', dragging);
      };
      window.addEventListener('mouseup', dragEnd);

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

      if (navigator.getUserMedia) {       
          navigator.getUserMedia(
            {video: true}, 
            (stream)=>{
              video.src = window.URL.createObjectURL(stream);
            }, 
            (e)=>{
              //video error
            }
          );
      }
    } 
    disconnectedCallback(){

    } 
    attributeChangedCallback() {

    }

    static get styles(){
      return `
        :host{
        
        }
        .float{
          position: fixed;
          z-index: 9000;
          background: black;
          overflow: hidden;
          min-width: 250px;
          max-width: 100%;
        }
        .float.bottom{
          bottom: 0;
        }
        .float.middle{
          top: 50%;
          transform: translateY(-50%);
        }
        .float.top{
          top: 0;
        }

        .float.left{
          left: 0;
        }
        .float.center{
          left: 50%;
          transform: translateX(-50%);
        }
        .float.right{
          right: 0;
        }

        .float.middle.center{
          transform: translate(-50%, -50%);
        }        

        .float.s1{
          // width: 25vw;
          width: 250px;
        }
        .float.s2{
          // width: 50vw;
          width: 500px;
        }
        .float.s3{
          // width: 75vw;
          width: 750px;
        }

        .controls{
          position: absolute;
          top: 0;
          right: 0;
          padding: 4px 12px;
          opacity: 0;
          transition: transform ease-in .15s, opacity ease-in .15s;
          transform: translateY(-100%);

          font-weight: bold;
          font-family: sans-serif;
          font-size: 24px;
          color: #eee;
          text-shadow: 1px 1px 1px RGBA(0,0,0,.8);
          z-index: 9002;
          cursor: pointer;
        }
        
        .float:hover .controls{
          display: block;
          opacity: 0.75;
          transform: translateY(0);
        }

        .controls > div{
          display: inline-block;
          margin-left: 1ex;
        }
        .controls > div:hover{
          color: green;
        }

        video{
          z-index: 9001;
          width: 100%;
          display: block;
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
