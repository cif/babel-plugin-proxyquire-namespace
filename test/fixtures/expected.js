'use strict';

var _test = require('./../config/test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testModule = proxyquireStrict('./testModule', {
    './../config': _test2.default,
    './../namespace/someDependencyToSmash': stubs
}).default;
