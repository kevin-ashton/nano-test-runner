import { xdescribe, odescribe, describe, it, oit, xit, setOptions, run, basicAssert } from '../index';
import * as assert from 'assert';

/*
 CONFIG (optional)
   runPattern - run all the test at once or one right after another
     options: 'parallel' | 'serial' (default 'serial')
   suppressConsole - suppress console.log, console.warn, console.error during the test run
     options: true | false  (default true)
*/
setOptions({ suppressConsole: false });

describe('Group 1', () => {
  run(() => {
    // Run block that can be used setup test
  });

  it('Sync Example', () => {
    basicAssert('Strings should match', 'hello' === 'hello');
    basicAssert('Strings should match 2', 'world' === 'world');
  });

  it('Sync Example with expected error', () => {
    assert.throws(() => {
      // code...
      throw new Error('Expected sync error');
    });
  });

  run(async () => {
    // Async run block that can be used setup test
    await new Promise<void>((r) => setTimeout(() => r(), 300));
  });

  it('Async Example', async () => {
    // Notice the only thing changed was making this an async function
    // code...
    await new Promise<void>((r) => setTimeout(() => r(), 500));
  });

  it('Async Example with Expected Error', async () => {
    await assert.rejects(async () => {
      // Notice we await the assert.reject
      // code...
      throw new Error('Error we are expecting');
    });
  });

  it('Example Error', () => {
    assert.strictEqual(5, 10);
  });

  xit('Example Test Being Skipped', () => {
    // This test is currently being skipped due to the xtest
    assert.strictEqual(5, 5);
  });

  /*
  // Currently commented out but if uncommitted would only run this test
  otest('Example Test with Only', () => {
    assert.strictEqual(5, 5);
  });
  */
});

describe('Group 2', () => {
  run(() => {
    // Run block that can be used setup test
    console.log('Run block in group 2');
  });

  it('Another random test 1', () => {
    assert.strictEqual('hello', 'hello', 'Strings should match');
  });

  it('Another random test 2', () => {
    assert.strictEqual('hello', 'hello', 'Strings should match');
  });
});
