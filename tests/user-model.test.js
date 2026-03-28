import test from 'node:test';
import assert from 'node:assert/strict';
import { User } from '../Models/User.js';

test('User schema requires username, email, and password', () => {
  const { paths } = User.schema;

  assert.equal(paths.username.options.required, true);
  assert.equal(paths.email.options.required, true);
  assert.equal(paths.password.options.required, true);
});

test('User email is unique', () => {
  const { paths } = User.schema;
  assert.equal(paths.email.options.unique, true);
});
