'use strict';

var testModule = proxyquireStrict('./testModule', {
    './../config': config,
    './../namespace/someDependencyToSmash': stubs
}).default;
