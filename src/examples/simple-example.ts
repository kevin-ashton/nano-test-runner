import { describe, test } from '../index';
import * as assert from 'assert';

describe('Group 1', () => {
  test('Test 1', () => {
    assert.equal(1, 1, 'Numbers should equal');
    assert.equal('hello', 'hello', 'Strings should be equal');
  });
});
