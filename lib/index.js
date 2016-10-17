'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                  * This is basically the same as https://www.npmjs.com/package/babel-plugin-namespaces
                                                                                                                                                                                                                                                  */


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = namespacePlugin;


var namespaceRegex = /^<(.*?)>\//i;

function namespacePlugin(_ref) {
  var t = _ref.types;


  var defaults = {
    namespaces: {
      root: '.'
    }
  };

  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        // regular import / require statements
        console.log('wtf', path.node.callee.name);
        if (path.node.callee.name === 'require') {
          console.log('got it?');
          var localState = setupDefaults(state, defaults);

          var source = path.node.arguments[0];

          //usually happens when a conflict with a plugin arises
          if (!source.extra || !source.extra.rawValue) {
            return;
          }

          var rawVal = source.extra.rawValue.replace('\'', '');
          var val = '';

          handleNamespace(source, rawVal, localState);
        }

        // proxyquired calls.
        if (path.node.callee.name === 'proxyquire' || path.node.callee.name === 'proxyquireStrict' || path.node.callee.name === 'proxyquireNonStrict') {
          var _ret = function () {

            var localState = setupDefaults(state, defaults);
            var sourceObj = path.node.arguments[1];
            if (sourceObj && sourceObj.properties) {
              sourceObj.properties.map(function (src) {
                var source = src.key;
                if (!source.extra || !source.extra.rawValue) {
                  return;
                }

                var rawVal = source.extra.rawValue.replace('\'', '');
                var val = '';

                handleNamespace(source, rawVal, localState);
              });
            }
            return {
              v: void 0
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
      }
    }
  };
}

function setupDefaults(state, defaults) {
  var localState = Object.assign({}, state);
  localState.opts.namespaces = Object.assign({}, defaults.namespaces || {}, state.opts.namespaces || {});
  return localState;
}

function handleNamespace(source, rawVal, state) {
  var startPath = process.cwd();

  // match to namespace
  var namespace = namespaceRegex.exec(rawVal);

  if (namespace && namespace[1]) {
    var matchNs = namespace[1];

    if (!state.opts.namespaces[matchNs]) {
      console.log('WARNING: Undeclared namespace detected: ', matchNs);
      return;
    }

    var val = rawVal.replace(namespaceRegex, '');

    var current = _path2.default.dirname(state.file.opts.filename);
    var destination = _path2.default.join(startPath, state.opts.namespaces[matchNs] || '', val);

    source.value = normalizePath(_path2.default.relative(current, destination));
  }
}

function normalizePath(p) {
  var normalized = p.split(_path2.default.sep);

  //without ./, node assumes external package
  return './' + normalized.join('/');
}
