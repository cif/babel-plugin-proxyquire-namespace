## Using Proxyquire & Namespaces
This is a simple plugin that allows you to use `<name-space>/moduleFile` syntax when smashing dependencies
with [proxyquire](https://www.npmjs.com/package/proxyquire).

This plugin simply adds proxyquire method calls to [babel-plugin-namespaces](https://www.npmjs.com/package/babel-plugin-namespaces)
**Read the documentation there for how to configure your namespaces in package.json.**
This plugin includes functionality from the base plugin so you only need to install this one.

Simply replace  `"namespaces"` key in babel plugins array with `"proxyquire-namespace"` and your
tests will pass again!

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
