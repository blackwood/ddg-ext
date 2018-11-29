// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveTabDomain = getActiveTabDomain;
exports.default = exports.xor = exports.noop = exports.getHostname = exports.makeLogger = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var makeExtensionLogger = function makeExtensionLogger() {
  var ext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var mod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var log = function log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return console.log.apply(undefined, [[ext, mod].join('-')].concat(args));
  };

  var err = function err() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return log("Error: ", args);
  };

  var onError = function onError(e) {
    return err(e);
  };

  return {
    log: log,
    err: err,
    onError: onError
  };
};

var makeLogger = makeExtensionLogger.bind(undefined, 'DDG');
exports.makeLogger = makeLogger;

var makeGetHostname = function makeGetHostname() {
  var parser = document.createElement('a');

  var getHostname = function getHostname(url) {
    parser.href = url;
    return parser.hostname;
  };

  return getHostname;
};

var getHostname = makeGetHostname();
exports.getHostname = getHostname;

var noop = function noop() {
  return undefined;
};

exports.noop = noop;

var xor = function xor(arr, val) {
  var arrClone = arr.slice(0);
  var index = arrClone.indexOf(val);

  if (index >= 0) {
    arrClone.splice(index, 1);
    return arrClone;
  }

  return arrClone.concat([val]);
};

exports.xor = xor;

function getActiveTabDomain() {
  return new Promise(function (resolve) {
    browser.tabs.query({
      active: true,
      currentWindow: true,
      windowType: 'normal'
    }, function (tabs) {
      var _tabs$map = tabs.map(function (tab) {
        return tab.url;
      }),
          _tabs$map2 = _slicedToArray(_tabs$map, 1),
          url = _tabs$map2[0];

      resolve(getHostname(url));
    });
  });
}

var util = {
  xor: xor,
  noop: noop,
  makeLogger: makeLogger,
  getHostname: getHostname,
  getActiveTabDomain: getActiveTabDomain
};
exports.default = util;
},{}],"popup.js":[function(require,module,exports) {
"use strict";

var _utils = require("./utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var log = (0, _utils.makeLogger)('POP');
var domainTitle = document.getElementById('domain');

var setDomainTitleHTML = function setDomainTitleHTML(domain) {
  domainTitle.innerHTML = domain;
};

var blockedlist = document.getElementById('blockedlist');
var initialList = blockedlist.innerHTML;

var setBlockedlistHTML = function setBlockedlistHTML(blocked, domain) {
  var list = blocked[domain] || [];

  if (list.length === 0) {
    blockedlist.innerHTML = initialList;
  } else {
    var blockedlistHTML = _toConsumableArray(new Set(blocked[domain])).map(function (hostname, i) {
      var classnames = i % 2 === 1 ? 'ph3 pv2' : 'ph3 pv2 stripe-dark';
      return "<li class=\"".concat(classnames, "\">").concat(hostname, "</li>");
    }).join('');

    blockedlist.innerHTML = blockedlistHTML;
  }
};

var disableButton = document.getElementById('disable');
var initialMessage = disableButton.value;

var setDisableButtonVal = function setDisableButtonVal(disabled, domain) {
  if (disabled.indexOf(domain) >= 0) {
    disableButton.value = "Re-enable blocking for ".concat(domain);
  } else {
    disableButton.value = initialMessage;
  }
};

disableButton.addEventListener('click', function (e) {
  e.preventDefault();
  (0, _utils.getActiveTabDomain)().then(function (domain) {
    browser.storage.sync.get().then(function (_ref) {
      var _ref$disabled = _ref.disabled,
          disabled = _ref$disabled === void 0 ? [] : _ref$disabled,
          _ref$blocked = _ref.blocked,
          blocked = _ref$blocked === void 0 ? {} : _ref$blocked;
      browser.storage.sync.set({
        disabled: (0, _utils.xor)(disabled, domain),
        blocked: _objectSpread({}, blocked, _defineProperty({}, domain, []))
      }).then(function () {
        browser.storage.sync.get().then(function (_ref2) {
          var _ref2$disabled = _ref2.disabled,
              disabled = _ref2$disabled === void 0 ? [] : _ref2$disabled,
              _ref2$blocked = _ref2.blocked,
              blocked = _ref2$blocked === void 0 ? {} : _ref2$blocked;
          setBlockedlistHTML(blocked, domain);
          setDisableButtonVal(disabled, domain);
          browser.tabs.reload().then(function () {});
        });
      });
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var setPopupHTML = function setPopupHTML() {
    (0, _utils.getActiveTabDomain)().then(function (domain) {
      browser.storage.sync.get().then(function (_ref3) {
        var _ref3$blocked = _ref3.blocked,
            blocked = _ref3$blocked === void 0 ? {} : _ref3$blocked,
            _ref3$disabled = _ref3.disabled,
            disabled = _ref3$disabled === void 0 ? [] : _ref3$disabled;
        setDomainTitleHTML(domain);
        setBlockedlistHTML(blocked, domain);
        setDisableButtonVal(disabled, domain);
        setTimeout(setPopupHTML, 1500);
      }).then(_utils.noop);
    });
  };

  setPopupHTML();
});
},{"./utils":"utils.js"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54666" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","popup.js"], null)
//# sourceMappingURL=popup.ba0889f8.map