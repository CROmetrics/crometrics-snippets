(function(maxDepth){
  'use strict';
  maxDepth = maxDepth || 4;
 
  let pages = {};
  let parseLink = (el)=>{
    let newLink = false;
    if (el.href.indexOf(window.location.origin) === 0 && el.pathname !== '/'){
      let href = el.href.replace(/#$/, ''), text = el.innerText.trim();
      if (!pages[href]){
        newLink = href;
        pages[href] = [];
      }
      let page = pages[href];
      if (text && page.indexOf(text) === -1){
        page.push(text);
      }
    }
    return newLink;
  };

  document.querySelectorAll('a').forEach(el=>{
    parseLink(el);
  });

  let parsePage = (page, depth)=>{
    return fetch(page).then(r=>r.text()).then(t=>{
      let promises = [];
      if (t){
        let start = t.indexOf('<body'), end = t.indexOf('</body>')+7;
        if (start > 0){
          console.log('Parsing:', page);
          let string = t;//t.substring(start, end);
          let parser = new DOMParser(),
              doc = parser.parseFromString(string, "text/html");

          let keywords = doc.querySelector('meta[name="keywords"]');
          if (keywords){
            let kw = keywords.content.trim();
            if (kw) pages[page].push(kw);
          }
          doc.querySelectorAll('a').forEach(el=>{
            let newLink = parseLink(el);
            if (newLink && depth < maxDepth){
              promises.push(parsePage(newLink, ++depth));
            }
          });
        }else{
          console.error('unable to parse', page);
        }
      }
      return Promise.all(promises);
    }).catch(e=>{
      console.warn(e);
      return Promise.resolve();
    });
  };
  
  let promises = [];
  for (let page in pages){
    if (page !== window.location.href){
      promises.push(parsePage(page, 1));
    }
  }

  // console.log('[cro] promises', promises);
  Promise.all(promises).then(()=>{
    console.log('Final Pages:', pages);
    window.pages = pages;
    window.pagesJSON = JSON.stringify(pages, ' ', 2);
  });

  // window.URL = window.URL || window.webkitURL;
  // let workerFn = (e)=>{
  //   let [parentPages, page] = e.data;
  //   console.log('[cro] page', page);
  //   let pages = [];
  //   fetch(page).then(r=>r.text()).then(t=>{
  //     console.log('Parsing:', page);
  //     if (t){
  //       //CANT PARSE DOM IN A WEB WORKER... bummer.
  //       let parser = new DOMParser(), 
  //           doc = parser.parseFromString(t, "text/xml");
        
  //       doc.querySelectorAll('a').forEach(el=>{
  //         if (el.href.indexOf(window.location.origin) === 0){
  //           let href = el.href.replace(/#$/, ''), text = el.innerText.trim();
  //           let page = pages[href] = pages[href] || [];
  //           if (text && parentPages.indexOf(text) === -1){
  //             page.push(text);
  //           }
  //         }
  //       });
  //       console.log(pages);
  //       // postMessage(JSON.stringify(pages));
  //     }
  //   });
  // };
  // let workerPromise = (page)=>{
  //   let promise = new Promise(resolve=>{
  //     let script = `self.onmessage = ${workerFn};`;
  //     var blob = new Blob([script], {type: 'application/javascript'});
  //     var worker = new Worker(URL.createObjectURL(blob));

  //     worker.onmessage = e=>resolve(e.data);
  //     worker.postMessage([pages, page]);
  //   });
  // };
  // for (let page in pages){
  //   if (page !== window.location.href){
  //     promises.push(workerPromise(page));
  //   }
  // }
})();