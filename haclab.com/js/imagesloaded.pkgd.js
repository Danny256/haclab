/*!
* imagesLoaded PACKAGED v3.0.2
* JavaScript is all like "You images are done yet or what?"
*//*!
* EventEmitter v4.1.0 - git.io/ee
* Oliver Caldwell
* MIT license
* @preserve
*/(function(exports){'use strict';function EventEmitter(){}
var proto=EventEmitter.prototype,nativeIndexOf=Array.prototype.indexOf?true:false;function indexOfListener(listener,listeners){if(nativeIndexOf){return listeners.indexOf(listener);}
var i=listeners.length;while(i--){if(listeners[i]===listener){return i;}}
return-1;}
proto._getEvents=function(){return this._events||(this._events={});};proto.getListeners=function(evt){var events=this._getEvents(),response,key;if(typeof evt==='object'){response={};for(key in events){if(events.hasOwnProperty(key)&&evt.test(key)){response[key]=events[key];}}}
else{response=events[evt]||(events[evt]=[]);}
return response;};proto.getListenersAsObject=function(evt){var listeners=this.getListeners(evt),response;if(listeners instanceof Array){response={};response[evt]=listeners;}
return response||listeners;};proto.addListener=function(evt,listener){var listeners=this.getListenersAsObject(evt),key;for(key in listeners){if(listeners.hasOwnProperty(key)&&indexOfListener(listener,listeners[key])===-1){listeners[key].push(listener);}}
return this;};proto.on=proto.addListener;proto.defineEvent=function(evt){this.getListeners(evt);return this;};proto.defineEvents=function(evts)
{for(var i=0;i<evts.length;i+=1){this.defineEvent(evts[i]);}
return this;};proto.removeListener=function(evt,listener){var listeners=this.getListenersAsObject(evt),index,key;for(key in listeners){if(listeners.hasOwnProperty(key)){index=indexOfListener(listener,listeners[key]);if(index!==-1){listeners[key].splice(index,1);}}}
return this;};proto.off=proto.removeListener;proto.addListeners=function(evt,listeners){return this.manipulateListeners(false,evt,listeners);};proto.removeListeners=function(evt,listeners){return this.manipulateListeners(true,evt,listeners);};proto.manipulateListeners=function(remove,evt,listeners){var i,value,single=remove?this.removeListener:this.addListener,multiple=remove?this.removeListeners:this.addListeners;if(typeof evt==='object'&&!(evt instanceof RegExp)){for(i in evt){if(evt.hasOwnProperty(i)&&(value=evt[i])){if(typeof value==='function'){single.call(this,i,value);}
else{multiple.call(this,i,value);}}}}
else{i=listeners.length;while(i--){single.call(this,evt,listeners[i]);}}
return this;};proto.removeEvent=function(evt){var type=typeof evt,events=this._getEvents(),key;if(type==='string'){delete events[evt];}
else if(type==='object'){for(key in events){if(events.hasOwnProperty(key)&&evt.test(key)){delete events[key];}}}
else{delete this._events;}
return this;};proto.emitEvent=function(evt,args){var listeners=this.getListenersAsObject(evt),i,key,response;for(key in listeners){if(listeners.hasOwnProperty(key)){i=listeners[key].length;while(i--){response=args?listeners[key][i].apply(null,args):listeners[key][i]();if(response===true){this.removeListener(evt,listeners[key][i]);}}}}
return this;};proto.trigger=proto.emitEvent;proto.emit=function(evt){var args=Array.prototype.slice.call(arguments,1);return this.emitEvent(evt,args);};if(typeof define==='function'&&define.amd){define(function(){return EventEmitter;});}
else{exports.EventEmitter=EventEmitter;}}(this));/*!
* eventie v1.0.3
* event binding helper
* eventie.bind( elem, 'click', myFn )
* eventie.unbind( elem, 'click', myFn )
*/(function(window){'use strict';var docElem=document.documentElement;var bind=function(){};if(docElem.addEventListener){bind=function(obj,type,fn){obj.addEventListener(type,fn,false);};}else if(docElem.attachEvent){bind=function(obj,type,fn){obj[type+fn]=fn.handleEvent?function(){var event=window.event;event.target=event.target||event.srcElement;fn.handleEvent.call(fn,event);}:function(){var event=window.event;event.target=event.target||event.srcElement;fn.call(obj,event);};obj.attachEvent("on"+type,obj[type+fn]);};}
var unbind=function(){};if(docElem.removeEventListener){unbind=function(obj,type,fn){obj.removeEventListener(type,fn,false);};}else if(docElem.detachEvent){unbind=function(obj,type,fn){obj.detachEvent("on"+type,obj[type+fn]);try{delete obj[type+fn];}catch(err){obj[type+fn]=undefined;}};}
var eventie={bind:bind,unbind:unbind};if(typeof define==='function'&&define.amd){define(eventie);}else{window.eventie=eventie;}})(this);/*!
* imagesLoaded v3.0.2
* JavaScript is all like "You images are done yet or what?"
*/(function(window){'use strict';var $=window.jQuery;var console=window.console;var hasConsole=typeof console!=='undefined';function extend(a,b){for(var prop in b){a[prop]=b[prop];}
return a;}
var objToString=Object.prototype.toString;function isArray(obj){return objToString.call(obj)==='[object Array]';}
function makeArray(obj){var ary=[];if(isArray(obj)){ary=obj;}else if(typeof obj.length==='number'){for(var i=0,len=obj.length;i<len;i++){ary.push(obj[i]);}}else{ary.push(obj);}
return ary;}
function defineImagesLoaded(EventEmitter,eventie){function ImagesLoaded(elem,options,onAlways){if(!(this instanceof ImagesLoaded)){return new ImagesLoaded(elem,options);}
if(typeof elem==='string'){elem=document.querySelectorAll(elem);}
this.elements=makeArray(elem);this.options=extend({},this.options);if(typeof options==='function'){onAlways=options;}else{extend(this.options,options);}
if(onAlways){this.on('always',onAlways);}
this.getImages();if($){this.jqDeferred=new $.Deferred();}
var _this=this;setTimeout(function(){_this.check();});}
ImagesLoaded.prototype=new EventEmitter();ImagesLoaded.prototype.options={};ImagesLoaded.prototype.getImages=function(){this.images=[];for(var i=0,len=this.elements.length;i<len;i++){var elem=this.elements[i];if(elem.nodeName==='IMG'){this.addImage(elem);}
var childElems=elem.querySelectorAll('img');for(var j=0,jLen=childElems.length;j<jLen;j++){var img=childElems[j];this.addImage(img);}}};ImagesLoaded.prototype.addImage=function(img){var loadingImage=new LoadingImage(img);this.images.push(loadingImage);};ImagesLoaded.prototype.check=function(){var _this=this;var checkedCount=0;var length=this.images.length;this.hasAnyBroken=false;if(!length){this.complete();return;}
function onConfirm(image,message){if(_this.options.debug&&hasConsole){console.log('confirm',image,message);}
_this.progress(image);checkedCount++;if(checkedCount===length){_this.complete();}
return true;}
for(var i=0;i<length;i++){var loadingImage=this.images[i];loadingImage.on('confirm',onConfirm);loadingImage.check();}};ImagesLoaded.prototype.progress=function(image){this.hasAnyBroken=this.hasAnyBroken||!image.isLoaded;this.emit('progress',this,image);if(this.jqDeferred){this.jqDeferred.notify(this,image);}};ImagesLoaded.prototype.complete=function(){var eventName=this.hasAnyBroken?'fail':'done';this.isComplete=true;this.emit(eventName,this);this.emit('always',this);if(this.jqDeferred){var jqMethod=this.hasAnyBroken?'reject':'resolve';this.jqDeferred[jqMethod](this);}};if($){$.fn.imagesLoaded=function(options,callback){var instance=new ImagesLoaded(this,options,callback);return instance.jqDeferred.promise($(this));};}
var cache={};function LoadingImage(img){this.img=img;}
LoadingImage.prototype=new EventEmitter();LoadingImage.prototype.check=function(){var cached=cache[this.img.src];if(cached){this.useCached(cached);return;}
cache[this.img.src]=this;if(this.img.complete&&this.img.naturalWidth!==undefined){this.confirm(this.img.naturalWidth!==0,'naturalWidth');return;}
var proxyImage=this.proxyImage=new Image();eventie.bind(proxyImage,'load',this);eventie.bind(proxyImage,'error',this);proxyImage.src=this.img.src;};LoadingImage.prototype.useCached=function(cached){if(cached.isConfirmed){this.confirm(cached.isLoaded,'cached was confirmed');}else{var _this=this;cached.on('confirm',function(image){_this.confirm(image.isLoaded,'cache emitted confirmed');return true;});}};LoadingImage.prototype.confirm=function(isLoaded,message){this.isConfirmed=true;this.isLoaded=isLoaded;this.emit('confirm',this,message);};LoadingImage.prototype.handleEvent=function(event){var method='on'+event.type;if(this[method]){this[method](event);}};LoadingImage.prototype.onload=function(){this.confirm(true,'onload');this.unbindProxyEvents();};LoadingImage.prototype.onerror=function(){this.confirm(false,'onerror');this.unbindProxyEvents();};LoadingImage.prototype.unbindProxyEvents=function(){eventie.unbind(this.proxyImage,'load',this);eventie.unbind(this.proxyImage,'error',this);};return ImagesLoaded;}
if(typeof define==='function'&&define.amd){define(['eventEmitter','eventie'],defineImagesLoaded);}else{window.imagesLoaded=defineImagesLoaded(window.EventEmitter,window.eventie);}})(window);