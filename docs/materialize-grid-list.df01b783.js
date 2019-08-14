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
})({"node_modules/materialize-grid-list/js/materialize-grid-list.js":[function(require,module,exports) {
/*!
 * Material Grid List v1.0
 * Author Ephenodrom
 * Licensed under MIT
 */
(function($) {

    var settings;
    var cells = [];

    // Functions
    var methods = {
        // Define the render function
        render: function($elem, cells, columns) {
            // Print the cells
            var i = 1;
            var x = columns;
            $elem.removeClass(function(index, className) {
                return (className.match(/(^|\s)grid-list-\S+/g) || []).join(' ');
            });
            $elem.addClass("grid-list-" + x);
            var rank = 1;
            do {
                // Grab x elements from the array
                var begin = 0 + ((i - 1) * x);
                var end = i * x;
                var ar = cells.slice(begin, end);
                var modulo = i % 2;
		if($elem.data("sorting") == "monodirectional"){
		    modulo = 1;
		}
                if (modulo != 0) {
                    // Every uneven row we print from left to right
                    ar.forEach(function(entry) {
                        entry.removeClass(function(index, className) {
                            return (className.match(/(^|\s)cell-push\S+/g) || []).join(' ');
                        });
                        entry.removeClass(function(index, className) {
                            return (className.match(/(^|\s)cell-1\S+/g) || []).join(' ');
                        });
                        entry.data("grid-rank", rank);
                        rank++;
                        $elem.append(entry);
                    });
                } else {
                    // Every even row we print from right to left
                    ar.forEach(function(entry) {
                        entry.data("grid-rank", rank);
                        rank++;
                    });
                    ar.reverse();
                    ar.forEach(function(entry) {
                        entry.removeClass(function(index, className) {
                            return (className.match(/(^|\s)cell-push\S+/g) || []).join(' ');
                        });
                        entry.removeClass(function(index, className) {
                            return (className.match(/(^|\s)cell-1\S+/g) || []).join(' ');
                        });
                        if (ar.length < x) {
                            // Cell count in the row is shorter than max cells in row, so we push it
                            var y = x - ar.length;
                            entry.addClass("cell-push-" + y + "-" + x);
                        }
                        $elem.append(entry);
                    });
                }
                if (i * x > cells.length) {
                    break;
                }
                i++;
            } while (true);
        },
        update: function($elem, columns) {
            // Collect each cell
            cells = [];
            $elem.children('.grid-cell').each(function() {
                cells.push($(this));
            });
            // Sort the cells
	    cells.sort(methods.sort);
            // Delete all current cells
            $elem.empty();
            // Render the cells
            methods.render($elem, cells, columns);
        },
        sort: function(a,b) {
	    var one = parseInt(a.data("grid-rank"));
            var two = parseInt(b.data("grid-rank"));
	    return one-two;
        },
        checkWidth: function() {
            var $elem = $(".grid-list");
            var currentWidth = parseFloat($elem.css('width'));
            var columns = $elem.data("columns");
	    var maxColumns = $elem.data("max-columns");
            var newColumns = (currentWidth - 1) / 163 | 0;
	    if(newColumns > maxColumns){
		newColumns = maxColumns;
	    }
            if (newColumns != columns && columns < 6) {
                if (!(newColumns > 6 && columns == 5)) {
                    if (newColumns > 5) {
                        newColumns = 5;
                    }
                    // The row get smaller or bigger, so we have to reorder the list
                    methods.update($elem, newColumns);
                    $elem.data("columns", newColumns);
                }
            }
            setTimeout(methods.checkWidth, 500);
        },

    };

    // Plugin definition.
    $.fn.materialGrid = function(options) {

        return this.each(function() {

            // Default options
            settings = $.extend(true, {
                debug: true,
                maxcolumns: 5,
                sorting: "bidirectional",
            }, options);

            if (settings.debug == true) {
                console.log("Materialize Grid List Activated");
            }
            var $elem = $(this);
            // Collect each cell
            $elem.children('.grid-cell').each(function() {
                cells.push($(this));
            });
            $elem.empty();
            $elem.data("columns", settings.maxcolumns);
            $elem.data("max-columns", settings.maxcolumns);
	    $elem.data("sorting", settings.sorting);
            methods.render($elem, cells, settings.maxcolumns);
            methods.checkWidth();
        });
    };
}(jQuery));

},{}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/lib/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53958" + '/');

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
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/lib/builtins/hmr-runtime.js","node_modules/materialize-grid-list/js/materialize-grid-list.js"], null)
//# sourceMappingURL=/materialize-grid-list.df01b783.map