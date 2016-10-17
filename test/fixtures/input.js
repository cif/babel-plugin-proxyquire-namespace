import config from '<config>/test';

const testModule = proxyquireStrict('./testModule', {
    '<config>/': config,
    '<my-name-space>/someDependencyToSmash': stubs
  }).default;
