/*
* This is basically the same as https://www.npmjs.com/package/babel-plugin-namespaces
*/
import path from 'path';

export default namespacePlugin;

const namespaceRegex = /^<(.*?)>\//i;

function namespacePlugin({types: t}) {

  const defaults = {
    namespaces: {
      root: '.'
    }
  };

  return {
    visitor: {
      CallExpression(path, state) {

        if (path.node.callee.name === 'proxyquire' ||
          path.node.callee.name === 'proxyquireStrict' ||
          path.node.callee.name === 'proxyquireNonStrict'
        ) {

          var localState = setupDefaults(state, defaults);
          var sourceObj = path.node.arguments[1];
          sourceObj.properties.map((src) => {
            var source = src.key;
            if (!source.extra || !source.extra.rawValue) {
              return;
            }

            var rawVal = source.extra.rawValue.replace('\'', '');
            var val = '';

            handleNamespace(source, rawVal, localState);
          });
          return;
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
  const startPath = process.cwd();

  // match to namespace
  var namespace = namespaceRegex.exec(rawVal);

  if (namespace && namespace[1]) {
    var matchNs = namespace[1];

    if(!state.opts.namespaces[matchNs]) {
      console.log('WARNING: Undeclared namespace detected: ', matchNs);
      return;
    }

    let val = rawVal.replace(namespaceRegex, '');

    let current = path.dirname(state.file.opts.filename);
    let destination = path.join(startPath, (state.opts.namespaces[matchNs] || ''), val);

    source.value = normalizePath(path.relative(current, destination));
  }
}

function normalizePath(p) {
  var normalized = p.split(path.sep);

  //without ./, node assumes external package
  return './' + normalized.join('/');
}
