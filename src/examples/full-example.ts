import { describe, test, otest, xtest, setOptions, run } from '../index';
import * as assert from 'assert';

/*
 CONFIG (optional)
   runPattern - run all the test at once or one right after another
     options: 'parallel' | 'serial' (default 'serial')
   suppressConsole - suppress console.log, console.warn, console.error during the test run
     options: true | false  (default true)
*/
setOptions({ runPattern: 'serial', suppressConsole: true });

describe('Group 1', () => {
  run(() => {
    // Run block that can be used setup test
  });

  test('Sync Example', () => {
    assert.equal('hello', 'hello', 'Strings should match');
    assert.equal('world', 'world', 'Strings should match');
  });

  test('Sync Example with expected error', () => {
    assert.throws(() => {
      // code...
      throw new Error('Expected sync error');
    });
  });

  run(async () => {
    // Async run block that can be used setup test
    await new Promise((r) => setTimeout(() => r(), 300));
  });

  test('Async Example', async () => {
    // Notice the only thing changed was making this an async function
    // code...
    await new Promise((r) => setTimeout(() => r(), 500));
  });

  test('Async Example with Expected Error', async () => {
    await assert.rejects(async () => {
      // Notice we await the assert.reject
      // code...
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
