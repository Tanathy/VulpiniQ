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
return Q;
})();