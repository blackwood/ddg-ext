parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"FO+Z":[function(require,module,exports) {
"use strict";function r(r,o){return t(r)||n(r,o)||e()}function e(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function n(r,e){var n=[],t=!0,o=!1,a=void 0;try{for(var i,u=r[Symbol.iterator]();!(t=(i=u.next()).done)&&(n.push(i.value),!e||n.length!==e);t=!0);}catch(c){o=!0,a=c}finally{try{t||null==u.return||u.return()}finally{if(o)throw a}}return n}function t(r){if(Array.isArray(r))return r}Object.defineProperty(exports,"__esModule",{value:!0}),exports.getActiveTabDomain=l,exports.default=exports.xor=exports.noop=exports.getHostname=exports.makeLogger=void 0;var o=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=function(){for(var n=arguments.length,t=new Array(n),o=0;o<n;o++)t[o]=arguments[o];return console.log.apply(void 0,[[r,e].join("-")].concat(t))},t=function(){for(var r=arguments.length,e=new Array(r),t=0;t<r;t++)e[t]=arguments[t];return n("Error: ",e)};return{log:n,err:t,onError:function(r){return t(r)}}},a=o.bind(void 0,"DDG");exports.makeLogger=a;var i=a("UTL"),u=function(){var r=document.createElement("a");return function(e){return r.href=e,r.hostname}},c=u();exports.getHostname=c;var s=function(){};exports.noop=s;var f=function(r,e){var n=r.slice(0),t=n.indexOf(e);return t>=0?(n.splice(t,1),n):n.concat([e])};function l(){return new Promise(function(e){browser.tabs.query({active:!0,currentWindow:!0,windowType:"normal"},function(n){var t=r(n.map(function(r){return r.url}),1)[0];e(c(t))})})}exports.xor=f;var v={xor:f,noop:s,makeLogger:a,getHostname:c,getActiveTabDomain:l};exports.default=v;
},{}],"omYY":[function(require,module,exports) {
"use strict";var e=require("./utils"),t=(0,e.makeLogger)("OPT"),r=t.onError;function o(e){e.preventDefault(),browser.storage.sync.set({userblocklist:document.querySelector("#user-blocklist").value}).then(function(){browser.storage.sync.set({blocked:{}}).then(function(){browser.runtime.reload()})})}function n(){browser.storage.sync.get("userblocklist").then(function(e){document.querySelector("#user-blocklist").value=e.userblocklist||""},r)}document.addEventListener("DOMContentLoaded",n),document.querySelector("form").addEventListener("submit",o);
},{"./utils":"FO+Z"}]},{},["omYY"], null)
//# sourceMappingURL=options.4178d501.map