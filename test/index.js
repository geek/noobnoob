'use strict';

const Assert = require('assert');
const { it } = exports.lab = require('lab').script();
require('../');


it('formats an error stack with the responsible code', (done) => {
  const error = new Error('test error');
  const stack = error.stack;
  Assert(stack.indexOf('formats an error stack') !== -1);
  done();
});
