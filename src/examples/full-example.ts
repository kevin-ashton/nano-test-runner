import { describe, test, otest, xtest, setOptions } from '../index';
import * as assert from 'assert';

// You can set some options if you want
// runPattern - run all the test at once or one right after another
//   options: 'parallel' | 'serial' (default 'parallel')
// verbose - suppress console.log, console.warn, console.error during the run
//   options: true | false  (default true)
setOptions({ runPattern: 'parallel', verbose: false });

describe('Group 1', () => {
  test('Sync Example', () => {
    assert.equal('hello', 'hello', 'Strings should match');
    assert.equal('world', 'world', 'Strings should match');
  });

  test('Sync Example with expected error', () => {
    assert.rejects(() => {
      // code...
      throw new Error('Expected sync error');
    });
  });

  test('Async Example', async () => {
    // Notice the only thing changed was making this an async function
    await new Promise((r) => setTimeout(() => r(), 500));
  });

  test('Async Example with Expected Error', async () => {
    await assert.rejects(async () => {
      // Notice we now await the assert.reject
      throw new Error('Error we are expecting');
    });
  });

  test('Example Error', () => {
    assert.equal(5, 10);
  });

  xtest('Example Test Being Skipped', () => {
    // This test is currently being skipped due to the xtest
    assert.equal(5, 5);
  });

  /*
  // Currently commented out but if uncommitted would only run this test
  otest('Example Test with Only', () => {
    assert.equal(5, 5);
  });
  */
});
