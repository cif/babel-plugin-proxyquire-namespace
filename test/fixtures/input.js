const testModule = proxyquireStrict('./testModule', {
    '<config>/': config,
    '<my-name-space>/someDependencyToSmash': stubs
  }).default;
