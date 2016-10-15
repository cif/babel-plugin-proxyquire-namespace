# Using Proxyquire & Namespaces
This is a simple plugin that allows you to use `<name-space>/moduleFile` syntax when smashing dependencies
with [proxyquire](https://www.npmjs.com/package/proxyquire).

As of today this only works with [babel-plugin-namespaces](https://www.npmjs.com/package/babel-plugin-namespaces)
**Read the documentation for how to configure namespaces in package.json.**

This plugin itself does not need or use any configuration. Simply include `proxyquire-namespace` in your
project's `.babelrc` or `package.json` babel plugins and your tests will pass again!

## Example Usage

```
import { noCallThru } from 'proxyquire';
import { stub } from 'sinon';

const proxyquireStrict = noCallThru();

const stubs = {
  stubFoo: stub(),
  stubBar: stub()
};

const config = { static: 'test.value' };

const testModule = proxyquireStrict('./testModule', {
    '<config>/': config,
    '<my-name-space>/someDependencyToSmash': stubs
  }).default;
```
