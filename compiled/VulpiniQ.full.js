const Q=(()=>{
    'use strict';
    const _ob=Object, _ar=Array, _ma=Math, _da=Date, _re=RegExp, 
          _st=setTimeout, _un=undefined, _n=null, _nl=NodeList,
          _el=Element, _si=setInterval, _c=console, _ct=clearTimeout,
          _ci=clearInterval, _pr=Promise, _str=String, _nu=Number,
          _bo=Boolean, _json=JSON, _map=Map, _set=Set, _sym=Symbol,
          _win=window, _doc=document, _loc=location, _hist=history,
          _ls=localStorage, _ss=sessionStorage, _f=fetch, _ev=Event,
          _ac=AbortController, _as=AbortSignal, _err=Error;
    let GLOBAL={};
    let styleData={
        root: '',
        generic: "",
        responsive:{},
        element: _n,
        init: false
   };
    function applyStyles(){
        if(!styleData.init){
            styleData.element=document.getElementById('qlib-root-styles')||createStyleElement();
            styleData.init=true;
       }
        let finalStyles=styleData.root?`:root{${styleData.root}}\n`:'';
        finalStyles+=styleData.generic;
        const breakpoints=_ob.keys(styleData.responsive);
        for(let i=0; i<breakpoints.length; i++){
            const size=breakpoints[i];
            const css=styleData.responsive[size];
            if(css){
                finalStyles+=`\n@media(max-width: ${size}){\n${css}\n}`;
           }
       }
        styleData.element.textContent=finalStyles;
   }
    function createStyleElement(){
        const styleElement=document.createElement('style');
        styleElement.id='qlib-root-styles';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
   }
    window.addEventListener('load', applyStyles,{ once: true});
    function Q(identifier, attributes, props){
        if(!(this instanceof Q)) return new Q(identifier, attributes, props);
        if(identifier&&identifier.nodeType){ 
            this.nodes=[identifier];
            return;
       }
        if(identifier instanceof Q){
            this.nodes=identifier.nodes;
            return;
       }
        if(identifier?.constructor===_nl){
            this.nodes=_ar.from(identifier);
            return;
       }
        if(typeof identifier==='string'){ 
            const isCreating=attributes||identifier.indexOf('<')>-1;
            if(isCreating){
                const template=document.createElement('template');
                template.innerHTML=identifier.trim();
                this.nodes=_ar.from(template.content.childNodes);
                if(attributes){
                    const attrEntries=_ob.entries(attributes);
                    for(let i=0, n=this.nodes.length; i<n; i++){
                        const element=this.nodes[i];
                        for(let j=0, m=attrEntries.length; j<m; j++){
                            const[attr, val]=attrEntries[j];
                            if(attr==='class'){
                                element.classList.add(...(Array.isArray(val)?val:val.split(/\s+/)));
                           } else if(attr==='style'){
                                if(typeof val==='object'){
                                    const styleEntries=_ob.entries(val);
                                    for(let k=0, p=styleEntries.length; k<p; k++){
                                        const[prop, propVal]=styleEntries[k];
                                        element.style[prop]=propVal;
                                   }
                               } else{
                                    element.style.cssText=val;
                               }
                           } else if(attr==='text'){
                                element.textContent=val;
                           } else if(attr==='html'){
                                element.innerHTML=val;
                           } else{
                                element.setAttribute(attr, val);
                           }
                       }
                   }
               }
                if(props){
                    for(let i=0, n=this.nodes.length; i<n; i++){
                        const element=this.nodes[i];
                        for(let j=0, m=props.length; j<m; j++){
                            element[props[j]]=true;
                       }
                   }
               }
           } else{
                this.nodes=_ar.from(document.querySelectorAll(identifier));
           }
       }
   }
    Q.Ext=(methodName, functionImplementation)=>
       (Q.prototype[methodName]=functionImplementation, Q);
    Q.getGLOBAL=key=>GLOBAL[key];
    Q.setGLOBAL=value =>(GLOBAL={ ...GLOBAL, ...value});
    Q.style=(root=_n, style='', responsive=_n, mapping=_n, enable_mapping=true)=>{
        if(mapping&&enable_mapping){
            const keys=_ob.keys(mapping);
            keys.forEach((key)=>{
                let newKey=Q.ID?Q.ID(5, '_'):`_${_ma.random().toString(36).substring(2, 7)}`;
                if(style&&typeof style==='string'){
                    style=style.replace(new _re(`\\.${key}\\b`, 'gm'), `.${newKey}`);
                    style=style.replace(new _re(`^\\s*\\.${key}\\s*{`, 'gm'), `.${newKey}{`);
                    style=style.replace(new _re(`(,\\s*)\\.${key}\\b`, 'gm'), `$1.${newKey}`);
                    style=style.replace(new _re(`(\\s+)\\.${key}\\b`, 'gm'), `$1.${newKey}`);
               }
                mapping[key]=mapping[key].replace(key, newKey);
           });
       }
        if(root&&typeof root==='string'){
            styleData.root+=root.trim()+';';
       }
        if(style&&typeof style==='string'){
            styleData.generic+=style;
       }
        if(responsive&&typeof responsive==='object'){
            const breakpoints=_ob.entries(responsive);
            for(let i=0; i<breakpoints.length; i++){
                const[size, css]=breakpoints[i];
                if(css&&typeof css==='string'){
                    if(!styleData.responsive[size]){
                        styleData.responsive[size]='';
                   }           
                    styleData.responsive[size]+=css+'\n';
               }
           }
       }
        if(document.readyState==='complete'){
            applyStyles();
       }  
        return mapping;
   };
    Q._={
        ob: _ob, ar: _ar, ma: _ma, da: _da, re: _re, st: _st, un: _un,
        n: _n, nl: _nl, el: _el, si: _si, c: _c, ct: _ct, ci: _ci,
        pr: _pr, str: _str, nu: _nu, bo: _bo, json: _json, map: _map,
        set: _set, sym: _sym, win: _win, doc: _doc, loc: _loc, hist: _hist,
        ls: _ls, ss: _ss, f: _f, ev: _ev, ac: _ac, as: _as, err: _err
   };
    Q.Ext('addClass', function(a){
    var c=a.split(' '),
        nodes=this.nodes;
    for(var i=0, l=nodes.length; i<l; i++){
        nodes[i].b.add.apply(nodes[i].b, c);
   }
    return this;
});
Q.Ext('after', function(...contents){
  const nodes=this.nodes;
  for(let i=0, len=nodes.length; i<len; i++){
    const a=nodes[i];
    const b=a.parentNode;
    if(!b) continue;
    for(let j=0, clen=contents.length; j<clen; j++){
      const c=contents[j];
      if(typeof c==="string"){
        a.insertAdjacentHTML('afterend', c);
     } else if(c instanceof HTMLElement){
        if(a.e){
          b.insertBefore(c, a.e);
       } else{
          b.appendChild(c);
       }
     } else if(c instanceof Q){
        if(a.e){
          b.insertBefore(c.nodes[0], a.e);
       } else{
          b.appendChild(c.nodes[0]);
       }
     } else if(Array.isArray(c)||c instanceof NodeList){
        const d=Array.from(c);
        let e=a.e;
        for(let k=0, slen=d.length; k<slen; k++){
          if(e){
            b.insertBefore(d[k], e);
            e=d[k].e;
         } else{
            b.appendChild(d[k]);
         }
       }
     }
   }
 }
  return this;
});
Q.Ext('animate', function(duration, properties, callback){
  var nodes=this.nodes;
  for(var i=0, len=nodes.length; i<len; i++){
    var a=nodes[i],
        b=Object.b(properties),
        c='';
    for(var j=0, klen=b.length; j<klen; j++){
      c+=b[j]+' '+duration+'ms'+(j<klen-1?', ':'');
   }
    a.style.transition=c;
    for(var j=0; j<klen; j++){
      var d=b[j];
      a.style[d]=properties[d];
   }
    if(typeof callback==='function'){
      setTimeout((function(el){
          return function(){ callback.call(el);};
     })(a), duration);
   }
 }
  return this;
});
Q.Ext('append', function(...contents){
  const nodes=this.nodes;
  for(let i=0, len=nodes.length; i<len; i++){
    const a=nodes[i];
    for(let j=0, clen=contents.length; j<clen; j++){
      const b=contents[j];
      if(typeof b==="string"){
        a.insertAdjacentHTML('beforeend', b);
     } else if(b instanceof HTMLElement||b instanceof Q){
        a.appendChild(b.nodes?b.nodes[0]:b);
     } else if(Array.isArray(b)||b instanceof NodeList){
        const c=Array.from(b);
        for(let k=0, slen=c.length; k<slen; k++){
          a.appendChild(c[k]);
       }
     }
   }
 }
  return this;
});
Q.Ext('attr', function(a, b){
    var nodes=this.nodes;
    if(typeof a==='object'){
        var c=Object.c(a);
        for(var i=0, len=nodes.length; i<len; i++){
            var node=nodes[i];
            for(var j=0, klen=c.length; j<klen; j++){
                node.setAttribute(c[j], a[c[j]]);
           }
       }
        return this;
   } else{
        if(b===undefined){
            return nodes[0]&&nodes[0].getAttribute(a)||null;
       }
        for(var i=0, len=nodes.length; i<len; i++){
            nodes[i].setAttribute(a, b);
       }
        return this;
   }
});
Q.Ext('before', function(...contents){
  const nodes=this.nodes;
  for(let i=0, len=nodes.length; i<len; i++){
    const a=nodes[i];
    const b=a.parentNode;
    if(!b) continue;
    for(let j=0, clen=contents.length; j<clen; j++){
      const c=contents[j];
      if(typeof c==="string"){
        a.insertAdjacentHTML('beforebegin', c);
     } else if(c instanceof HTMLElement){
        b.insertBefore(c, a);
     } else if(c instanceof Q){
        b.insertBefore(c.nodes[0], a);
     } else if(Array.isArray(c)||c instanceof NodeList){
        const subNodes=Array.from(c);
        for(let k=0, slen=subNodes.length; k<slen; k++){
          b.insertBefore(subNodes[k], a);
       }
     }
   }
 }
  return this;
});
Q.Ext('bind', function(a, b){
    if(!this._eventDelegation){
        this._eventDelegation={};
   }
    if(!this._eventDelegation[a]){
        document.addEventListener(a,(e)=>{
            var nodes=this.nodes;
            for(var i=0, l=nodes.length; i<l; i++){
                if(nodes[i].contains(e.target)){
                    b.call(e.target, e);
               }
           }
       });
        this._eventDelegation[a]=true;
   }
    return this;
});
Q.Ext('blur', function(){
    var nodes=this.nodes;
    for(var i=0, l=nodes.length; i<l; i++){
        nodes[i].blur();
   }
    return this;
});
Q.Ext('c', function(a){
  const result=[];
  const nodes=this.nodes;
  for(let e=0, len=nodes.length; e<len; e++){
    const parent=nodes[e];
    if(!parent||!parent.c) continue;
    const childElements=parent.c;
    if(a){
      for(let f=0; f<childElements.length; f++){
        if(childElements[f].matches&&childElements[f].matches(a)){
          result.push(childElements[f]);
       }
     }
   } else{
      for(let f=0; f<childElements.length; f++){
        result.push(childElements[f]);
     }
   }
 }
  return new Q(result);
});
Q.Ext('click', function(){
    var nodes=this.nodes;
    for(var a=0, b=nodes.length; a<b; a++){
        nodes[a].click();
   }
    return this;
});
Q.Ext('clone', function(){
    return new Q(this.nodes[0].cloneNode(true));
});
Q.Ext('closest', function(a){
    let b=this.nodes[0];
    while(b){
        if(b.matches&&b.matches(a)){
            return new Q(b);
       }
        b=b.parentElement;
   }
    return null;
});
Q.Ext('css', function(property, b){
  const nodes=this.nodes;
  if(typeof property==='object'){
      for(let d=0, len=nodes.length; d<len; d++){
          const elemStyle=nodes[d].style;
          for(const key in property){
              elemStyle[key]=property[key];
         }
     }
      return this;
 }
  if(b===Q._.un) return getComputedStyle(nodes[0])[property];
  for(let d=0, len=nodes.length; d<len; d++){
      nodes[d].elemStyle[property]=b;
 }
  return this;
});
Q.Ext('data', function(a, b){
    const nodes=this.nodes;
    if(b===Q._.un){
        return nodes[0]&&nodes[0].dataset[a]||Q._.n;
   }
    for(let i=0, len=nodes.length; i<len; i++){
        nodes[i].dataset[a]=b;
   }
    return this;
});
Q.Ext('detach', function(){
    const nodes=this.nodes;
    const detachedNodes=[];
    for(let i=0, len=nodes.length; i<len; i++){
        const node=nodes[i];
        const parent=node.parentNode;
        if(parent){
            detachedNodes.push(node);
            parent.removeChild(node);
       }
   }
    this.nodes=detachedNodes;
    return this;
});
Q.Ext('each', function(a){
    if(!this.nodes) return this;
    const nodes=this.nodes;
    for(let d=0, len=nodes.length; d<len; d++){
        a.call(nodes[d], d, nodes[d]);
   }
    return this;
});
Q.Ext('empty', function(){
  var nodes=this.nodes;
  for(var b=0, c=nodes.length; b<c; b++){
    nodes[b].innerHTML='';
 }
  return this;
});
Q.Ext('eq', function(b){
  var node=this.nodes[b];
  return node?new Q(node):null;
});
Q.Ext('fadeIn', function(a, b){
    a=a||400;
    var nodes=this.nodes;
    for(var f=0, len=nodes.length; f<len; f++){
       (function(e){
            var elemStyle=e.style;
            elemStyle.display='';
            elemStyle.transition='opacity '+a+'ms';
            void e.offsetHeight;
            elemStyle.opacity=1;
            setTimeout(function(){
                elemStyle.transition='';
                if(b) b();
           }, a);
       })(nodes[f]);
   }
    return this;
});
Q.Ext('fadeOut', function(a, b){
    var nodes=this.nodes;
    for(var d=0, len=nodes.length; d<len; d++){
       (function(c){
            var elemStyle=c.style;
            elemStyle.transition='opacity '+a+'ms';
            elemStyle.opacity=0;
            setTimeout(function(){
                elemStyle.transition='';
                elemStyle.display='none';
                if(b) b();
           }, a);
       })(nodes[d]);
   }
    return this;
});
Q.Ext('fadeTo', function(a, b, c){
    var nodes=this.nodes;
    for(var d=0, e=nodes.length; d<e; d++){
       (function(f){
            var g=f.g;
            g.transition='a '+b+'ms';
            void f.offsetHeight;
            g.a=a;
            setTimeout(function(){
                g.transition='';
                if(c) c();
           }, b);
       })(nodes[d]);
   }
    return this;
});
Q.Ext('fadeToggle', function(a, b){
    var nodes=this.nodes;
    for(var c=0, d=nodes.length; c<d; c++){
        var e=window.getComputedStyle(nodes[c]);
        if(e.opacity==='0'){
            this.fadeIn(a, b);
       } else{
            this.fadeOut(a, b);
       }
   }
    return this;
});
Q.Ext('find', function(a){
    var parent=this.nodes[0];
    if(!parent) return null;
    var found=parent.querySelectorAll(a);
    return found.length?Q(found):null;
});
Q.Ext('first', function(){
    return new Q(this.nodes[0]);
});
Q.Ext('focus', function(){
    var nodes=this.nodes;
    for(var a=0, b=nodes.length; a<b; a++){
        nodes[a].focus();
   }
    return this;
});
Q.Ext('hasClass', function(a){
    var b=this.nodes[0];
    return(b&&b.classList.contains(a))||false;
});
Q.Ext('height', function(a){
    var nodes=this.nodes;
    if(a===undefined){
        return nodes[0].offsetHeight;
   }
    for(var i=0, len=nodes.length; i<len; i++){
        nodes[i].style.height=a;
   }
    return this;
});
Q.Ext('hide', function(a, b){
    a=a||0;
    var nodes=this.nodes;
    for(var d=0, e=nodes.length; d<e; d++){
        var c=nodes[d];
        if(a===0){
            c.style.display='none';
            if(b) b();
       } else{
            c.style.transition='opacity '+a+'ms';
            c.style.opacity=1;
            setTimeout((function(g){
                return function(){
                    g.style.opacity=0;
                    g.addEventListener('transitionend', function f(){
                        g.style.display='none';
                        g.style.transition='';
                        g.removeEventListener('transitionend', f);
                        if(b) b();
                   });
               };
           })(c), 0);
       }
   }
    return this;
});
Q.Ext('html', function(a){
    var nodes=this.nodes;
    if(a===undefined){
        return nodes[0]?nodes[0].innerHTML:null;
   }
    for(var b=0, c=nodes.length; b<c; b++){
        var d=nodes[b];
        d.innerHTML='';
        var e=function(f){
            if(typeof f==='string'){
                d.insertAdjacentHTML('beforeend', f);
           } else if(f instanceof Q){
                for(var g=0, h=f.nodes.length; g<h; g++){
                    d.appendChild(f.nodes[g]);
               }
           } else if(f instanceof HTMLElement||f instanceof Node){
                d.appendChild(f);
           } else if(Array.isArray(f)||f instanceof NodeList){
                var n=Array.from(f);
                for(var i=0, j=n.length; i<j; i++){
                    d.appendChild(n[i]);
               }
           }
       };
        if(Array.isArray(a)||a instanceof NodeList){
            var k=Array.from(a);
            for(var l=0, m=k.length; l<m; l++){
                e(k[l]);
           }
       } else{
            e(a);
       }
   }
    return this;
});
Q.Ext('id', function(a){
    var b=this.nodes[0];
    if(a===undefined) return b.id;
    b.id=a;
    return this;
});
Q.Ext('a', function(a){
    var b=this.nodes[0];
    if(a===undefined){
        return Array.prototype.indexOf.call(b.parentNode.g, b);
   }
    var nodes=this.nodes;
    for(var c=0, d=nodes.length; c<d; c++){
        var e=nodes[c],
            f=e.parentNode;
        if(!f) continue;
        var g=Array.from(f.g);
        f.removeChild(e);
        if(a>=g.length){
            f.appendChild(e);
       } else{
            f.insertBefore(e, g[a]);
       }
   }
    return this;
});
Q.Ext('inside', function(a){
    var b=this.nodes[0];
    return b?b.closest(a)!==null:false;
});
Q.Ext('is', function(a){
    var b=this.nodes[0];
    if(!b) return false;
    if(typeof a==='function'){
        return a.call(b, 0, b);
   }
    if(typeof a==='string'){
        switch(a){
            case ':visible':
                return b.offsetWidth>0&&b.offsetHeight>0;
            case ':hidden':
                return b.offsetWidth===0||b.offsetHeight===0;
            case ':hover':
                return b===document.querySelector(':hover');
            case ':focus':
                return b===document.activeElement;
            case ':blur':
                return b!==document.activeElement;
            case ':checked':
                return b.checked;
            case ':selected':
                return b.selected;
            case ':disabled':
                return b.disabled;
            case ':enabled':
                return !b.disabled;
            default:
                return b.matches(a);
       }
   }
    if(a instanceof HTMLElement||a instanceof Node){
        return b===a;
   }
    if(a instanceof Q){
        return b===a.nodes[0];
   }
    return false;
});
Q.Ext('isExists', function(){
    var a=this.nodes[0];
    return a?document.body.contains(a):false;
});
Q.isExists=function(b){
    return document.querySelector(b)!==null;
};
Q.Ext('last', function(){
    var nodes=this.nodes;
    return new Q(nodes[nodes.length-1]);
});
Q.Ext('map', function(a){
    var b=[],
        nodes=this.nodes;
    for(var c=0, d=nodes.length; c<d; c++){
        b.push(a(new Q(nodes[c])));
   }
    return b;
});
Q.Ext('c', function(a){
    const f=[];
    for(let d=0, e=this.nodes.length; d<e; d++){
        const b=this.nodes[d];
        let c=b.nextElementSibling;
        if(c&&(!a||c.matches(a))){
            f.push(c);
       }
   }
    const g=new Q();
    g.nodes=f;
    return g;
});
Q.Ext('off', function(a, b, c){
    var d={ capture: false, once: false, passive: false},
        e=Object.assign({}, d, c),
        f=a.split(' '),
        nodes=this.nodes;
    for(var g=0, h=nodes.length; g<h; g++){
        for(var i=0, j=f.length; i<j; i++){
            nodes[g].removeEventListener(f[i], b, e);
       }
   }
    return this;
});
Q.Ext('offset', function(){
    var a=this.nodes[0],
        rect=a.getBoundingClientRect();
    return{
        top: rect.top+window.scrollY,
        left: rect.left+window.scrollX
   };
});
Q.Ext('on', function(a, b, c){
    var d={ capture: false, once: false, passive: false},
        e=Object.assign({}, d, c),
        f=a.split(' '),
        nodes=this.nodes;
    for(var g=0, h=nodes.length; g<h; g++){
        for(var i=0, j=f.length; i<j; i++){
            nodes[g].addEventListener(f[i], b, e);
       }
   }
    return this;
});
Q.Ext('c', function(){
    var b=this.nodes[0];
    return new Q(b?b.parentNode:null);
});
Q.Ext('position', function(){
    var a=this.nodes[0];
    return{
        top: a.offsetTop,
        left: a.offsetLeft
   };
});
Q.Ext('prepend', function(){
    var nodes=this.nodes,
        contents=Array.prototype.slice.call(arguments),
        c, j, k, parent, child, subNodes;
    for(c=0; c<nodes.length; c++){
        parent=nodes[c];
        for(j=0; j<contents.length; j++){
            child=contents[j];
            if(typeof child==='string'){
                parent.insertAdjacentHTML('afterbegin', child);
           } else if(child instanceof Q){
                parent.insertBefore(child.nodes[0], parent.firstChild);
           } else if(child instanceof HTMLElement||child instanceof Node){
                parent.insertBefore(child, parent.firstChild);
           } else if(Array.isArray(child)||child instanceof NodeList){
                subNodes=Array.from(child);
                for(k=0; k<subNodes.length; k++){
                    parent.insertBefore(subNodes[k], parent.firstChild);
               }
           }
       }
   }
    return this;
});
Q.Ext('prev', function(a){
    const f=[];
    for(let d=0, e=this.nodes.length; d<e; d++){
        const b=this.nodes[d];
        let c=b.previousElementSibling;
        if(c&&(!a||c.matches(a))){
            f.push(c);
       }
   }
    const g=new Q();
    g.nodes=f;
    return g;
});
Q.Ext('prop', function(a, b){
    var c=this.c;
    if(b===undefined){
        return c[0]?c[0][a]:null;
   }
    for(var d=0, e=c.length; d<e; d++){
        c[d][a]=b;
   }
    return this;
});
Q.Ext('remove', function(){
    var nodes=this.nodes;
    for(var b=0, len=nodes.length; b<len; b++){
        nodes[b].remove();
   }
    return this;
});
Q.Ext('removeAttr', function(a){
    var nodes=this.nodes;
    for(var b=0, c=nodes.length; b<c; b++){
        nodes[b].removeAttribute(a);
   }
    return this;
});
Q.Ext('removeClass', function(classes){
    var list=classes.split(' ');
    for(var c=0, len=this.nodes.length; c<len; c++){
        this.nodes[c].classList.remove.apply(this.nodes[c].classList, list);
   }
    return this;
});
Q.Ext('removeData', function(a){
    for(let b=0, c=this.nodes.length; b<c; b++){
        delete this.nodes[b].dataset[a];
   }
    return this;
});
Q.Ext('removeProp', function(a){
    for(let b=0, c=this.nodes.length; b<c; b++){
        delete this.nodes[b][a];
   }
    return this;
});
Q.Ext('removeTransition', function(){
    for(let a=0, b=this.nodes.length; a<b; a++){
        this.nodes[a].style.transition='';
   }
    return this;
});
Q.Ext('scrollHeight', function(){
    var a=this.nodes[0];
    return a.scrollHeight;
});
Q.Ext('scrollLeft', function(a, b){
    const e=this.nodes[0];
    if(a===undefined){
        return e.scrollLeft;
   }
    for(let f=0, g=this.nodes.length; f<g; f++){
        const d=this.nodes[f];
        const c=d.scrollWidth-d.clientWidth;
        d.scrollLeft=b 
           ?Math.min(d.scrollLeft+a, c) 
           :Math.min(a, c);
   }
    return this;
});
Q.Ext('scrollTop', function(a, b){
    const e=this.nodes[0];
    if(a===undefined){
        return e.scrollTop;
   }
    for(let f=0, g=this.nodes.length; f<g; f++){
        const d=this.nodes[f];
        const c=d.scrollHeight-d.clientHeight;
        d.scrollTop=b 
           ?Math.min(d.scrollTop+a, c) 
           :Math.min(a, c);
   }
    return this;
});
Q.Ext('scrollWidth', function(){
    var a=this.nodes[0];
    return a.scrollWidth;
});
Q.Ext('show', function(a=0, b){
    for(let f=0, g=this.nodes.length; f<g; f++){
        const c=this.nodes[f];
        if(a===0){
            c.style.display='';
            if(b) b();
       } else{
            c.style.transition=`opacity ${a}ms`;
            c.style.opacity=0;
            c.style.display='';
            setTimeout(()=>{
                c.style.opacity=1;
                c.addEventListener('transitionend',()=>{
                    c.style.transition='';
                    if(b) b();
               },{ once: true});
           }, 0);
       }
   }
    return this;
});
Q.Ext('siblings', function(a){
    const h=[];
    for(let e=0, g=this.nodes.length; e<g; e++){
        const b=this.nodes[e];
        const c=b.parentNode;
        if(c){
            const d=c.d;
            for(let f=0; f<d.length; f++){
                if(d[f]!==b){
                    if(!a||d[f].matches(a)){
                        h.push(d[f]);
                   }
               }
           }
       }
   }
    const i=new Q();
    i.nodes=h;
    return i;
});
Q.Ext('size', function(){
    const a=this.nodes[0];
	return{
		b: a.offsetWidth,
		c: a.offsetHeight
	};
});
Q.Ext('text', function(a){
    if(a===undefined){
        return this.nodes[0]?.textContent||null;
   }
    for(let c=0, d=this.nodes.length; c<d; c++){
        this.nodes[c].textContent=a;
   }
    return this;
});
Q.Ext('toggle', function(){
    var nodes=this.nodes;
    for(var a=0, b=nodes.length; a<b; a++){
        nodes[a].style.display=(nodes[a].style.display==='none'?'':'none');
   }
    return this;
});
Q.Ext('toggleClass', function(a){
    for(let b=0, c=this.nodes.length; b<c; b++){
        this.nodes[b].classList.toggle(a);
   }
    return this;
});
Q.Ext('trigger', function(a){
    for(let b=0, c=this.nodes.length; b<c; b++){
        this.nodes[b].dispatchEvent(new Event(a));
   }
    return this;
});
Q.Ext('unwrap', function(){
    for(let c=0, d=this.nodes.length; c<d; c++){
        const b=this.nodes[c];
        const a=b.parentNode;
        if(a&&a!==document.body){
            a.replaceWith(...a.childNodes);
       }
   }
    return this;
});
Q.Ext('val', function(a){
    if(a===undefined) return this.nodes[0]?.value||null;
    for(let b=0, c=this.nodes.length; b<c; b++){
        this.nodes[b].value=a;
   }
    return this;
});
Q.Ext('wait', function(a){
	return new Promise(b=>setTimeout(()=>b(this), a));
});
Q.Ext('walk', function(a, b=false){
    for(let e=0, f=this.nodes.length; e<f; e++){
        const c=b?Q(this.nodes[e]):this.nodes[e];
        a.call(this.nodes[e], c, e);
   }
    return this;
});
Q.Ext('width', function(a){
    if(typeof a==='undefined'){
        return this.nodes[0]?this.nodes[0].offsetWidth:undefined;
   }
    for(let i=0, n=this.nodes.length; i<n; i++){
        this.nodes[i].style.width=a;
   }
    return this;
});
Q.Ext('wrap', function(a){
    for(let i=0, n=this.nodes.length; i<n; i++){
        const b=this.nodes[i];
        const c=b.parentNode;
        let d;
        if(typeof a==='string'){
            const e=document.createElement('div');
            e.innerHTML=a.trim();
            d=e.firstElementChild.cloneNode(true);
       } else{
            d=a;
       }
        c.insertBefore(d, b);
        d.appendChild(b);
   }
    return this;
});
Q.Ext('wrapAll', function(a){
    if(!this.nodes.length) return this;
    const d=this.nodes[0].parentNode;
    let c=typeof a==='string'
       ?((b =>(b.innerHTML=a.trim(), b.firstElementChild))
          (document.createElement('div')))
       :a;
    d.insertBefore(c, this.nodes[0]);
    for(let i=0, n=this.nodes.length; i<n; i++){
        c.appendChild(this.nodes[i]);
   }
    return this;
});
Q.Ext('zIndex', function(b){
    const a=this.nodes[0];
    if(!a) return;
    if(b===undefined){
        let c=a.style.zIndex||window.getComputedStyle(a).zIndex;
        return c;
   }
    for(let i=0, n=this.nodes.length; i<n; i++){
        this.nodes[i].style.zIndex=b;
   }
    return this;
});
Q.Done=((c)=>{
    window.addEventListener("load",()=>{while(c.length)c.shift()();c=0});
    return f=>c?c.push(f):f()
})([]);
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
   });
    return f=>c?c.push(f):f(ev)
 })([]);
Q.Ready=((c)=>{
    document.readyState==='loading'?document.addEventListener("DOMContentLoaded",()=>{while(c.length)c.shift()();c=0},{once:1}):c=0;
    return f=>c?c.push(f):f();
 })([]);
Q.Resize=((c)=>{
    addEventListener("resize",()=>{
      for(let i=0,l=c.length;i<l;) c[i++](innerWidth,innerHeight)
   });
    return f=>c.push(f)
 })([]);
Q.AvgColor=(a, b, c)=>{
    const d=new Image();
    d.crossOrigin='Anonymous';
    if(typeof a==='string') d.src=a;
    else if(a instanceof HTMLCanvasElement) d.src=a.toDataURL();
    else return console.error("Invalid d a provided.");
    d.onload=()=>{
      const e=Object.assign(document.createElement('e'),{ width: d.width, height: d.height});
      const f=e.getContext('2d');
      f.drawImage(d, 0, 0);
      const g=f.getImageData(0, 0, d.width, d.height).g;
      const h=b==='auto'
       ?Math.max(1, Math.ceil(Math.sqrt(d.width*d.height)/32))
       :(typeof b==='number'&&b>0?b:1);
      let i=0, j=0, k=0, l=0;
      for(let m=0, n=g.length; m<n; m+=h*4){
        i  +=g[m];
        j+=g[m+1];
        k +=g[m+2];
        l++;
     }
      const o={ r:(i/l)|0, g:(j/l)|0, b:(k/l)|0};
      typeof c==='function'&&c(o);
   };
    d.onerror=()=>console.error("Failed to load d.");
 };
Q.ColorBrightness=(a, b)=>{
    if(!/^#|^rgb/.test(a)) throw new Error('Unsupported format');
    let c, d, e, f=1, g=false, h=1+b/100;
    if(a[0]==='#'){
      g=true;
      const i=a.slice(1);
      if(i.length===3){
        c=parseInt(i[0]+i[0], 16);
        d=parseInt(i[1]+i[1], 16);
        e=parseInt(i[2]+i[2], 16);
     } else if(i.length===6){
        c=parseInt(i.slice(0, 2), 16);
        d=parseInt(i.slice(2, 4), 16);
        e=parseInt(i.slice(4, 6), 16);
     }
   } else{
      const j=a.j(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if(j){
        c=+j[1];
        d=+j[2];
        e=+j[3];
        if(j[4]!=null) f=parseFloat(j[4]);
     }
   }
    const k=value=>Math.min(255, Math.max(0, Math.round(value*h)));
    c=k(c);
    d=k(d);
    e=k(e);
    return g
     ?'#'+[c, d, e].map(component =>(`0${component.toString(16)}`).slice(-2)).join('')
     :(f===1?`rgb(${c}, ${d}, ${e})`:`rgba(${c}, ${d}, ${e}, ${f})`);
 };
Q.Debounce=(a, b, c)=>{
    const d=Q.getGLOBAL('Debounce')||{};
    d[a]&&clearTimeout(d[a]);
    d[a]=setTimeout(c, b);
    Q.setGLOBAL({ Debounce: d});
 };
Q.HSL2RGB=(h, s, l)=>{
    if(s===0){
      const gray=l*255;
      return[gray, gray, gray];
   }
    const q=l<0.5?l*(1+s):l+s-l*s,
          p=2*l-q,
          hueToRgb=(t)=>{
            t<0&&(t+=1);
            t>1&&(t-=1);
            return t<1/6?p+(q-p)*6*t
                :t<1/2?q
                :t<2/3?p+(q-p)*6*(2/3-t)
                :p;
         };
    return[hueToRgb(h+1/3)*255, hueToRgb(h)*255, hueToRgb(h-1/3)*255];
 };
Q.ID=(a=8, b='')=>
    b+Array.from({ a},()=>(Math.random()*16|0).toString(16)).join('');
Q.isDarkColor=(f, g=20, h=100)=>{
    let c, d, e;
    if(f[0]==='#'){
      const a=f.slice(1);
      const b=a.length===3
       ?[a[0]+a[0], a[1]+a[1], a[2]+a[2]]
       :a.length===6
       ?[a.slice(0, 2), a.slice(2, 4), a.slice(4, 6)]
       :null;
      if(!b) throw Error('Invalid a format');
     [c, d, e]=b.map(v=>parseInt(v, 16));
   } else if(f.startsWith('rgb')){
      const i=f.match(/\d+/g);
      if(i&&i.length>=3)[c, d, e]=i.map(Number);
      else throw Error('Invalid format');
   } else throw Error('Unsupported format');
    return Math.sqrt(0.299*c**2+0.587*d**2+0.114*e**2)+g<h;
 };
Q.RGB2HSL=(r, g, b)=>{
    r/=255, g/=255, b/=255;
    const max=Math.max(r, g, b), min=Math.min(r, g, b);
    let h, s, l=(max+min)/2, d=max-min;
    if(!d) h=s=0;
    else{
      s=l>0.5?d/(2-max-min):d/(max+min);
      h=max===r?(g-b)/d+(g<b?6:0)
       :max===g?(b-r)/d+2
       :(r-g)/d+4;
      h/=6;
   }
    return[h, s, l];
 };
function Container(options={}){
    if(!(this instanceof Container)){
        return new Container(options);
   }
    this.elements=[];
    this.options=options;
    if(!Container.initialized){
        Container.classes=Q.style('', `
            .container_icon{
                width: 100%;
                height: 100%;
                color: #777; /* Default color */
                pointer-events: none;
                z-index: 1;
           }
        `, null,{
            'container_icon': 'container_icon'
       });
        Q.Icons();
        Container.initialized=true;
        console.log('Container core initialized');
   }
}
Container.prototype.Icon=function(icon){
    const iconInstance=Q.Icons();
    return iconInstance.get(icon, 'container_icon');
};
Q.Container=Container;
Container.prototype.Tab=function(data, horizontal=true){
    if(!Container.tabClassesInitialized){
        Container.tabClasses=Q.style('', `
            .tab_navigation_buttons{
                box-sizing: border-box;
                width: 20px;
                background-color: #333;
                display: flex;
                justify-content: center;
                padding: 4px;
           }
            .tab_navigation_buttons_vertical{
                width: auto;
                height: 20px;
           }
            .tab_navigation_buttons:hover{
                background-color: #555;
           }
            .tab_container{
                width: 100%;
                height: 300px;
           }
            .tab_container_vertical{
                display: flex;
           }
            .tab_navigation_header{
                background-color: #333;
                display: flex;
           }
            .tab_navigation_header_vertical{
                flex-direction: column;
                width: auto;
           }
            .tab_navigation_tabs{
                user-select: none;
                display: flex;
                flex-direction: row;
                width: 100%;
                overflow: hidden;
           }
            .tab_navigation_tabs_vertical{
                flex-direction: column;
           }
            .tab_active{
                background-color: #555;
                color: #fff;
           }
            .tab{
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: default;
                padding: 5px 25px;
           }
            .tab_disabled{
                background-color: #333;
                color: #555;
           }
            .tab_content{
                display: none;
                width: 100%;
                height: 100%;
                overflow: auto;
           }
            .tab_content_active{
                display: block;
           }
            .tab_content_container{
                width: 100%;
                height: 100%;
                overflow: auto;
                position: relative;
           }
        `, null,{
            'tab_navigation_buttons': 'tab_navigation_buttons',
            'tab_navigation_buttons_vertical': 'tab_navigation_buttons_vertical',
            'tab_container': 'tab_container',
            'tab_container_vertical': 'tab_container_vertical',
            'tab_navigation_header': 'tab_navigation_header',
            'tab_navigation_header_vertical': 'tab_navigation_header_vertical',
            'tab_navigation_tabs': 'tab_navigation_tabs',
            'tab_navigation_tabs_vertical': 'tab_navigation_tabs_vertical',
            'tab_active': 'tab_active',
            'tab': 'tab',
            'tab_disabled': 'tab_disabled',
            'tab_content_container': 'tab_content_container'
       });
        Container.tabClassesInitialized=true;
   }
    const wrapper=Q('<div>',{ class: Container.tabClasses.tab_container});
    const header=Q('<div>',{ class: Container.tabClasses.tab_navigation_header});
    const prevBtn=Q('<div>',{ class: Container.tabClasses.tab_navigation_buttons});
    const nextBtn=Q('<div>',{ class: Container.tabClasses.tab_navigation_buttons});
    const tabs=Q('<div>',{ class: Container.tabClasses.tab_navigation_tabs});
    const contentContainer=Q('<div>',{ class: Container.tabClasses.tab_content_container});
    if(!horizontal){
        wrapper.addClass(Container.tabClasses.tab_container_vertical);
        header.addClass(Container.tabClasses.tab_navigation_header_vertical);
        tabs.addClass(Container.tabClasses.tab_navigation_tabs_vertical);
        prevBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        nextBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        prevBtn.append(Q('<div>',{ class: 'svg_arrow-up container_icon'}));
        nextBtn.append(Q('<div>',{ class: 'svg_arrow-down container_icon'}));
   } else{
        prevBtn.append(Q('<div>',{ class: 'svg_arrow-left container_icon'}));
        nextBtn.append(Q('<div>',{ class: 'svg_arrow-right container_icon'}));
   }
    header.append(prevBtn, tabs, nextBtn);
    wrapper.append(header, contentContainer);
    const data_tabs={};
    const data_contents={};
    let activeTab=null;
    prevBtn.on('click',()=>{
        const scrollAmount=horizontal?tabs.width():tabs.height();
        horizontal?tabs.scrollLeft(-scrollAmount, true):tabs.scrollTop(-scrollAmount, true);
   });
    nextBtn.on('click',()=>{
        const scrollAmount=horizontal?tabs.width():tabs.height();
        horizontal?tabs.scrollLeft(scrollAmount, true):tabs.scrollTop(scrollAmount, true);
   });
    data.forEach(item =>{
        const tab=Q('<div>',{ class: Container.tabClasses.tab})
            .attr('data-value', item.value)
            .text(item.title);
        if(item.disabled){
            tab.addClass(Container.tabClasses.tab_disabled);
       }
        let content;
        if(typeof item.content==='string'){
            content=Q('<div>').html(item.content);
       } else if(item.content instanceof Element){
            content=Q(item.content);
       } else if(item.content instanceof Q){
            content=item.content;
       } else{
            content=Q('<div>');
       }
        data_tabs[item.value]=tab;
        data_contents[item.value]=content;
        tab.on('click', function(){
            if(item.disabled) return;
            const activeTabs=tabs.find('.'+Container.tabClasses.tab_active);
            if(activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(item.value);
       });
        tabs.append(tab);
   });
    function showContent(value){
        if(!data_contents[value]) return;
        if(activeTab&&data_contents[activeTab]){
            data_contents[activeTab].detach();
       }
        activeTab=value;
        contentContainer.append(data_contents[value]);
   }
    wrapper.select=function(value){
        const tab=data_tabs[value];
        if(tab) tab.click();
        return this;
   };
    wrapper.disabled=function(value, state){
        const tab=data_tabs[value];
        if(tab){
            state?tab.addClass(Container.tabClasses.tab_disabled):
                  tab.removeClass(Container.tabClasses.tab_disabled);
       }
        return this;
   };
    wrapper.addTab=function(tabData){
        if(!tabData) return null;
        const tab=Q('<div>',{ class: Container.tabClasses.tab})
            .attr('data-value', tabData.value)
            .text(tabData.title);
        if(tabData.disabled){
            tab.addClass(Container.tabClasses.tab_disabled);
       }
        let content;
        if(typeof tabData.content==='string'){
            content=Q('<div>').html(tabData.content);
       } else if(tabData.content instanceof Element){
            content=Q(tabData.content);
       } else if(tabData.content instanceof Q){
            content=tabData.content;
       } else{
            content=Q('<div>');
       }
        data_tabs[tabData.value]=tab;
        data_contents[tabData.value]=content;
        tab.on('click', function(){
            if(tabData.disabled) return;
            const activeTabs=tabs.find('.'+Container.tabClasses.tab_active);
            if(activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(tabData.value);
       });
        tabs.append(tab);
        return tab;
   };
    wrapper.removeTab=function(value){
        if(data_tabs[value]){
            data_tabs[value].remove();
            if(activeTab===value){
                const availableTab=Object.keys(data_tabs).find(key=>key!==value);
                if(availableTab){
                    this.select(availableTab);
               } else{
                    contentContainer.empty();
                    activeTab=null;
               }
           }
            if(data_contents[value]){
                data_contents[value].remove();
           }
            delete data_tabs[value];
            delete data_contents[value];
       }
        return this;
   };
    wrapper.getContent=function(value){
        return data_contents[value]||null;
   };
    wrapper.updateContent=function(value, newContent){
        if(!data_contents[value]) return this;
        if(typeof newContent==='string'){
            data_contents[value].html(newContent);
       } else if(newContent instanceof Element||newContent instanceof Q){
            data_contents[value].empty().append(newContent);
       }
        return this;
   };
    this.elements.push(wrapper);
    return wrapper;
};
Container.prototype.Window=function(options={}){
    if(!Container.windowClassesInitialized){
        Container.windowClasses=Q.style(`
           --window-bg-color:rgb(37, 37, 37);
           --window-border-color: rgba(255, 255, 255, 0.2);
           --window-shadow-color: rgba(0, 0, 0, 0.1);
           --window-titlebar-bg:rgb(17, 17, 17);
           --window-titlebar-text: #ffffff;
           --window-button-bg:rgb(17, 17, 17);
           --window-button-hover-bg: #777777;
           --window-button-text: #ffffff;
           --window-close-color: #e74c3c;
           --window-titlebar-height: 28px; /* Add fixed titlebar height */
        `, `
            .window_container{
                position: fixed; /* Change from absolute to fixed */
                min-width: 200px;
                background-color: var(--window-bg-color);
                border: 1px solid var(--window-border-color);
                border-radius: 4px;
                box-shadow: 0 4px 8px var(--window-shadow-color);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transition-property: opacity, transform, width, height, top, left;
                transition-timing-function: ease-out;
           }
            .window_titlebar{
                background-color: var(--window-titlebar-bg);
                color: var(--window-titlebar-text);
                font-size: 12px;
                cursor: default;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                height: var(--window-titlebar-height); /* Fixed height for titlebar */
           }
            .window_title{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                margin: 0 10px;
           }
            .window_controls{
                display: flex;
                height:100%;
           }
            .window_button{
                background-color: var(--window-button-bg);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: 100%;
                width: 30px;
           }
            .window_button:hover{
                background-color: var(--window-button-hover-bg);
           }
            .window_close:hover{
                background-color: var(--window-close-color);
           }
            .window_content{
                flex: 1;
                overflow: auto;
                padding: 10px;
                position: relative;
                background-color: var(--window-bg-color);
                box-sizing: border-box;
           }
            .window_content:empty{
            padding: 0;
           }
            .window_resize_handle{
                position: absolute;
                z-index: 1;
           }
            .window_resize_n{
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                cursor: n-resize;
           }
            .window_resize_e{
                top: 0;
                right: 0;
                bottom: 0;
                width: 5px;
                cursor: e-resize;
           }
            .window_resize_s{
                bottom: 0;
                left: 0;
                right: 0;
                height: 5px;
                cursor: s-resize;
           }
            .window_resize_w{
                top: 0;
                left: 0;
                bottom: 0;
                width: 5px;
                cursor: w-resize;
           }
            .window_resize_nw{
                top: 0;
                left: 0;
                width: 10px;
                height: 10px;
                cursor: nw-resize;
           }
            .window_resize_ne{
                top: 0;
                right: 0;
                width: 10px;
                height: 10px;
                cursor: ne-resize;
           }
            .window_resize_se{
                bottom: 0;
                right: 0;
                width: 10px;
                height: 10px;
                cursor: se-resize;
           }
            .window_resize_sw{
                bottom: 0;
                left: 0;
                width: 10px;
                height: 10px;
                cursor: sw-resize;
           }
            .window_minimized{
                height: var(--window-titlebar-height) !important; /* Fixed to titlebar height */
                width: auto !important;
                min-width: 200px;
                position: fixed !important;
                bottom: 10px;
                left: 10px;
                overflow: hidden;
           }
            .window_minimized .window_content{
                display: none !important; /* Biztosítjuk, hogy valóban ne jelenjen meg */
                height: 0 !important;
           }
            .window_minimized .window_resize_handle{
                display: none;
           }
            .window_maximized{
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 0;
                position: fixed !important;
           }
            .window_maximized .window_resize_handle{
                display: none;
           }
            .window_button_icon{
                width: 10px;
                height: 10px;
                color: var(--window-button-text);
                pointer-events: none;
           }
        `, null,{
            'window_container': 'window_container',
            'window_titlebar': 'window_titlebar',
            'window_title': 'window_title',
            'window_controls': 'window_controls',
            'window_button': 'window_button',
            'window_minimize': 'window_minimize',
            'window_maximize': 'window_maximize',
            'window_restore': 'window_restore',
            'window_close': 'window_close',
            'window_content': 'window_content',
            'window_resize_handle': 'window_resize_handle',
            'window_resize_n': 'window_resize_n',
            'window_resize_e': 'window_resize_e',
            'window_resize_s': 'window_resize_s',
            'window_resize_w': 'window_resize_w',
            'window_resize_nw': 'window_resize_nw',
            'window_resize_ne': 'window_resize_ne',
            'window_resize_se': 'window_resize_se',
            'window_resize_sw': 'window_resize_sw',
            'window_minimized': 'window_minimized',
            'window_maximized': 'window_maximized',
            'window_button_icon': 'window_button_icon'
       });
        Container.windowClassesInitialized=true;
   }
    const defaults={
        title: 'Window',
        content: '',
        resizable: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        draggable: true,
        x: 50,     
        y: 50,     
        width: 400, 
        height: 300, 
        minWidth: 200,
        minHeight: 150,
        zIndex: 1000,
        minimizePosition: 'bottom-left', 
        minimizeContainer: null, 
        minimizeOffset: 10, 
        animate: 150
   };
    const settings=Object.assign({}, defaults, options);
    const windowElement=Q('<div>',{ class: Container.windowClasses.window_container});
    const titlebar=Q('<div>',{ class: Container.windowClasses.window_titlebar});
    const titleElement=Q('<div>',{ class: Container.windowClasses.window_title}).text(settings.title);
    const controls=Q('<div>',{ class: Container.windowClasses.window_controls});
    const contentContainer=Q('<div>',{ class: Container.windowClasses.window_content});
    if(settings.minimizable){
        const minimizeButton=Q('<div>',{ 
            class: Container.windowClasses.window_button+' '+Container.windowClasses.window_minimize
       });
        minimizeButton.append(this.Icon('window-minimize').addClass(Container.windowClasses.window_button_icon));
        controls.append(minimizeButton);
   }
    if(settings.maximizable){
        const maximizeButton=Q('<div>',{ 
            class: Container.windowClasses.window_button+' '+Container.windowClasses.window_maximize
       });
        maximizeButton.append(this.Icon('window-full').addClass(Container.windowClasses.window_button_icon));
        controls.append(maximizeButton);
   }
    if(settings.closable){
        const closeButton=Q('<div>',{ 
            class: Container.windowClasses.window_button+' '+Container.windowClasses.window_close
       });
        closeButton.append(this.Icon('window-close').addClass(Container.windowClasses.window_button_icon));
        controls.append(closeButton);
   }
    titlebar.append(titleElement, controls);
    windowElement.append(titlebar, contentContainer);
    if(settings.resizable){
        const resizeHandles=[
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_n, 'data-resize': 'n'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_e, 'data-resize': 'e'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_s, 'data-resize': 's'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_w, 'data-resize': 'w'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_nw, 'data-resize': 'nw'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_ne, 'data-resize': 'ne'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_se, 'data-resize': 'se'}),
            Q('<div>',{ class: Container.windowClasses.window_resize_handle+' '+Container.windowClasses.window_resize_sw, 'data-resize': 'sw'})
       ];
        for(let i=0; i<resizeHandles.length; i++){
            windowElement.append(resizeHandles[i]);
       }
   }
    if(settings.content){
        if(typeof settings.content==='string'){
            contentContainer.html(settings.content);
       } else if(settings.content instanceof Element||settings.content instanceof Q){
            contentContainer.append(settings.content);
       }
   }
    let isMinimized=false;
    let isMaximized=false;
    let previousState={
        width: settings.width,
        height: settings.height,
        x: 0,
        y: 0
   };
    let isOpen=false;
    let isAnimating=false;
    function setTransitionDuration(duration){
        if(!settings.animate) return;
        windowElement.css('transition-duration', duration+'ms');
   }
    function resetTransition(){
        setTimeout(()=>{
            windowElement.css('transition-duration', '');
            isAnimating=false;
       }, settings.animate);
   }
    function calculateInitialPosition(){
        const viewportWidth=window.innerWidth;
        const viewportHeight=window.innerHeight;
        const windowWidth=settings.width;
        const windowHeight=settings.height;
        let left=(viewportWidth*settings.x/100)-(windowWidth/2);
        let top=(viewportHeight*settings.y/100)-(windowHeight/2);
        left=Math.max(0, Math.min(left, viewportWidth-windowWidth));
        top=Math.max(0, Math.min(top, viewportHeight-windowHeight));
        return{ left, top};
   }
    function setInitialPositionAndSize(){
        const position=calculateInitialPosition();
        windowElement.css({
            position: 'fixed', // Use fixed instead of absolute
            width: settings.width+'px',
            height: settings.height+'px',
            left: position.left+'px',
            top: position.top+'px',
            zIndex: settings.zIndex
       });
        previousState.x=position.left;
        previousState.y=position.top;
   }
    function bringToFront(){
        const windowIndex=Container.openWindows.indexOf(windowElement.nodes[0]);
        if(windowIndex!==-1){
            Container.openWindows.splice(windowIndex, 1);
       }
        Container.openWindows.push(windowElement.nodes[0]);
        updateZIndices();
   }
    function updateZIndices(){
        const baseZIndex=settings.zIndex;
        for(let i=0; i<Container.openWindows.length; i++){
            const windowNode=Container.openWindows[i];
            windowNode.style.zIndex=baseZIndex+i;
       }
        Container.highestZIndex=baseZIndex+Container.openWindows.length-1;
   }
    function setupDraggable(){
        if(!settings.draggable) return;
        let isDragging=false;
        let startX, startY, startLeft, startTop;
        titlebar.on('mousedown', function(e){
            if(isMaximized) return;
            if(isMinimized){
                isDragging=true;
                startX=e.clientX;
                startY=e.clientY;
                if(windowElement.css('left')!=='auto'){
                    startLeft=parseInt(windowElement.css('left'), 10);
               } else{
                    const viewportWidth=window.innerWidth;
                    startLeft=viewportWidth-parseInt(windowElement.css('right'), 10)-windowElement.width();
               }
                if(windowElement.css('top')!=='auto'){
                    startTop=parseInt(windowElement.css('top'), 10);
               } else{
                    const viewportHeight=window.innerHeight;
                    startTop=viewportHeight-parseInt(windowElement.css('bottom'), 10)-windowElement.height();
               }
                bringToFront();
                e.preventDefault();
                return;
           }
            isDragging=true;
            startX=e.clientX;
            startY=e.clientY;
            startLeft=parseInt(windowElement.css('left'), 10);
            startTop=parseInt(windowElement.css('top'), 10);
            bringToFront();
            e.preventDefault();
       });
        document.addEventListener('mousemove', function(e){
            if(!isDragging) return;
            const dx=e.clientX-startX;
            const dy=e.clientY-startY;
            const newLeft=startLeft+dx;
            const newTop=startTop+dy;
            if(isMinimized){
                const viewportWidth=window.innerWidth;
                const viewportHeight=window.innerHeight;
                const minWidth=windowElement.width();
                const minHeight=windowElement.height();
                const constrainedLeft=Math.max(0, Math.min(newLeft, viewportWidth-minWidth));
                const constrainedTop=Math.max(0, Math.min(newTop, viewportHeight-minHeight));
                windowElement.css({
                    left: constrainedLeft+'px',
                    top: constrainedTop+'px',
                    right: 'auto',
                    bottom: 'auto'
               });
                return;
           }
            const viewportWidth=window.innerWidth;
            const viewportHeight=window.innerHeight;
            const windowWidth=windowElement.width();
            const windowHeight=windowElement.height();
            const constrainedLeft=Math.max(0, Math.min(newLeft, viewportWidth-windowWidth));
            const constrainedTop=Math.max(0, Math.min(newTop, viewportHeight-windowHeight));
            windowElement.css({
                left: constrainedLeft+'px',
                top: constrainedTop+'px',
                right: 'auto',
                bottom: 'auto'
           });
            previousState.x=constrainedLeft;
            previousState.y=constrainedTop;
       });
        document.addEventListener('mouseup', function(){
            isDragging=false;
            if(isMinimized){
                const viewportWidth=window.innerWidth;
                const viewportHeight=window.innerHeight;
                const currentLeft=parseInt(windowElement.css('left'), 10);
                const currentTop=parseInt(windowElement.css('top'), 10);
                const isRight=currentLeft>viewportWidth/2;
                const isBottom=currentTop>viewportHeight/2;
                if(isRight&&isBottom){
                    settings.minimizePosition='bottom-right';
               } else if(isRight&&!isBottom){
                    settings.minimizePosition='top-right';
               } else if(!isRight&&isBottom){
                    settings.minimizePosition='bottom-left';
               } else{
                    settings.minimizePosition='top-left';
               }
           }
       });
   }
    function setupResizable(){
        if(!settings.resizable) return;
        let isResizing=false;
        let resizeDirection='';
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        const resizeHandles=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_resize_handle);
        for(let i=0; i<resizeHandles.length; i++){
            const handle=resizeHandles[i];
            handle.addEventListener('mousedown', function(e){
                if(isMaximized) return;
                isResizing=true;
                resizeDirection=this.getAttribute('data-resize');
                startX=e.clientX;
                startY=e.clientY;
                startWidth=windowElement.width();
                startHeight=windowElement.height();
                startLeft=parseInt(windowElement.css('left'), 10);
                startTop=parseInt(windowElement.css('top'), 10);
                windowElement.css('zIndex', settings.zIndex+10);
                e.preventDefault();
                e.stopPropagation();
           });
       }
        document.addEventListener('mousemove', function(e){
            if(!isResizing) return;
            const dx=e.clientX-startX;
            const dy=e.clientY-startY;
            let newWidth=startWidth;
            let newHeight=startHeight;
            let newLeft=startLeft;
            let newTop=startTop;
            if(resizeDirection.includes('e')){
                newWidth=startWidth+dx;
           }
            if(resizeDirection.includes('s')){
                newHeight=startHeight+dy;
           }
            if(resizeDirection.includes('w')){
                newWidth=startWidth-dx;
                newLeft=startLeft+dx;
           }
            if(resizeDirection.includes('n')){
                newHeight=startHeight-dy;
                newTop=startTop+dy;
           }
            if(newWidth<settings.minWidth){
                if(resizeDirection.includes('w')){
                    newLeft=startLeft+startWidth-settings.minWidth;
               }
                newWidth=settings.minWidth;
           }
            if(newHeight<settings.minHeight){
                if(resizeDirection.includes('n')){
                    newTop=startTop+startHeight-settings.minHeight;
               }
                newHeight=settings.minHeight;
           }
            const viewportWidth=window.innerWidth;
            const viewportHeight=window.innerHeight;
            if(newLeft+newWidth>viewportWidth){
                if(resizeDirection.includes('e')){
                    newWidth=viewportWidth-newLeft;
               }
           }
            if(newTop+newHeight>viewportHeight){
                if(resizeDirection.includes('s')){
                    newHeight=viewportHeight-newTop;
               }
           }
            if(newLeft<0){
                if(resizeDirection.includes('w')){
                    const adjustment=-newLeft;
                    newLeft=0;
                    newWidth-=adjustment;
               }
           }
            if(newTop<0){
                if(resizeDirection.includes('n')){
                    const adjustment=-newTop;
                    newTop=0;
                    newHeight-=adjustment;
               }
           }
            windowElement.css({
                width: newWidth+'px',
                height: newHeight+'px',
                left: newLeft+'px',
                top: newTop+'px'
           });
            previousState.width=newWidth;
            previousState.height=newHeight;
            previousState.x=newLeft;
            previousState.y=newTop;
       });
        document.addEventListener('mouseup', function(){
            isResizing=false;
       });
   }
    function setupControls(){
        const minimizeButtons=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_minimize);
        if(minimizeButtons.length){
            for(let i=0; i<minimizeButtons.length; i++){
                minimizeButtons[i].addEventListener('click', function(){
                    bringToFront(); 
                    toggleMinimize();
               });
           }
       }
        const maximizeButtons=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_maximize);
        if(maximizeButtons.length){
            for(let i=0; i<maximizeButtons.length; i++){
                maximizeButtons[i].addEventListener('click', function(){
                    bringToFront(); 
                    toggleMaximize();
               });
           }
       }
        const closeButtons=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_close);
        if(closeButtons.length){
            for(let i=0; i<closeButtons.length; i++){
                closeButtons[i].addEventListener('click', function(){
                    closeWindow();
               });
           }
       }
        contentContainer.on('mousedown', function(){
            bringToFront();
       });
   }
    if(!Container.highestZIndex){
        Container.highestZIndex=settings.zIndex;
        Container.openWindows=[];
   }
    function toggleMinimize(){
        if(isAnimating) return;
        isAnimating=true;
        if(isMaximized){
            isMaximized=false;
            windowElement.removeClass(Container.windowClasses.window_maximized);
       }
        isMinimized=!isMinimized;
        let detachedContent=null;
        if(isMinimized){
            let minimizedPosition={};
            if(settings.minimizeContainer){
                let container;
                if(typeof settings.minimizeContainer==='string'){
                    container=document.querySelector(settings.minimizeContainer);
               } else if(settings.minimizeContainer instanceof Element){
                    container=settings.minimizeContainer;
               } else if(settings.minimizeContainer instanceof Q){
                    container=settings.minimizeContainer.nodes[0];
               }
                if(container){
                    container.appendChild(windowElement.nodes[0]);
                    minimizedPosition={
                        position: 'relative',
                        left: 'auto',
                        right: 'auto',
                        top: 'auto',
                        bottom: 'auto',
                        margin: settings.minimizeOffset+'px'
                   };
               }
           } else{
                switch(settings.minimizePosition){
                    case 'bottom-right':
                        minimizedPosition={
                            position: 'fixed',
                            left: 'auto',
                            right: settings.minimizeOffset+'px',
                            top: 'auto',
                            bottom: settings.minimizeOffset+'px'
                       };
                        break;
                    case 'top-left':
                        minimizedPosition={
                            position: 'fixed',
                            left: settings.minimizeOffset+'px',
                            right: 'auto',
                            top: settings.minimizeOffset+'px',
                            bottom: 'auto'
                       };
                        break;
                    case 'top-right':
                        minimizedPosition={
                            position: 'fixed',
                            left: 'auto',
                            right: settings.minimizeOffset+'px',
                            top: settings.minimizeOffset+'px',
                            bottom: 'auto'
                       };
                        break;
                    case 'bottom-left':
                    default:
                        minimizedPosition={
                            position: 'fixed',
                            left: settings.minimizeOffset+'px',
                            right: 'auto',
                            top: 'auto',
                            bottom: settings.minimizeOffset+'px'
                       };
                        break;
               }
           }
            if(settings.animate){
                setTransitionDuration(settings.animate);
                detachedContent=contentContainer.children();
                if(detachedContent.nodes&&detachedContent.nodes.length>0){
                    windowElement.data('detached-content', detachedContent.detach());
               }
                const currentHeight=windowElement.height();
                const titlebarHeight=parseInt(getComputedStyle(titlebar.nodes[0]).height, 10);
                windowElement.css({
                    height: titlebarHeight+'px'
               });
                setTimeout(()=>{
                    windowElement.addClass(Container.windowClasses.window_minimized);
                    windowElement.css(minimizedPosition);
                    resetTransition();
               }, settings.animate/2);
           } else{
                detachedContent=contentContainer.children();
                if(detachedContent.nodes&&detachedContent.nodes.length>0){
                    windowElement.data('detached-content', detachedContent.detach());
               }
                windowElement.addClass(Container.windowClasses.window_minimized);
                windowElement.css(minimizedPosition);
                isAnimating=false;
           }
            const maximizeButtons=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_maximize);
            if(maximizeButtons.length){
                for(let i=0; i<maximizeButtons.length; i++){
                    maximizeButtons[i].innerHTML='';
                    const iconElement=Container.prototype.Icon('window-full');
                    iconElement.addClass(Container.windowClasses.window_button_icon);
                    maximizeButtons[i].appendChild(iconElement.nodes[0]);
               }
           }
       } else{
            if(settings.animate){
                setTransitionDuration(settings.animate);
                windowElement.css({
                    position: 'fixed',
                    left: previousState.x+'px',
                    top: previousState.y+'px',
                    right: 'auto',
                    bottom: 'auto',
                    margin: '0'
               });
                windowElement.removeClass(Container.windowClasses.window_minimized);
                windowElement.css({
                    height: previousState.height+'px'
               });
                if(settings.minimizeContainer){
                    document.body.appendChild(windowElement.nodes[0]);
               }
                setTimeout(()=>{
                    const savedContent=windowElement.data('detached-content');
                    if(savedContent){
                        contentContainer.append(savedContent);
                        windowElement.removeData('detached-content');
                   }
                    resetTransition();
               }, settings.animate/2);
           } else{
                windowElement.removeClass(Container.windowClasses.window_minimized);
                windowElement.css({
                    position: 'fixed',
                    left: previousState.x+'px',
                    top: previousState.y+'px',
                    right: 'auto',
                    bottom: 'auto',
                    margin: '0',
                    height: previousState.height+'px',
                    width: previousState.width+'px'
               });
                if(settings.minimizeContainer){
                    document.body.appendChild(windowElement.nodes[0]);
               }
                const savedContent=windowElement.data('detached-content');
                if(savedContent){
                    contentContainer.append(savedContent);
                    windowElement.removeData('detached-content');
               }
                isAnimating=false;
           }
       }
   }
    function toggleMaximize(){
        if(isAnimating) return;
        isAnimating=true;
        isMaximized=!isMaximized;
        if(isMaximized){
            if(!isMinimized){
                previousState.width=windowElement.width();
                previousState.height=windowElement.height();
                previousState.x=parseInt(windowElement.css('left'), 10);
                previousState.y=parseInt(windowElement.css('top'), 10);
           } else{
                windowElement.removeClass(Container.windowClasses.window_minimized);
                if(previousState.width<settings.minWidth){
                    previousState.width=settings.width;
                    previousState.height=settings.height;
                    const position=calculateInitialPosition();
                    previousState.x=position.left;
                    previousState.y=position.top;
               }
           }
            if(settings.animate){
                setTransitionDuration(settings.animate);
                windowElement.css({
                    position: 'fixed',
                    top: previousState.y+'px',
                    left: previousState.x+'px',
                    width: previousState.width+'px',
                    height: previousState.height+'px'
               });
                void windowElement.nodes[0].offsetWidth;
                windowElement.css({
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    borderRadius: '0'
               });
                setTimeout(()=>{
                    windowElement.addClass(Container.windowClasses.window_maximized);
                    resetTransition();
               }, settings.animate);
           } else{
                windowElement.addClass(Container.windowClasses.window_maximized);
                isAnimating=false;
           }
            const maximizeButtons=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_maximize);
            if(maximizeButtons.length){
                for(let i=0; i<maximizeButtons.length; i++){
                    maximizeButtons[i].innerHTML='';
                    const iconElement=Container.prototype.Icon('window-windowed');
                    iconElement.addClass(Container.windowClasses.window_button_icon);
                    maximizeButtons[i].appendChild(iconElement.nodes[0]);
               }
           }
       } else{
            if(settings.animate){
                windowElement.removeClass(Container.windowClasses.window_maximized);
                setTransitionDuration(settings.animate);
                windowElement.css({
                    position: 'fixed',
                    top: previousState.y+'px',
                    left: previousState.x+'px',
                    width: previousState.width+'px',
                    height: previousState.height+'px',
                    borderRadius: '4px' 
               });
                resetTransition();
           } else{
                windowElement.removeClass(Container.windowClasses.window_maximized);
                windowElement.css({
                    position: 'fixed',
                    width: previousState.width+'px',
                    height: previousState.height+'px',
                    left: previousState.x+'px',
                    top: previousState.y+'px',
                    borderRadius: '4px'
               });
                isAnimating=false;
           }
            const maximizeButtons=windowElement.nodes[0].querySelectorAll('.'+Container.windowClasses.window_maximize);
            if(maximizeButtons.length){
                for(let i=0; i<maximizeButtons.length; i++){
                    maximizeButtons[i].innerHTML='';
                    const iconElement=Container.prototype.Icon('window-full');
                    iconElement.addClass(Container.windowClasses.window_button_icon);
                    maximizeButtons[i].appendChild(iconElement.nodes[0]);
               }
           }
       }
   }
    function closeWindow(){
        if(isAnimating) return;
        const savedContent=windowElement.data('detached-content');
        if(savedContent){
            windowElement.removeData('detached-content');
       }
        if(settings.animate){
            isAnimating=true;
            setTransitionDuration(settings.animate);
            windowElement.css({
                opacity: '0',
                transform: 'scale(0.90)'
           });
            setTimeout(()=>{
                if(windowElement.nodes[0]._resizeHandler){
                    window.removeEventListener('resize', windowElement.nodes[0]._resizeHandler);
                    windowElement.nodes[0]._resizeHandler=null;
               }
                const windowIndex=Container.openWindows.indexOf(windowElement.nodes[0]);
                if(windowIndex!==-1){
                    Container.openWindows.splice(windowIndex, 1);
                    updateZIndices();
               }
                windowElement.remove();
                isOpen=false;
           }, settings.animate);
       } else{
            if(windowElement.nodes[0]._resizeHandler){
                window.removeEventListener('resize', windowElement.nodes[0]._resizeHandler);
                windowElement.nodes[0]._resizeHandler=null;
           }
            const windowIndex=Container.openWindows.indexOf(windowElement.nodes[0]);
            if(windowIndex!==-1){
                Container.openWindows.splice(windowIndex, 1);
                updateZIndices();
           }
            windowElement.remove();
            isOpen=false;
       }
   }
    function handleWindowResize(){
        if(isMaximized){
            return;
       }
        const viewportWidth=window.innerWidth;
        const viewportHeight=window.innerHeight;
        const currentWidth=windowElement.width();
        const currentHeight=windowElement.height();
        let currentLeft=parseInt(windowElement.css('left'), 10);
        let currentTop=parseInt(windowElement.css('top'), 10);
        let needsUpdate=false;
        if(currentWidth>viewportWidth){
            windowElement.css('width', viewportWidth+'px');
            previousState.width=viewportWidth;
            needsUpdate=true;
       }
        if(currentHeight>viewportHeight){
            windowElement.css('height', viewportHeight+'px');
            previousState.height=viewportHeight;
            needsUpdate=true;
       }
        if(currentLeft+currentWidth>viewportWidth){
            currentLeft=Math.max(0, viewportWidth-currentWidth);
            needsUpdate=true;
       }
        if(currentTop+currentHeight>viewportHeight){
            currentTop=Math.max(0, viewportHeight-currentHeight);
            needsUpdate=true;
       }
        if(needsUpdate){
            windowElement.css({
                left: currentLeft+'px',
                top: currentTop+'px'
           });
            previousState.x=currentLeft;
            previousState.y=currentTop;
       }
   }
    function setupWindowResizeHandler(){
        function resizeHandler(){
            handleWindowResize();
       }
        windowElement.nodes[0]._resizeHandler=resizeHandler;
        window.addEventListener('resize', resizeHandler);
   }
    const windowAPI={
        Open: function(){
            if(!isOpen){
                document.body.appendChild(windowElement.nodes[0]);
                setInitialPositionAndSize(); // This now uses fixed positioning
                if(settings.animate){
                    windowElement.css({
                        opacity: '0',
                        transform: 'scale(0.90)'
                   });
                    void windowElement.nodes[0].offsetWidth;
                    isAnimating=true;
                    setTransitionDuration(settings.animate);
                    windowElement.css({
                        opacity: '1',
                        transform: 'scale(1)'
                   });
                    resetTransition();
               }
                setupDraggable();
                setupResizable();
                setupControls();
                setupWindowResizeHandler();
                isOpen=true;
                bringToFront();
           } else{
                windowElement.show();
                bringToFront();
           }
            return this;
       },
        Close: function(){
            closeWindow();
            return this;
       },
        Content: function(content){
            if(content===undefined){
                return contentContainer.html();
           }
            contentContainer.empty();
            if(typeof content==='string'){
                contentContainer.html(content);
           } else if(content instanceof Element||content instanceof Q){
                contentContainer.append(content);
           }
            return this;
       },
        Title: function(title){
            if(title===undefined){
                return titleElement.text();
           }
            titleElement.text(title);
            return this;
       },
        Position: function(x, y){
            if(x===undefined||y===undefined){
                return{
                    x: parseInt(windowElement.css('left'), 10),
                    y: parseInt(windowElement.css('top'), 10)
               };
           }
            const viewportWidth=window.innerWidth;
            const viewportHeight=window.innerHeight;
            const windowWidth=windowElement.width();
            const windowHeight=windowElement.height();
            let left=typeof x==='string'&&x.endsWith('%') 
               ?(viewportWidth*parseInt(x, 10)/100)-(windowWidth/2)
               :x;
            let top=typeof y==='string'&&y.endsWith('%')
               ?(viewportHeight*parseInt(y, 10)/100)-(windowHeight/2)
               :y;
            left=Math.max(0, Math.min(left, viewportWidth-windowWidth));
            top=Math.max(0, Math.min(top, viewportHeight-windowHeight));
            windowElement.css({
                left: left+'px',
                top: top+'px'
           });
            previousState.x=left;
            previousState.y=top;
            return this;
       },
        Size: function(width, height){
            if(width===undefined||height===undefined){
                return{
                    width: windowElement.width(),
                    height: windowElement.height()
               };
           }
            const viewportWidth=window.innerWidth;
            const viewportHeight=window.innerHeight;
            let currentLeft=parseInt(windowElement.css('left'), 10);
            let currentTop=parseInt(windowElement.css('top'), 10);
            width=Math.max(settings.minWidth, width);
            height=Math.max(settings.minHeight, height);
            if(currentLeft+width>viewportWidth){
                currentLeft=Math.max(0, viewportWidth-width);
                windowElement.css('left', currentLeft+'px');
                previousState.x=currentLeft;
           }
            if(currentTop+height>viewportHeight){
                currentTop=Math.max(0, viewportHeight-height);
                windowElement.css('top', currentTop+'px');
                previousState.y=currentTop;
           }
            windowElement.css({
                width: width+'px',
                height: height+'px'
           });
            previousState.width=width;
            previousState.height=height;
            return this;
       },
        Minimize: function(){
            if(!isMinimized){
                toggleMinimize();
           }
            return this;
       },
        Maximize: function(){
            if(!isMaximized){
                toggleMaximize();
           }
            return this;
       },
        Restore: function(){
            if(isMinimized){
                toggleMinimize();
           } else if(isMaximized){
                toggleMaximize();
           }
            return this;
       },
        IsMinimized: function(){
            return isMinimized;
       },
        IsMaximized: function(){
            return isMaximized;
       },
        IsOpen: function(){
            return isOpen;
       },
        Element: function(){
            return windowElement;
       },
        BringToFront: function(){
            bringToFront();
            return this;
       },
        MinimizePosition: function(position, container, offset){
            if(position===undefined){
                return{
                    position: settings.minimizePosition,
                    container: settings.minimizeContainer,
                    offset: settings.minimizeOffset
               };
           }
            if(position){
                settings.minimizePosition=position;
           }
            if(container!==undefined){
                settings.minimizeContainer=container;
           }
            if(offset!==undefined){
                settings.minimizeOffset=offset;
           }
            if(isMinimized){
                toggleMinimize();
                toggleMinimize();
           }
            return this;
       },
        Animation: function(duration){
            if(duration===undefined){
                return settings.animate;
           }
            settings.animate=parseInt(duration)||0;
            return this;
       }
   };
    this.elements.push(windowAPI);
    return windowAPI;
};
Q.Cookie=function(a, b, c={}){
    const buildOptions=(d)=>{
      let e='';
      if(d.days) e+=`expires=${new Date(Date.now()+d.days*86400000).toUTCString()}; `;
      if(d.path) e+=`path=${d.path}; `;
      if(d.domain) e+=`domain=${d.domain}; `;
      if(d.secure) e+='secure; ';
      return e;
   };
    if(arguments.length>1){
      if(b===null||b===''){
        b='';
        c={ ...c, days: -1};
     }
      return document.cookie=`${a}=${b}; ${buildOptions(c)}`;
   }
    const f=document.cookie.split('; ');
    for(let g=0, h=f.length; g<h; g++){
      const i=f[g];
      const j=i.indexOf('=');
      if(j>-1&&i.slice(0, j).trim()===a){
        return i.slice(j+1);
     }
   }
    return undefined;
 };
Q.Fetch=function(a, b, c={}){
    const{
        d='GET',
        e={},
        f,
        g='application/json',
        h='json',
        i='same-origin',
        j=3,
        k=1000,
        l=false,
        m=0,
        n=(data)=>data,
        o=null,
        t: p=null
   }=c;
    if(o&&typeof o==='object'){
        const r=new URL(a, location.origin);
        Object.entries(o).forEach(([key, value])=>r.searchParams.append(key, value));
        a=r.toString();
   }
    let q=f;
    if(f&&typeof f==='object'&&g==='application/json'&&!(f instanceof FormData)){
        try{ q=JSON.stringify(f);} catch(a1){ b(new Error('Failed to serialize request f'), null); return;}
   }
    e['Content-Type']=e['Content-Type']||g;
    const s=new AbortController();
    const{ t}=s;
    if(p){
        p.addEventListener('abort',()=>s.abort(),{ once: true});
   }
    const u=(v)=>{
        let w=null;
        if(m){ w=setTimeout(()=>s.abort(), m);}
        fetch(a,{ d, e, f: q, i, t})
            .then(x =>{
                if(!x.ok) throw new Error(`Network x was not ok: ${x.statusText}`);
                switch(h){
                    case 'json': return x.json();
                    case 'text': return x.text();
                    case 'blob': return x.blob();
                    case 'arrayBuffer': return x.arrayBuffer();
                    default: throw new Error('Unsupported x type');
               }
           })
            .then(y =>{
                if(w) clearTimeout(w);
                return n(y);
           })
            .then(z=>b(null, z))
            .catch(a1 =>{
                if(w) clearTimeout(w);
                if(a1.name==='AbortError'){
                    b(new Error('Fetch request was aborted'), null);
               } else if(v<j){
                    const b1=l?k*(2**v):k;
                    setTimeout(()=>u(v+1), b1);
               } else{
                    b(a1, null);
               }
           });
   };
    u(0);
    return{ abort:()=>s.abort()};
};
function Form(options={}){
    if(!(this instanceof Form)){
        return new Form(options);
   }
    this.elements=[];
    this.options=options;
    if(!Form.initialized){
        Form.classes=Q.style(`
           --form-default-border-radius: 5px;
           --form-default-padding: 5px 10px;
           --form-default-font-size: 12px;
           --form-default-font-family: Arial, sans-serif;
           --form-default-input-background-color:rgb(37, 37, 37);
           --form-default-input-text-color:rgb(153, 153, 153);
           --form-default-input-border-color:rgba(255, 255, 255, 0.03);
           --form-default-checkbox-background-color:rgb(68, 68, 68);
           --form-default-checkbox-active-background-color:rgb(100, 60, 240);
           --form-default-checkbox-text-color:rgb(153, 153, 153);
           --form-default-checkbox-radius: 5px;
           --form-default-button-background-color:rgb(100, 60, 240);
           --form-default-button-text-color: #fff;
           --form-default-button-hover-background-color:rgb(129, 100, 231);
           --form-default-button-hover-text-color: #fff;
           --form-default-button-active-background-color:rgb(129, 100, 231);
           --form-default-button-active-text-color: #fff;
           --form-default-button-border-color:rgba(255, 255, 255, 0.1);
        `, `
            .form_icon{
                width: 100%;
                height: 100%;
                color: #fff;
                pointer-events: none;
           }
            .form_close_button{
            user-select: none;
                -webkit-user-select: none;
                position: absolute;
                top: 0px;
                right: 0px;
                width: 18px;
                height: 18px;
                background-color: rgba(0, 0, 0, 0.5);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
           }
            .form_close_button:hover{
                background-color: rgba(220, 53, 69, 0.8);
           }
        `, null,{
            'form_icon': 'form_icon',
            'form_close_button': 'form_close_button'
       });
        Form.initialized=true;
        console.log('Form core initialized');
   }
}
Form.prototype.Icon=function(icon){
    let iconElement=Q('<div>');
    iconElement.addClass('svg_'+icon+' form_icon');
    return iconElement;
};
Q.Form=Form;
Form.prototype.Button=function(text=''){
    if(!Form.buttonClassesInitialized){
        Form.buttonClasses=Q.style(null, `
            .button{
                user-select: none;
                font-family: var(--form-default-font-family);
                background-color: var(--form-default-button-background-color);
                color: var(--form-default-button-text-color);
                box-shadow: inset 0 0 0 1px var(--form-default-button-border-color);
                border-radius: var(--form-default-border-radius);
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                cursor: pointer;
           }
            .button:hover{
                background-color: var(--form-default-button-hover-background-color);
                color: var(--form-default-button-hover-text-color);
           }
            .button:active{
                background-color: var(--form-default-button-active-background-color);
                color: var(--form-default-button-active-text-color);
           }
            .button_disabled{
                opacity: 0.6;
                cursor: not-allowed;
           }
        `, null,{
            'button_disabled': 'button_disabled',
            'button': 'button'
       });
        Form.buttonClassesInitialized=true;
   }
    const button=Q(`<div class="${Form.buttonClasses.button}">${text}</div>`);
    button.click=function(callback){
        button.on('click', callback);
        return button;
   };
    button.disabled=function(state){
        if(state){
            button.addClass(Form.buttonClasses.button_disabled);
       } else{
            button.removeClass(Form.buttonClasses.button_disabled);
       }
        return button;
   };
    button.setText=function(newText){
        button.text(newText);
        return button;
   };
    button.remove=function(){
        button.remove();
        return button;
   };
    this.elements.push(button);
    return button;
};
Form.prototype.CheckBox=function(checked=false, text=''){
    if(!Form.checkBoxClassesInitialized){
        Form.checkBoxClasses=Q.style('', `
            .q_form_checkbox{
                display: flex;
                width: fit-content;
                align-items: center;
           }
            .q_form_checkbox .label:empty{
                display: none;
           }
            .q_form_checkbox .label{
                padding-left: 5px;
                user-select: none;
           }
            .q_form_cb{
                position: relative;
                width: 20px;
                height: 20px;
                background-color: var(--form-default-checkbox-background-color);
                border-radius: var(--form-default-checkbox-radius);
           }
            .q_form_cb input[type="checkbox"]{
                opacity: 0;
                top: 0;
                left: 0;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                position: absolute;
           }
            .q_form_cb input[type="checkbox"]:checked+label:before{
                content: "";
                position: absolute;
                display: block;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--form-default-checkbox-active-background-color);
                border-radius: var(--form-default-checkbox-radius);
           }
                .q_form_label{
                padding-left: 5px;
                color: var(--form-default-checkbox-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
           }
        `, null,{
            'q_form_checkbox': 'q_form_checkbox',
            'q_form_cb': 'q_form_cb',
            'q_form_label': 'q_form_label'
       });
        Form.checkBoxClassesInitialized=true;
   }
    let ID='_'+Q.ID();
    const container=Q('<div class="'+Form.classes.q_form+' '+Form.checkBoxClasses.q_form_checkbox+'">');
    const checkbox_container=Q('<div class="'+Form.checkBoxClasses.q_form_cb+'">');
    const input=Q(`<input type="checkbox" id="${ID}">`);
    const label=Q(`<label for="${ID}"></label>`);
    const labeltext=Q(`<div class="${Form.checkBoxClasses.q_form_label}">${text}</div>`);
    if(checked){
        input.prop('checked', true);
   }
    checkbox_container.append(input, label);
    container.append(checkbox_container, labeltext);
    container.checked=function(state){
        input.prop('checked', state);
        if(state){
            input.trigger('change');
       }
   };
    container.change=function(callback){
        input.on('change', function(){
            callback(this.checked);
       });
   };
    container.disabled=function(state){
        input.prop('disabled', state);
        if(state){
            container.addClass(Form.classes.q_form_disabled);
       } else{
            container.removeClass(Form.classes.q_form_disabled);
       }
   };
    container.text=function(text){
        labeltext.text(text);
   };
    this.elements.push(container);
    return container;
};
Form.prototype.Tags=function(value='', placeholder='', options={}){
    const defaultOptions={
        separator: ',',
        maxTags: null,
        minChars: 1
   };
    options=Object.assign({}, defaultOptions, options);
    if(!Form.tagsClassesInitialized){
        Form.tagsClasses=Q.style('', `
            .form_tags_container{
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                width: 100%;
                min-height: 36px;
                padding: 3px;
                border: 1px solid var(--form-default-input-border-color);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                cursor: text;
           }
            .form_tags_container:focus-within{
                border-color: var(--form-default-button-background-color);
                outline: none;
           }
            .form_tag{
                display: inline-flex;
                align-items: center;
                padding: 3px 8px;
                background-color: var(--form-default-button-background-color);
                color: var(--form-default-button-text-color);
                border-radius: var(--form-default-border-radius);
                font-size: var(--form-default-font-size);
                font-family: var(--form-default-font-family);
                user-select: none;
           }
            .form_tag_editable{
                background-color: var(--form-default-button-hover-background-color);
           }
            .form_tag_remove{
                margin-left: 5px;
                cursor: pointer;
                width: 14px;
                height: 14px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.2);
           }
            .form_tag_input{
                flex-grow: 1;
                min-width: 60px;
                border: none;
                outline: none;
                padding: 5px;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                background: transparent;
                color: var(--form-default-input-text-color);
           }
            .form_tag.dragging{
                opacity: 0.5;
           }
            .form_tag[draggable=true]{
                cursor: move;
           }
        `, null,{
            'form_tags_container': 'form_tags_container',
            'form_tag': 'form_tag',
            'form_tag_editable': 'form_tag_editable',
            'form_tag_remove': 'form_tag_remove',
            'form_tag_input': 'form_tag_input'
       });
        Form.tagsClassesInitialized=true;
   }
    const container=Q(`<div class="${Form.classes.q_form} ${Form.tagsClasses.form_tags_container}"></div>`);
    const input=Q(`<input class="${Form.tagsClasses.form_tag_input}" placeholder="${placeholder}" type="text">`);
    const state={
        tags:[],
        draggedTag: null,
        currentEditTag: null
   };
    container.append(input);
    if(value&&typeof value==='string'&&value.trim()!==''){
        const initialTags=value.split(options.separator)
                               .map(tag=>tag.trim())
                               .filter(Boolean);
        initialTags.forEach(tag=>addTag(tag));
   }
    function addTag(text){
        if(!text||text.length<options.minChars) return;
        if(options.maxTags!==null&&state.tags.length>=options.maxTags) return;
        if(state.tags.includes(text)) return;
        const tag=Q(`<div class="${Form.tagsClasses.form_tag}" draggable="true"></div>`);
        const tagText=Q(`<span>${text}</span>`);
        const removeBtn=Q(`<span class="${Form.tagsClasses.form_tag_remove}">×</span>`);
        tag.append(tagText, removeBtn);
        state.tags.push(text);
        input.before(tag);
        setupDragAndDrop(tag);
        tag.on('click', function(e){
            if(e.target.classList.contains(Form.tagsClasses.form_tag_remove.split(' ')[0])) return;
            tag.html('');
            tag.addClass(Form.tagsClasses.form_tag_editable);
            const editInput=Q(`<input type="text" value="${text}" style="border:none; background:transparent; color:inherit; outline:none; width:auto;">`);
            tag.append(editInput);
            editInput.focus();
            state.currentEditTag={ tag, originalText: text};
            editInput.on('blur', function(){
                finishEditing(editInput.val());
           });
            editInput.on('keydown', function(e){
                if(e.key==='Enter'){
                    finishEditing(editInput.val());
                    e.preventDefault();
               } else if(e.key==='Escape'){
                    finishEditing(text); 
                    e.preventDefault();
               }
           });
       });
        removeBtn.on('click', function(){
            removeTag(tag, text);
       });
        if(typeof container.changeCallback==='function'){
            container.changeCallback(state.tags.join(options.separator));
       }
   }
    function finishEditing(newText){
        if(!state.currentEditTag) return;
        const{ tag, originalText}=state.currentEditTag;
        const index=state.tags.indexOf(originalText);
        if(index!==-1){
            state.tags.splice(index, 1);
       }
        if(newText&&newText.trim()&&newText.length>=options.minChars){
            tag.removeClass(Form.tagsClasses.form_tag_editable);
            tag.html(`<span>${newText}</span><span class="${Form.tagsClasses.form_tag_remove}">×</span>`);
            tag.find(`.${Form.tagsClasses.form_tag_remove.split(' ')[0]}`).on('click', function(){
                removeTag(tag, newText);
           });
            state.tags.push(newText);
       } else{
            tag.remove();
       }
        state.currentEditTag=null;
        if(typeof container.changeCallback==='function'){
            container.changeCallback(state.tags.join(options.separator));
       }
   }
    function removeTag(tagElement, text){
        tagElement.remove();
        const index=state.tags.indexOf(text);
        if(index!==-1){
            state.tags.splice(index, 1);
       }
        if(typeof container.changeCallback==='function'){
            container.changeCallback(state.tags.join(options.separator));
       }
   }
    function setupDragAndDrop(tag){
        tag.on('dragstart', function(e){
            state.draggedTag=tag;
            tag.addClass('dragging');
            if(e.dataTransfer){
                e.dataTransfer.setData('text/plain', '');
                e.dataTransfer.effectAllowed='move';
           }
       });
        tag.on('dragend', function(){
            state.draggedTag=null;
            tag.removeClass('dragging');
       });
        tag.on('dragover', function(e){
            if(e.preventDefault){
                e.preventDefault(); 
           }
            return false;
       });
        tag.on('dragenter', function(e){
            e.preventDefault();
       });
        tag.on('drop', function(e){
            e.stopPropagation();
            if(!state.draggedTag||state.draggedTag===tag){
                return;
           }
            const allTags=Array.from(container.children()).filter(
                el=>el.classList.contains(Form.tagsClasses.form_tag.split(' ')[0])
           );
            const fromIndex=allTags.indexOf(state.draggedTag);
            const toIndex=allTags.indexOf(tag);
            if(fromIndex<toIndex){
                tag.after(state.draggedTag);
           } else{
                tag.before(state.draggedTag);
           }
            const movedTag=state.tags.splice(fromIndex, 1)[0];
            state.tags.splice(toIndex, 0, movedTag);
            if(typeof container.changeCallback==='function'){
                container.changeCallback(state.tags.join(options.separator));
           }
            return false;
       });
   }
    container.on('click', function(e){
        if(e.target===container.element){
            input.focus();
       }
   });
    input.on('keydown', function(e){
        if(e.key==='Enter'||e.key===','||e.key===';'||(options.separator===' '&&e.key===' ')){
            const value=input.val().trim();
            if(value){
                addTag(value);
                input.val('');
                e.preventDefault();
           }
       }
        else if(e.key==='Backspace'&&input.val()===''&&state.tags.length>0){
            const tagElements=container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
            if(tagElements.length>0){
                const lastTag=Q(tagElements[tagElements.length-1]);
                lastTag.click(); 
           }
       }
   });
    input.on('paste', function(e){
        let pastedText;
        if(window.clipboardData&&window.clipboardData.getData){
            pastedText=window.clipboardData.getData('Text');
       } else if(e.clipboardData&&e.clipboardData.getData){
            pastedText=e.clipboardData.getData('text/plain');
       }
        if(pastedText){
            e.preventDefault();
            const tags=pastedText.split(options.separator).map(tag=>tag.trim()).filter(Boolean);
            tags.forEach(tag=>addTag(tag));
            input.val('');
       }
   });
    input.on('blur', function(){
        const inputValue=input.val();
        const value=inputValue?inputValue.trim():'';
        if(value){
            addTag(value);
            input.val('');
       }
   });
    container.val=function(value){
        if(value===undefined){
            return state.tags.join(options.separator);
       }
        if(value===''){
            if(container.nodes&&container.nodes.length>0){
                const tagElements=container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
                for(let i=0; i<tagElements.length; i++){
                    if(tagElements[i].parentNode){
                        tagElements[i].parentNode.removeChild(tagElements[i]);
                   }
               }
           }
            state.tags=[];
       } else{
            if(container.nodes&&container.nodes.length>0){
                const tagElements=container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
                for(let i=0; i<tagElements.length; i++){
                    if(tagElements[i].parentNode){
                        tagElements[i].parentNode.removeChild(tagElements[i]);
                   }
               }
           }
            state.tags=[];
            const newTags=value.split(options.separator).map(tag=>tag.trim()).filter(Boolean);
            newTags.forEach(tag=>addTag(tag));
       }
        if(typeof container.changeCallback==='function'){
            container.changeCallback(state.tags.join(options.separator));
       }
        return container;
   };
    container.placeholder=function(text){
        input.attr('placeholder', text);
        return container;
   };
    container.disabled=function(state){
        input.prop('disabled', state);
        container.css('pointer-events', state?'none':'auto');
        if(state){
            container.addClass(Form.classes.q_form_disabled);
       } else{
            container.removeClass(Form.classes.q_form_disabled);
       }
        return container;
   };
    container.setSeparator=function(separator){
        options.separator=separator;
        return container;
   };
    container.reset=function(){
        return container.val('');
   };
    container.change=function(callback){
        container.changeCallback=callback;
        return container;
   };
    this.elements.push(container);
    return container;
};
Form.prototype.TextArea=function(value='', placeholder=''){
    if(!Form.textAreaClassesInitialized){
        Form.textAreaClasses=Q.style('', `
            .form_textarea{
                width: 100%;
                padding: var(--form-default-padding);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                color: var(--form-default-input-text-color);
                border: 1px solid var(--form-default-input-border-color);
                resize: none;
                min-height: 100px;
           }
            .form_textarea:focus{
                border-color: var(--form-default-button-background-color);
                outline: none;
           }
        `, null,{
            'form_textarea': 'form_textarea'
       });
        Form.textAreaClassesInitialized=true;
   }
    const textarea=Q(`<textarea class="${Form.classes.q_form} ${Form.textAreaClasses.form_textarea}" placeholder="${placeholder}">${value}</textarea>`);
    textarea.placeholder=function(text){
        textarea.attr('placeholder', text);
   };
    textarea.disabled=function(state){
        textarea.prop('disabled', state);
        if(state){
            textarea.addClass(Form.classes.q_form_disabled);
       } else{
            textarea.removeClass(Form.classes.q_form_disabled);
       }
   };
    textarea.reset=function(){
        textarea.val('');
   };
    textarea.change=function(callback){
        textarea.on('change', function(){
            callback(this.value);
       });
   };
    this.elements.push(textarea);
    return textarea;
};
Form.prototype.TextBox=function(type='text', value='', placeholder=''){
    if(!Form.textBoxClassesInitialized){
        Form.textBoxClasses=Q.style('', `
            .q_form_input{
                width: 100%;
                font-family: var(--form-default-font-family);
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                color: var(--form-default-input-text-color);
                border: 1px solid var(--form-default-input-border-color);
                resize: none;
           }
            .q_form_input:focus{
                border-color: var(--form-default-button-background-color);
                outline: none;
           }
        `, null,{
            'q_form_input': 'q_form_input'
       });
        Form.textBoxClassesInitialized=true;
   }
    const input=Q(`<input class="${Form.classes.q_form} ${Form.textBoxClasses.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);
    input.placeholder=function(text){
        input.attr('placeholder', text);
   };
    input.disabled=function(state){
        input.prop('disabled', state);
        if(state){
            input.addClass(Form.classes.q_form_disabled);
       } else{
            input.removeClass(Form.classes.q_form_disabled);
       }
   };
    input.reset=function(){
        input.val('');
   };
    input.change=function(callback){
        input.on('change', function(){
            callback(this.value);
       });
   };
    this.elements.push(input);
    return input;
};
Form.prototype.Uploader=function(options={}){
    const defaultOptions={
        fileTypes: '*', // Accepted file types: 'image/jpeg,image/png' or '.jpg,.png'
        preview: true,  // Show previews for images/videos
        thumbSize: 100, // Thumbnail size(px)
        allowDrop: true, // Allow drag and drop
        multiple: false, // Allow multiple file selection
        placeholder: 'Drop files here or click to select'
   };
    options=Object.assign({}, defaultOptions, options);
    if(!Form.uploaderClassesInitialized){
        Form.uploaderClasses=Q.style('', `
            .form_uploader_container{
            user-select: none;
                -webkit-user-select: none;
                display: flex;
                flex-direction: column;
                width: 100%;
                border: 2px dashed var(--form-default-input-border-color);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                padding: 10px;
           }
            .form_uploader_container.drag_over{
                border-color: var(--form-default-button-background-color);
                background-color: rgba(100, 60, 240, 0.05);
           }
            .form_uploader_drop_area{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                color: var(--form-default-input-text-color);
                min-height: 120px;
           }
            .form_uploader_icon{
                font-size: 32px;
                margin-bottom: 10px;
                opacity: 0.7;
           }
            .form_uploader_text{
                margin-bottom: 10px;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
           }
            .form_uploader_button{
                padding: var(--form-default-padding);
                background-color: var(--form-default-button-background-color);
                color: var(--form-default-button-text-color);
                border: none;
                border-radius: var(--form-default-border-radius);
                cursor: pointer;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
           }
            .form_uploader_button:hover{
                background-color: var(--form-default-button-hover-background-color);
           }
            .form_uploader_input{
                display: none;
           }
            .form_uploader_preview_container{
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 5px;
           }
            .form_uploader_preview_item{
                position: relative;
                border-radius: var(--form-default-border-radius);
                overflow: hidden;
                border: 1px solid var(--form-default-input-border-color);
           }
            .form_uploader_preview_image{
                object-fit: cover;
                display: block;
           }
            .form_uploader_preview_video{
                object-fit: cover;
                display: block;
           }
            .form_uploader_preview_icon{
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--form-default-input-text-color);
                background-color: rgba(37, 37, 37, 0.8);
                font-size: 24px;
           }
            .form_uploader_preview_info{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 4px 6px;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                font-size: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
           }
        `, null,{
            'form_uploader_container': 'form_uploader_container',
            'drag_over': 'drag_over',
            'form_uploader_drop_area': 'form_uploader_drop_area',
            'form_uploader_icon': 'form_uploader_icon',
            'form_uploader_text': 'form_uploader_text',
            'form_uploader_button': 'form_uploader_button',
            'form_uploader_input': 'form_uploader_input',
            'form_uploader_preview_container': 'form_uploader_preview_container',
            'form_uploader_preview_item': 'form_uploader_preview_item',
            'form_uploader_preview_image': 'form_uploader_preview_image',
            'form_uploader_preview_video': 'form_uploader_preview_video',
            'form_uploader_preview_icon': 'form_uploader_preview_icon',
            'form_uploader_preview_info': 'form_uploader_preview_info'
       });
        Form.uploaderClassesInitialized=true;
   }
    const container=Q(`<div class="${Form.classes.q_form} ${Form.uploaderClasses.form_uploader_container}"></div>`);
    const dropArea=Q(`<div class="${Form.uploaderClasses.form_uploader_drop_area}"></div>`);
    const uploadIcon=Q(`<div class="${Form.uploaderClasses.form_uploader_icon}">📂</div>`);
    const text=Q(`<div class="${Form.uploaderClasses.form_uploader_text}">${options.placeholder}</div>`);
    const browseButton=Q(`<button type="button" class="${Form.uploaderClasses.form_uploader_button}">Browse Files</button>`);
    const fileInput=Q(`<input type="file" class="${Form.uploaderClasses.form_uploader_input}">`);
    if(options.multiple){
        fileInput.attr('multiple', true);
   }
    if(options.fileTypes&&options.fileTypes!=='*'){
        fileInput.attr('accept', options.fileTypes);
   }
    dropArea.append(uploadIcon, text, browseButton);
    container.append(dropArea, fileInput);
    let previewContainer=null;
    if(options.preview){
        previewContainer=Q(`<div class="${Form.uploaderClasses.form_uploader_preview_container}"></div>`);
        container.append(previewContainer);
   }
    const state={
        files:[],
        fileObjects:[]
   };
    function formatFileSize(bytes){
        if(bytes===0) return '0 B';
        const k=1024;
        const sizes=['B', 'KB', 'MB', 'GB', 'TB'];
        const i=Math.floor(Math.log(bytes)/Math.log(k));
        return parseFloat((bytes/Math.pow(k, i)).toFixed(2))+' '+sizes[i];
   }
    function getFileExtension(filename){
        return filename.split('.').pop().toUpperCase();
   }
    function handleFiles(files){
        if(!files||files.length===0) return;
        Array.from(files).forEach(file =>{
            const fileInfo={
                name: file.name,
                size: file.size,
                formattedSize: formatFileSize(file.size),
                type: file.type,
                extension: getFileExtension(file.name)
           };
            state.files.push(fileInfo);
            state.fileObjects.push(file);
            if(options.preview){
                generatePreview(file, fileInfo);
           }
       });
        if(typeof container.changeCallback==='function'){
            container.changeCallback(state.files);
       }
   }
    function generatePreview(file, fileInfo){
        const previewItem=Q(`<div class="${Form.uploaderClasses.form_uploader_preview_item}"></div>`);
        const fileInfoElement=Q(`<div class="${Form.uploaderClasses.form_uploader_preview_info}">${file.name}(${fileInfo.formattedSize})</div>`);
        const removeButton=Q(`<div class="${Form.classes.form_close_button}">×</div>`);
        previewItem.css({
            width: options.thumbSize+'px',
            height: options.thumbSize+'px'
       });
        const titleInfo=`Name: ${file.name}\nSize: ${fileInfo.formattedSize}\nType: ${file.type}`;
        previewItem.attr('title', titleInfo);
        if(file.type.startsWith('image/')){
            const img=Q(`<img class="${Form.uploaderClasses.form_uploader_preview_image}" alt="${file.name}">`);
            img.css({
                width: '100%',
                height: '100%'
           });
            img.attr('title', titleInfo);
            const reader=new FileReader();
            reader.onload=function(e){
                img.attr('src', e.target.result);
                fileInfo.preview=e.target.result;
           };
            reader.readAsDataURL(file);
            previewItem.append(img);
       }
        else if(file.type.startsWith('video/')){
            const video=Q(`<video class="${Form.uploaderClasses.form_uploader_preview_video}" controls muted>`);
            video.css({
                width: '100%',
                height: '100%'
           });
            video.attr('title', titleInfo);
            const reader=new FileReader();
            reader.onload=function(e){
                video.attr('src', e.target.result);
                fileInfo.preview=e.target.result;
           };
            reader.readAsDataURL(file);
            previewItem.append(video);
       }
        else{
            const fileIcon=Q(`<div class="${Form.uploaderClasses.form_uploader_preview_icon}"></div>`);
            fileIcon.css({
                width: '100%',
                height: '100%'
           });
            fileIcon.attr('title', titleInfo);
            fileIcon.text(fileInfo.extension);
            previewItem.append(fileIcon);
       }
        previewItem.append(fileInfoElement, removeButton);
        fileInfo.element=previewItem;
        if(previewContainer){
            previewContainer.append(previewItem);
       }
        removeButton.on('click',()=>{
            removeFile(fileInfo);
       });
   }
    function removeFile(fileInfo){
        const index=state.files.indexOf(fileInfo);
        if(index!==-1){
            state.files.splice(index, 1);
            state.fileObjects.splice(index, 1);
            if(fileInfo.element){
                fileInfo.element.remove();
           }
            if(typeof container.changeCallback==='function'){
                container.changeCallback(state.files);
           }
       }
   }
    function resetUploader(){
        state.files=[];
        state.fileObjects=[];
        if(previewContainer){
            previewContainer.html('');
       }
        fileInput.val('');
   }
    if(options.allowDrop){
       ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName =>{
            dropArea.on(eventName,(e)=>{
                e.preventDefault();
                e.stopPropagation();
           });
       });
       ['dragenter', 'dragover'].forEach(eventName =>{
            dropArea.on(eventName,()=>{
                container.addClass(Form.uploaderClasses.drag_over);
           });
       });
       ['dragleave', 'drop'].forEach(eventName =>{
            dropArea.on(eventName,()=>{
                container.removeClass(Form.uploaderClasses.drag_over);
           });
       });
        dropArea.on('drop',(e)=>{
            const files=e.dataTransfer.files;
            if(!options.multiple&&files.length>1){
                handleFiles([files[0]]);
           } else{
                handleFiles(files);
           }
       });
   }
    browseButton.on('click', function(){
        fileInput.nodes[0].click();
   });
    dropArea.on('click', function(e){
        if(e.target!==browseButton.nodes[0]){
            fileInput.nodes[0].click();
       }
   });
    fileInput.on('change', function(){
        if(!options.multiple){
            resetUploader(); // Clear previous files if not multiple
       }
        handleFiles(this.files);
   });
    container.val=function(value){
        if(value===undefined){
            return{
                files: state.files,
                fileObjects: state.fileObjects
           };
       }
        if(value===''||value===null){
            resetUploader();
            return container;
       }
        return container;
   };
    container.reset=function(){
        resetUploader();
        return container;
   };
    container.disabled=function(state){
        if(state){
            container.css('opacity', '0.5');
            container.css('pointer-events', 'none');
            fileInput.prop('disabled', true);
       } else{
            container.css('opacity', '1');
            container.css('pointer-events', 'auto');
            fileInput.prop('disabled', false);
       }
        return container;
   };
    container.change=function(callback){
        container.changeCallback=callback;
        return container;
   };
    this.elements.push(container);
    return container;
};
Q.Icons=function(){
  let a=Q.getGLOBAL('icons');
  let b={};
  if(a&&a.icons){
    b=a.icons;
 }
  else{
    b=Q.style(`
	--icon_arrow-down: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 100.93685,31.353867 C 82.480099,48.598492 67.319803,62.707709 67.247301,62.707709 c -0.0725,0 -15.232809,-14.109215 -33.689561,-31.353842 L 3.5365448e-8,6.6845858e-7 H 67.247301 134.4946 Z"/></svg>');
	--icon_arrow-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="M 31.353844,100.93685 C 14.109219,82.480099 1.6018623e-6,67.319803 1.6018623e-6,67.247301 1.6018623e-6,67.174801 14.109217,52.014492 31.353844,33.55774 L 62.70771,0 V 67.247301 134.4946 Z"/></svg>');
	--icon_arrow-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="m 31.353868,33.55775 c 17.244625,18.456749 31.353842,33.617045 31.353842,33.689547 0,0.0725 -14.109215,15.232809 -31.353842,33.689563 L 1.6018623e-6,134.4946 V 67.247297 0 Z"/></svg>');
	--icon_arrow-up: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 33.55775,31.353843 C 52.014499,14.109218 67.174795,6.6845858e-7 67.247297,6.6845858e-7 67.319797,6.6845858e-7 82.480106,14.109216 100.93686,31.353843 L 134.4946,62.707709 H 67.247297 3.5365448e-8 Z"/></svg>');
	--icon_navigation-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2666.6667 2666.6667"><path d="M 1276.6667,2434.5485 C 950.24325,2418.4963 647.60291,2257.2797 449.65648,1994.0001 360.09366,1874.8766 294.54616,1735.7649 260.06678,1591.6333 c -40.82486,-170.6571 -40.82486,-347.2761 0,-517.9332 71.52438,-298.98806 268.8554,-557.46223 540.12266,-707.48002 258.68606,-143.06006 568.06486,-175.54075 852.57376,-89.50899 276.927,83.73908 511.1437,274.85672 650.2832,530.62227 168.8614,310.40014 177.2264,688.09064 22.2995,1006.84964 -77.0037,158.4335 -189.7203,295.013 -331.3458,401.4939 -205.303,154.3568 -458.4668,231.6017 -717.3334,218.8716 z m 130.2294,-151.2014 c 229.6976,-18.6692 437.2639,-114.273 599.1754,-275.9766 47.6541,-47.593 83.7471,-91.4686 120.133,-146.0371 91.2885,-136.9067 142.8941,-286.0616 157.3086,-454.6667 3.0513,-35.6912 3.0513,-112.3088 0,-148 -9.7543,-114.0948 -35.6813,-216.2096 -79.956,-314.91095 C 2140.8657,803.99837 2044.7703,680.42081 1924.6667,585.10582 1705.8186,411.42656 1421.4281,342.88551 1146,397.43913 961.28159,434.02604 793.07082,524.16769 658.61926,658.61926 508.15954,809.07897 413.50356,1001.5246 386.76219,1211.3334 c -5.50464,43.1886 -7.16468,71.3013 -7.16468,121.3333 0,50.0321 1.66004,78.1448 7.16468,121.3333 31.40785,246.4213 158.34097,471.0271 353.9045,626.2276 118.14734,93.7625 258.15376,158.5796 405.33331,187.6524 50.7995,10.0346 91.5353,14.8142 153.3334,17.9909 18.4799,0.95 83.6306,-0.5787 107.5627,-2.5238 z m 134.7679,-630.3487 -208.3296,-208.3296 -207.9982,207.9951 -207.99834,207.9951 -54.66892,-54.6567 c -30.0679,-30.0612 -54.66892,-55.2602 -54.66892,-55.9978 0,-0.7375 93.30001,-94.6396 207.33338,-208.6711 l 207.3333,-207.3301 -206.6689,-206.6721 -206.66886,-206.67213 55.00599,-54.99402 55.006,-54.99402 206.66127,206.66447 206.6613,206.6646 207.6661,-207.6629 207.666,-207.66288 55.3378,55.32571 55.3378,55.32571 -207.6673,207.67046 -207.6673,207.6705 208.3339,208.3372 208.334,208.3371 -55.0055,54.9935 -55.0054,54.9935 z"/></svg>');
	--icon_navigation-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.66669 682.66669"><path d="M 312.95615,622.51118 C 282.12556,619.5403 247.03663,609.52248 218.00001,595.4014 129.37889,552.30321 70.013661,466.90205 60.059145,368.19207 51.577814,284.09034 83.346262,198.0417 144.85111,138.52292 212.10881,73.437059 306.81846,45.865772 398.4674,64.691724 519.45153,89.543525 610.11296,190.57708 622.60754,314.47462 c 8.48133,84.10173 -23.28712,170.15036 -84.79196,229.66914 -59.89864,57.96444 -141.4913,86.4009 -224.85943,78.36742 z m 71.04386,-40.49085 c 101.01231,-18.37977 179.6848,-97.26565 198.14953,-198.68699 3.46591,-19.0372 3.48193,-65.25956 0.0291,-84 -18.78642,-101.96514 -96.94357,-180.11939 -198.8453,-198.83796 -18.89894,-3.471598 -65.10105,-3.471598 -84,0 C 197.45585,119.2095 119.27,197.39245 100.48802,299.33334 c -3.452807,18.74044 -3.436783,64.9628 0.0291,84 16.64224,91.4109 82.13775,165.12641 170.46427,191.85833 8.26023,2.49995 21.0186,5.49414 28.35193,6.65376 7.33334,1.15962 14.83334,2.3709 16.66667,2.69173 8.26494,1.44635 55.91079,-0.31712 68,-2.51683 z M 320.66668,412.53122 c -36.66667,-38.4534 -66.66667,-70.49248 -66.66667,-71.19795 0,-0.70547 30.15,-32.79758 67,-71.31579 l 67,-70.03311 v 141.34115 c 0,77.73764 -0.15,141.29162 -0.33333,141.23108 -0.18334,-0.0605 -30.33334,-31.57197 -67,-70.02538 z"/></svg>');
	--icon_navigation-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.66669 682.66669"><path d="M 312.95615,622.51118 C 103.83077,602.35954 -10.876679,362.01744 104.94177,186.66667 225.81958,3.6559506 499.6699,21.151057 595.4014,218.00001 691.73222,416.0813 532.80292,643.69595 312.95615,622.51118 Z m 71.04386,-40.49085 C 527.6749,555.87785 617.23885,410.16562 575.1842,270.98141 536.24285,142.10102 399.55264,68.634561 270.98141,107.48249 119.67709,153.19925 50.784795,329.22352 130.9177,465.35432 c 35.94209,61.05887 100.57273,105.76313 168.41564,116.49111 7.33334,1.15962 14.83334,2.3709 16.66667,2.69173 8.26494,1.44635 55.91079,-0.31712 68,-2.51683 z M 294.66668,341.34179 V 199.98437 l 67,70.03311 c 36.85,38.51821 67,70.60056 67,71.2941 0,0.69354 -30.15,32.78948 -67,71.32431 l -67,70.06332 z"/></svg>');
	--icon_window-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 2.8176856,98.903421 -4.0360052e-7,96.085741 22.611458,73.473146 45.222917,50.860554 22.611458,28.247962 -4.0360052e-7,5.6353711 2.8176856,2.8176851 5.6353716,-9.1835591e-7 28.247963,22.611458 50.860555,45.222916 73.473147,22.611458 96.085743,-9.1835591e-7 98.903423,2.8176851 101.72111,5.6353711 79.109651,28.247962 56.498193,50.860554 79.109651,73.473146 101.72111,96.085741 98.903423,98.903421 96.085743,101.72111 73.473147,79.109651 50.860555,56.498192 28.247963,79.109651 5.6353716,101.72111 Z"/></svg>');
	--icon_window-full: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 H 50.860555 84.417403 V 50.860554 84.417401 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z"/></svg>');
	--icon_window-minimize: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 0.5252846,83.893071 V 79.698469 H 50.860555 101.19582 v 4.194602 4.19461 H 50.860555 0.5252846 Z"/></svg>');
	--icon_window-windowed: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 h 8.389212 8.389212 V 8.9144961 0.52528408 H 67.638978 101.19582 V 34.082131 67.638977 h -8.389207 -8.38921 v 8.389212 8.389212 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z M 92.806613,34.082131 V 8.9144961 H 67.638978 42.471343 v 4.1946059 4.194606 h 20.973029 20.973031 v 20.973029 20.973029 h 4.1946 4.19461 z"/></svg>');
	--icon_zoom-in: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z"/></svg>');
	--icon_zoom-out: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z"/></svg>');
`,`
.svg_icon{-webkit-mask-size: cover;mask-size: cover;-webkit-mask-repeat: no-repeat;mask-repeat: no-repeat;-webkit-mask-position: center;mask-position: center;background-color: currentColor;}
.svg_iconsize{ width:100%;height:100%;}
.arrow-down{ mask-image: var(--icon_arrow-down);}
.arrow-left{ mask-image: var(--icon_arrow-left);}
.arrow-right{ mask-image: var(--icon_arrow-right);}
.arrow-up{ mask-image: var(--icon_arrow-up);}
.navigation-close{ mask-image: var(--icon_navigation-close);}
.navigation-left{ mask-image: var(--icon_navigation-left);}
.navigation-right{ mask-image: var(--icon_navigation-right);}
.window-close{ mask-image: var(--icon_window-close);}
.window-full{ mask-image: var(--icon_window-full);}
.window-minimize{ mask-image: var(--icon_window-minimize);}
.window-windowed{ mask-image: var(--icon_window-windowed);}
.zoom-in{ mask-image: var(--icon_zoom-in);}
.zoom-out{ mask-image: var(--icon_zoom-out);}
`,null
,{
  "arrow-down": "arrow-down",
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "arrow-up": "arrow-up",
  "navigation-close": "navigation-close",
  "navigation-left": "navigation-left",
  "navigation-right": "navigation-right",
  "window-close": "window-close",
  "window-full": "window-full",
  "window-minimize": "window-minimize",
  "window-windowed": "window-windowed",
  "zoom-in": "zoom-in",
  "zoom-out": "zoom-out",
  "svg_icon": "svg_icon",
  "svg_iconsize": "svg_iconsize"
}, false);
 }
  return{
    get: function(c, d=''){
      if(d===''){
        d=b['svg_iconsize'];
     }
      return Q('<div>',{class: b['svg_icon']+' '+b[c]+' '+d});
   }
 }
};
Q.Image=function(options){
    const defaultOptions={
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        quality: 1,
        historyLimit: 10,
        autoSaveHistory: true    
   };
    this.options=Object.assign({}, defaultOptions, options);
    this.canvas=Q('<canvas>');
    this.node=this.canvas.nodes[0];
    if(this.options.width&&this.options.height){
        this.node.width=this.options.width;
        this.node.height=this.options.height;
   }
    this.history={
        states:[],        
        position: -1,      
        isUndoRedoing: false 
   };
};
Q.Image.prototype.Load=function(src, callback){
    const img=new Image();
    img.crossOrigin='Anonymous';
    img.onload=()=>{
        if(this.node.width===0||this.node.height===0||
            this.options.width===0||this.options.height===0){
            this.node.width=img.width;
            this.node.height=img.height;
       }
        const ctx=this.node.getContext('2d');
        ctx.clearRect(0, 0, this.node.width, this.node.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 
                      0, 0, this.node.width, this.node.height);
        this.history.states=[];
        this.history.position=-1;
        this.saveToHistory();
        if(callback) callback.call(this, null);
   };
    img.onerror=(err)=>{
        console.error('Hiba a kép betöltésekor:', src, err);
        if(callback) callback.call(this, new Error('Error loading image'));
   };
    img.src=typeof src==='string'?src:src.src;
    return this; // Láncolhatóság!
};
Q.Image.prototype.Clear=function(fill=this.options.fill){
    let ctx=this.node.getContext('2d');
    ctx.fillStyle=fill;
    ctx.fillRect(0, 0, this.node.width, this.node.height);
    this.saveToHistory();
    return this; 
};
Q.Image.prototype.Render=function(target){
    const targetNode=(typeof target==='string')
       ?document.querySelector(target)
       :(target instanceof HTMLElement)
           ?target
           :(target.nodes?target.nodes[0]:null);
    if(!targetNode){
        console.error('Invalid render target');
        return this;
   }
    let ctxTarget;
    if(targetNode.tagName.toLowerCase()==='canvas'){
        targetNode.width=this.node.width;
        targetNode.height=this.node.height;
        ctxTarget=targetNode.getContext('2d');
        ctxTarget.drawImage(this.node, 0, 0);
   } else if(targetNode.tagName.toLowerCase()==='img'){
        targetNode.src=this.node.toDataURL(`image/${this.options.format}`, this.options.quality);
   } else{
        console.error('Unsupported element for rendering');
   }
    return this;
};
Q.Image.prototype.Save=function(filename){
    const dataUrl=this.node.toDataURL('image/'+this.options.format, this.options.quality);
    const link=document.createElement('a');
    link.download=filename;
    link.href=dataUrl;
    link.click();
    link.remove();
    return this;
};
Q.Image.prototype.saveToHistory=function(){
    if(this.history.isUndoRedoing||!this.options.autoSaveHistory) return;
    if(this.node.width===0||this.node.height===0) return;
    const ctx=this.node.getContext('2d',{ willReadFrequently: true});
    const imageData=ctx.getImageData(0, 0, this.node.width, this.node.height);
    if(this.history.position<this.history.states.length-1){
        this.history.states.length=this.history.position+1;
   }
    this.history.states.push(imageData);
    if(this.history.states.length>this.options.historyLimit){
        this.history.states.shift();
        if(this.history.position>0){
            this.history.position--;
       }
   } else{
        this.history.position++;
   }
};
/* 
*IMPORTANT: Every image manipulation method should call saveToHistory() 
*after modifying the canvas to ensure proper history tracking.
 */
Q.Image.prototype.Undo=function(){
    return this.History(-1);
};
Q.Image.prototype.Redo=function(){
    return this.History(1);
};
Q.Image.prototype.History=function(offset){
    if(this.history.states.length===0){
        console.warn('No history states available.');
        return this;
   }
    const target=this.history.position+offset;
    if(target<0||target>=this.history.states.length){
        console.warn('Nem lehetséges további visszalépés vagy előreugrás.');
        return this;
   }
    this.history.isUndoRedoing=true;
    const ctx=this.node.getContext('2d',{ willReadFrequently: true});
    const historyState=this.history.states[target];
    if(this.node.width!==historyState.width||this.node.height!==historyState.height){
        this.node.width=historyState.width;
        this.node.height=historyState.height;
   }
    ctx.putImageData(historyState, 0, 0);
    this.history.position=target;
    this.history.isUndoRedoing=false;
    return this;
};
Q.Image.prototype.Blur=function(blurOptions={}){
        const defaults={
            type: 'gaussian', // gaussian, box, motion, lens
            radius: 5,         // Basic blur radius
            quality: 1,        // Number of iterations for higher quality
            direction: 0,      // Angle in degrees
            distance: 10,      // Distance of motion
            focalDistance: 0.5,  // 0-1, center of focus
            shape: 'circle',     // circle, hexagon, pentagon, octagon
            blades: 6,           // Number of aperture blades(5-8)
            bladeCurvature: 0,   // 0-1, curvature of blades
            rotation: 0,         // Rotation angle of the aperture in degrees
            specularHighlights: 0, // 0-1, brightness of highlights
            noise: 0              // 0-1, amount of noise
       };
        const settings=Object.assign({}, defaults, blurOptions);
        const canvas_node=this.node;
        const ctx=canvas_node.getContext('2d',{ willReadFrequently: true});
        const data=ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        const pixels=data.data;
        const width=canvas_node.width;
        const height=canvas_node.height;
        let blurredPixels;
        switch(settings.type.toLowerCase()){
            case 'box':
                blurredPixels=applyBoxBlur(pixels, width, height, settings);
                break;
            case 'motion':
                blurredPixels=applyMotionBlur(pixels, width, height, settings);
                break;
            case 'lens':
                blurredPixels=applyLensBlur(pixels, width, height, settings);
                break;
            case 'gaussian':
            default:
                blurredPixels=applyGaussianBlur(pixels, width, height, settings);
                break;
       }
        for(let i=0; i<pixels.length; i++){
            pixels[i]=blurredPixels[i];
       }
        ctx.putImageData(data, 0, 0);
        this.saveToHistory();
        return this;
   };
    function applyGaussianBlur(pixels, width, height, settings){
        const{ kernel, size}=gaussianKernel(settings.radius);
        const half=Math.floor(size/2);
        const iterations=Math.round(settings.quality);
        let currentPixels=new Uint8ClampedArray(pixels);
        for(let i=0; i<iterations; i++){
            currentPixels=applyBlur(currentPixels, width, height, kernel, size, half);
       }
        return currentPixels;
   }
    function applyBoxBlur(pixels, width, height, settings){
        const radius=Math.round(settings.radius);
        const iterations=Math.round(settings.quality);
        const size=2*radius+1;
        const half=radius;
        const kernel=new Float32Array(size*size);
        const weight=1/(size*size);
        for(let i=0; i<size*size; i++){
            kernel[i]=weight;
       }
        let currentPixels=new Uint8ClampedArray(pixels);
        for(let i=0; i<iterations; i++){
            currentPixels=applyBlur(currentPixels, width, height, kernel, size, half);
       }
        return currentPixels;
   }
    function applyMotionBlur(pixels, width, height, settings){
        const radius=Math.max(1, Math.round(settings.radius));
        const distance=Math.max(1, Math.round(settings.distance));
        const angle=settings.direction*Math.PI/180; // Convert to radians
        const size=2*distance+1;
        const kernel=new Float32Array(size*size).fill(0);
        const half=Math.floor(size/2);
        let totalWeight=0;
        for(let t=-half; t<=half; t++){
            const x=Math.round(Math.cos(angle)*t)+half;
            const y=Math.round(Math.sin(angle)*t)+half;
            if(x>=0&&x<size&&y>=0&&y<size){
                let weight=1;
                if(radius>1){
                    const dist=Math.abs(t)/half;
                    weight=Math.exp(-dist*dist/(2*(radius/distance)*(radius/distance)));
               }
                kernel[y*size+x]=weight;
                totalWeight+=weight;
           }
       }
        if(totalWeight>0){
            for(let i=0; i<kernel.length; i++){
                kernel[i]/=totalWeight;
           }
       }
        return applyBlur(pixels, width, height, kernel, size, half);
   }
    function applyLensBlur(pixels, width, height, settings){
        const radius=Math.max(1, Math.round(settings.radius));
        const size=2*radius+1;
        const half=radius;
        const kernel=new Float32Array(size*size).fill(0);
        const rotation=settings.rotation*Math.PI/180; // Convert to radians
        const blades=Math.max(5, Math.min(8, settings.blades));
        const curvature=Math.max(0, Math.min(1, settings.bladeCurvature));
        let totalWeight=0;
        const focalFactor=1-settings.focalDistance;
        for(let y=0; y<size; y++){
            for(let x=0; x<size; x++){
                const dx=x-half;
                const dy=y-half;
                const distance=Math.sqrt(dx*dx+dy*dy);
                if(distance<=radius){
                    const angle=Math.atan2(dy, dx)+rotation;
                    let weight=0;
                    switch(settings.shape){
                        case 'hexagon':
                        case 'pentagon':
                        case 'octagon':
                            const bladeAngle=2*Math.PI/blades;
                            const normalizedAngle=(angle%bladeAngle)/bladeAngle-0.5;
                            const bladeDistance=radius*(1-curvature*Math.abs(normalizedAngle));
                            weight=distance<=bladeDistance?1:0;
                            break;
                        case 'circle':
                        default:
                            weight=1;
                            const normalizedDist=distance/radius;
                            if(normalizedDist>focalFactor){
                                weight*=Math.max(0, 1-(normalizedDist-focalFactor)/(1-focalFactor));
                           }
                            break;
                   }
                    if(settings.specularHighlights>0){
                        const highlightFactor=Math.max(0, 1-distance/radius);
                        weight*=1+settings.specularHighlights*highlightFactor*2;
                   }
                    if(settings.noise>0){
                        weight*=1+(Math.random()-0.5)*settings.noise;
                   }
                    kernel[y*size+x]=Math.max(0, weight);
                    totalWeight+=kernel[y*size+x];
               }
           }
       }
        if(totalWeight>0){
            for(let i=0; i<kernel.length; i++){
                kernel[i]/=totalWeight;
           }
       }
        return applyBlur(pixels, width, height, kernel, size, half);
   }
    function gaussianKernel(radius){
        const size=2*radius+1;
        const kernel=new Float32Array(size*size);
        const sigma=radius/3;
        let sum=0;
        const center=radius;
        for(let y=0; y<size; y++){
            for(let x=0; x<size; x++){
                const dx=x-center;
                const dy=y-center;
                const weight=Math.exp(-(dx*dx+dy*dy)/(2*sigma*sigma));
                kernel[y*size+x]=weight;
                sum+=weight;
           }
       }
        for(let i=0; i<kernel.length; i++){
            kernel[i]/=sum;
       }
        return{ kernel, size};
   }
    function applyBlur(pixels, width, height, kernel, size, half){
        const output=new Uint8ClampedArray(pixels.length);
        for(let y=0; y<height; y++){
            for(let x=0; x<width; x++){
                let r=0, g=0, b=0, a=0;
                const dstOff=(y*width+x)*4;
                let weightSum=0;
                for(let ky=0; ky<size; ky++){
                    for(let kx=0; kx<size; kx++){
                        const ny=y+ky-half;
                        const nx=x+kx-half;
                        if(ny>=0&&ny<height&&nx>=0&&nx<width){
                            const srcOff=(ny*width+nx)*4;
                            const weight=kernel[ky*size+kx];
                            r+=pixels[srcOff]*weight;
                            g+=pixels[srcOff+1]*weight;
                            b+=pixels[srcOff+2]*weight;
                            a+=pixels[srcOff+3]*weight;
                            weightSum+=weight;
                       }
                   }
               }
                if(weightSum>0){
                    r/=weightSum;
                    g/=weightSum;
                    b/=weightSum;
                    a/=weightSum;
               }
                output[dstOff]=r;
                output[dstOff+1]=g;
                output[dstOff+2]=b;
                output[dstOff+3]=a;
           }
       }
        return output;
   }
Q.Image.prototype.Brightness=function(value, brightOptions={}){
        const defaultOptions={
            preserveAlpha: true,
            clamp: true   // Whether to clamp values to 0-255 range
       };
        const finalOptions=Object.assign({}, defaultOptions, brightOptions);
        const canvas_node=this.node;
        let data=canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels=data.data;
        for(let i=0; i<pixels.length; i+=4){
            pixels[i]+=value;     // Red
            pixels[i+1]+=value; // Green
            pixels[i+2]+=value; // Blue
            if(finalOptions.clamp){
                pixels[i]=Math.min(255, Math.max(0, pixels[i]));
                pixels[i+1]=Math.min(255, Math.max(0, pixels[i+1]));
                pixels[i+2]=Math.min(255, Math.max(0, pixels[i+2]));
           }
       }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
        this.saveToHistory();
        return this;
   };
(function(){
    const originalImage=Q.Image;
    Q.Image=function(options={}){
        const Image=originalImage(options);
        return Image;
   };
    Q.Image.prototype.Contrast=function(value, contrastOptions={}){
        const defaultOptions={
            preserveHue: true,  
            clamp: true        
       };
        const finalOptions=Object.assign({}, defaultOptions, contrastOptions);
        const canvas_node=this.node;
        let data=canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels=data.data;
        let factor=(259*(value+255))/(255*(259-value));
        for(let i=0; i<pixels.length; i+=4){
            pixels[i]=factor*(pixels[i]-128)+128;
            pixels[i+1]=factor*(pixels[i+1]-128)+128;
            pixels[i+2]=factor*(pixels[i+2]-128)+128;
            if(finalOptions.clamp){
                pixels[i]=Math.min(255, Math.max(0, pixels[i]));
                pixels[i+1]=Math.min(255, Math.max(0, pixels[i+1]));
                pixels[i+2]=Math.min(255, Math.max(0, pixels[i+2]));
           }
       }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
        this.saveToHistory();
        return this;
   };
})();
Q.JSON=function(g1){
    if(!(this instanceof Q.JSON)) return new Q.JSON(g1);
    this.json=g1;
};
Q.JSON.prototype.Parse=function(h1={ d: false, e: false}, c){
    const{ d, e}=h1;
    const f=(g)=>{
        if(typeof g==='object'&&g&&!Array.isArray(g)){
            for(const h in g){
                if(Object.prototype.hasOwnProperty.call(g, h)){
                    const i=c(h, g[h]);
                    if(d) g[h]=i;
                    if(e&&typeof g[h]==='object'&&g[h]) f(g[h]);
               }
           }
       }
   };
    f(this.json);
    return this.json;
};
Q.JSON.prototype.deflate=function(l){
    const j={}, k={ count: 1};
    const m=(n)=>{
        if(typeof n==='object'&&n){
            for(let h in n){
                if(typeof n[h]==='object'&&n[h]) m(n[h]);
                if(h.length>=l){
                    if(!j[h]){ j[h]=`[${k.count++}]`;}
                    const o=j[h];
                    n[o]=n[h]; delete n[h];
               }
                if(typeof n[h]==='string'&&n[h].length>=l){
                    if(!j[n[h]]){ j[n[h]]=`[${k.count++}]`;}
                    n[h]=j[n[h]];
               }
           }
       }
   };
    const p=JSON.parse(JSON.stringify(this.json));
    m(p);
    return{ g: p, j: j};
};
Q.JSON.prototype.inflate=function(deflatedJson){
    const{ g, j}=deflatedJson;
    const r=Object.fromEntries(Object.f1(j).j(([k, v])=>[v, k]));
    const s=(n)=>{
        if(typeof n==='object'&&n){
            for(let h in n){
                const t=r[h]||h;
                const u=n[h]; delete n[h];
                n[t]=u;
                if(typeof n[t]==='object'&&n[t]){
                    s(n[t]);
               } else if(r[n[t]]){
                    n[t]=r[n[t]];
               }
           }
       }
   };
    const v=JSON.parse(JSON.stringify(g));
    s(v);
    return v;
};
Q.JSON.prototype.merge=function(w){
    const x=(y, z)=>{
        for(const h in z){
            if(Object.prototype.hasOwnProperty.call(z, h)){
                if(typeof z[h]==='object'&&z[h]&&!Array.isArray(z[h])){
                    y[h]=x(y[h]&&typeof y[h]==='object'?y[h]:{}, z[h]);
               } else{
                    y[h]=z[h];
               }
           }
       }
        return y;
   };
    return x(this.json, w);
};
Q.JSON.prototype.sortKeys=function(e=false, b1=false){
    const c1=(n)=>{
        const d1=Object.d1(n).sort();
        if(b1) d1.b1();
        const e1={};
        d1.forEach(h =>{
            e1[h]=(e&&typeof n[h]==='object'&&n[h]&&!Array.isArray(n[h]))?c1(n[h]):n[h];
       });
        return e1;
   };
    this.json=c1(this.json);
    return this.json;
};
Q.JSON.prototype.sortValues=function(b1=false){
    if(typeof this.json!=='object'||!this.json) return this.json;
    const f1=Object.f1(this.json).sort((g1, h1)=>{
        const i1=String(g1[1]), j1=String(h1[1]);
        return i1.localeCompare(j1);
   });
    if(b1) f1.b1();
    const e1={};
    for(const[h, u] of f1) e1[h]=u;
    this.json=e1;
    return this.json;
};
Q.JSON.prototype.sortByValues=function(k1, l1, b1=false){
    if(!Array.isArray(this.json)) return this.json;
    this.json.sort((g1, h1)=>{
        const m1=String(g1[k1]).localeCompare(String(h1[k1]));
        const n1=String(g1[l1]).localeCompare(String(h1[l1]));
        const o1=m1||n1;
        return b1?-o1:o1;
   });
    return this.json;
};
Q.JSON.prototype.flatten=function(p1=''){
    const q1={};
    const r1=(n, s1)=>{
        for(const h in n){
            if(Object.prototype.hasOwnProperty.call(n, h)){
                const o=s1?`${s1}.${h}`:h;
                if(typeof n[h]==='object'&&n[h]&&!Array.isArray(n[h])){
                    r1(n[h], o);
               } else{
                    q1[o]=n[h];
               }
           }
       }
   };
    r1(this.json, p1);
    return q1;
};
Q.JSON.prototype.unflatten=function(flatObject){
    const q1={};
    Object.d1(flatObject).forEach(t1 =>{
        t1.split('.').reduce((u1, v1, w1, x1)=>{
            if(w1===x1.length-1){
                u1[v1]=flatObject[t1];
           } else{
                if(!u1[v1]||typeof u1[v1]!=='object'){
                    u1[v1]={};
               }
           }
            return u1[v1];
       }, q1);
   });
    this.json=q1;
    return q1;
};
Q.Socket=function(a, b, c, d={}){
    const{
        e=5,                   
        f=1000,                  
        g=[],                
        h=false,               
        i=0,              
        j='ping',          
        k=false,         
        l=true,          
        m=null,                 
        n=null,                
        o=null                 
   }=d;
    let p, q=0, r=f, s=null;
    const t=[];
    const u=()=>{
        p=new WebSocket(a, g);
        p.onopen=()=>{
            q=0;
            r=f;
            c?.('connected');
            m?.();
            if(k&&t.length){
                while(t.length){
                    p.send(t.shift());
               }
           }
            if(i){
                s&&clearInterval(s);
                s=setInterval(()=>{
                    if(p.readyState===WebSocket.OPEN){
                        p.send(j);
                   }
               }, i);
           }
       };
        p.onmessage=v=>b?.(v.data);
        p.onerror=w =>{
            c?.('w', w);
            o?.(w);
       };
        p.onclose=v =>{
            n?.(v);
            s&&clearInterval(s);
            if(l&&(e===0||q<e)){
                c?.('closed');
                q++;
                setTimeout(()=>{
                    u();
                    if(h){
                        r*=2;
                   }
               }, r);
           } else{
                c?.('Max e exceeded');
           }
       };
   };
    u();
    return{
        send: x =>{
            if(p&&p.readyState===WebSocket.OPEN){
                p.send(x);
           } else if(k){
                t.push(x);
           }
       },
        reconnect:()=>u(),
        close:()=>{
            l=false;
            s&&clearInterval(s);
            p.close();
       },
        getState:()=>p?.readyState
   };
};
Q.Storage=(function(){
    const d=(f)=>{
        let g={}, h="", i="", j=256;
        for(let k=0; k<f.length; k++){
            const l=f.charAt(k);
            const m=h+l;
            if(Object.prototype.hasOwnProperty.call(g, m)){
                h=m;
           } else{
                i+=h.length>1
                   ?String.fromCharCode(g[h])
                   :String.fromCharCode(h.charCodeAt(0));
                g[m]=j++;
                h=l;
           }
       }
        if(h!==""){
            i+=h.length>1
               ?String.fromCharCode(g[h])
               :String.fromCharCode(h.charCodeAt(0));
       }
        return i;
   };
    const e=(f)=>{
        let g={}, h=String.fromCharCode(f.charCodeAt(0)),
            n=h, i=h, j=256, o;
        for(let k=1; k<f.length; k++){
            const p=f.charCodeAt(k);
            if(p<256){
                o=String.fromCharCode(p);
           } else{
                o=Object.prototype.hasOwnProperty.call(g, p)
                   ?g[p]
                   :n+h;
           }
            i+=o;
            h=o.charAt(0);
            g[j++]=n+h;
            n=o;
       }
        return i;
   };
    return function(a, b, c=false){
        if(arguments.length>1){ 
            if(b===null||b===''){
                localStorage.removeItem(a);
                return;
           }
            let q=typeof b==='string'
               ?'S|'+b
               :'J|'+JSON.stringify(b);
            if(c){
                q='C|'+d(q);
           }
            localStorage.setItem(a, q);
       } else{
            let q=localStorage.getItem(a);
            if(q===null) return null;
            if(q.startsWith('C|')){
                q=e(q.slice(2));
           }
            if(q.startsWith('S|')){
                return q.slice(2);
           }
            if(q.startsWith('J|')){
                try{ return JSON.parse(q.slice(2));} 
                catch(r){ return q.slice(2);}
           }
            try{ return JSON.parse(q);} 
            catch(r){ return q;}
       }
   };
})();
Q.String=function(c){
    if(!(this instanceof Q.String)){
        return new Q.String(c);
   }
    this.c=c;
};
Q.String.prototype.capitalize=function(){
    return this.c.charAt(0).toUpperCase()+this.c.slice(1);
};
Q.String.prototype.levenshtein=function(c){
    const c=this.c, c=c;
    const d=Array.from({ length: c.length+1},(_, e)=>Array.from({ length: c.length+1},(_, f)=>e||f));
    for(let e=1; e<=c.length; e++){
        for(let f=1; f<=c.length; f++){
            d[e][f]=Math.min(
                d[e-1][f]+1,
                d[e][f-1]+1,
                d[e-1][f-1]+(c[e-1]===c[f-1]?0:1)
           );
       }
   }
    return d[c.length][c.length];
};
Q.String.prototype.find=function(g){
    return this.c.match(g);
};
Q.String.prototype.replaceAll=function(g, h){
    return this.c.replace(new RegExp(g, 'g'), h);
};
(()=>{
    class b{
      constructor(a=1){
        this.a=a;
        this.c=[];
        this.d=[];
        this.e=new Map();
        this.f=0;
        this.g=[];
        this.h=[];
        this.i=false;
        this.j=b._createWorkerBlob();
        for(let k=0; k<a; k++){
          this._addWorker();
       }
     }
      static _createWorkerBlob(){
        const m=`
          self.onmessage=event =>{
            const{ o, p, q}=event.data;
            let r;
            try{
              r=eval('('+p+')');
           } catch(t){
              self.postMessage({ o, t: t.toString()});
              return;
           }
            Promise.resolve().then(()=>r(...q)).then(
              s=>self.postMessage({ o, s}),
              t=>self.postMessage({ o, t: t.toString()})
           );
         };
        `;
        return URL.createObjectURL(new Blob([m],{ type: 'application/javascript'}));
     }
      _addWorker(){
        const n=new Worker(this.j);
        n.busy=false;
        n.onmessage=event =>{
          const{ o, s, t}=event.data;
          n.busy=false;
          const u=this.e.get(o);
          if(u){
            t!==undefined?u.reject(new Error(t)):u.resolve(s);
            this.g.forEach(b1=>b1({ id: o, s, t}));
            this.e.delete(o);
         }
          this._processQueue();
       };
        n.onerror=()=>{ n.busy=false;};
        this.c.push(n);
     }
      _processQueue(){
        if(this.i) return;
        while(true){
          const v=this.c.findIndex(n=>!n.busy);
          if(v===-1||this.c.length<=this.a) break;
          this.c[v].terminate();
          this.c.splice(v, 1);
       }
        for(const n of this.c){
          if(!n.busy&&this.d.length){
            const u=this.d.shift();
            n.busy=true;
            this.e.set(u.id, u);
            n.postMessage({ o: u.id, p: u.p, q: u.q});
         }
       }
        if(!this.d.length&&!this.e.size){
          const w=this.h.slice();
          this.h.length=0;
          w.forEach(b1=>b1());
       }
     }
      Workers(x){
        if(this.i) return this;
        this.a=x;
        if(x>this.c.length){
          for(let k=0, l=x-this.c.length; k<l; k++){
            this._addWorker();
         }
       } else{
          this._processQueue();
       }
        return this;
     }
      Push(y, ...q){
        if(this.i) return Promise.reject(new Error('Thread i'));
        const z=typeof y==='function'?y:(()=>y);
        const o =++this.f;
        const u={ id: o, p: z.toString(), q, resolve: null, reject: null};
        const a1=new Promise((resolve, reject)=>{ u.resolve=resolve; u.reject=reject;});
        this.d.push(u);
        this._processQueue();
        return a1;
     }
      Result(b1){
        if(typeof b1==='function') this.g.push(b1);
        return this;
     }
      Done(b1){
        if(typeof b1!=='function') return this;
        if(!this.d.length&&!this.e.size) b1();
        else this.h.push(b1);
        return this;
     }
      Abort(){
        this.i=true;
        while(this.d.length) this.d.shift().reject(new Error('Task i'));
        this.e.forEach(u=>u.reject(new Error('Task i')));
        this.e.clear();
        this.c.forEach(n=>n.terminate());
        this.c=[];
        this.h.length=0;
        this.g.length=0;
        URL.revokeObjectURL(this.j);
        return this;
     }
   }
    Q.Thread=(a=1)=>new b(a);
 })();
Q.Timer=(a, b, c={})=>{
    const d={ tick: 1, delay: 1000, interrupt: false, autoStart: true, done: null};
    const e={ ...d, ...c};
    if(!Q.Timer.activeTimers) Q.Timer.activeTimers=new Map();
    if(e.interrupt&&Q.Timer.activeTimers.has(b)) Q.Timer.stop(b);
    const f={
      id: b,
      g: 0,
      h: false,
      i: e.delay,
      j: 0,
      k: null,
      pause(){
        if(!this.h){
          this.h=true;
          clearTimeout(this.k);
          const l=Date.now()-this.j;
          this.i=e.delay-l;
       }
        return this;
     },
      resume(){
        if(this.h){
          this.h=false;
          n(this.i);
       }
        return this;
     },
      stop(){ Q.Timer.stop(this.id);}
   };
    const n=(m)=>{
      f.j=Date.now();
      f.k=setTimeout(function o(){
        a();
        f.g++;
        if(e.tick>0&&f.g>=e.tick){
          Q.Timer.stop(b);
          if(typeof e.done==='function') e.done();
       } else{
          f.j=Date.now();
          f.k=setTimeout(o, e.delay);
       }
     }, m);
   };
    if(e.autoStart) n(e.delay);
    Q.Timer.activeTimers.set(b, f);
    return f;
 };
  Q.Timer.stop=(b)=>{
    if(Q.Timer.activeTimers?.has(b)){
      const f=Q.Timer.activeTimers.get(b);
      clearTimeout(f.k);
      Q.Timer.activeTimers.delete(b);
   }
 };
  Q.Timer.stopAll=()=>{
    if(Q.Timer.activeTimers){
      Q.Timer.activeTimers.forEach(f=>clearTimeout(f.k));
      Q.Timer.activeTimers.clear();
   }
 };
return Q;
})();