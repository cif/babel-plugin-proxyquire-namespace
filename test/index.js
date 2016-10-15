import 'babel-register';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import plugin from '../src/';

describe('babel-plugin-proxyquire-namespace', () => {
  it('should replace instances of <name-space> with values from config', () => {
    const result = transformFileSync('./test/fixtures/input.js', {
      plugins: [
        [plugin, {
            namespaces: {
              config: './test/config/',
              'my-name-space': './test/namespace/',
            }
          }
        ]
      ]
    });
    const actual = result.code.trim();
    const expected = fs.readFileSync('./test/fixtures/expected.js', { encoding: 'utf8' }).trim();
    assert.equal(actual, expected, 'proxyquired namespaced paths mismatched');
  });
});
