import {
  xdescribe,
  odescribe,
  describe,
  it,
  oit,
  xit,
  setOptions,
  run,
  basicAssert,
  basicStory,
  originalConsole as console,
  basicExpectReject
} from '../index';
import * as assert from 'assert';

/*
 CONFIG (optional)
   suppressConsole - suppress console.log, console.warn, console.error during the test run
     options: true | false  (default true)
*/
setOptions({ suppressConsole: false });

describe('Group 1', () => {
  run(() => {
    // Run block that can be used setup test
  });

  it('Sync Example', () => {
    basicStory('Strings should match', 'hello' === 'hello');
    basicAssert('world' === 'world', 'L9s1unY6L');
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

  const EXAMPLE_ERROR_MESSAGE = 'EXAMPLE_ERROR_MESSAGE';

  it('Async Example with Expected Error', async () => {
    // basicExpectReject will fail if
    // 1) nothing is rejected
    // 2) if something is thrown during validateError

    await basicExpectReject({
      fn: async () => {
        // code...
        throw new Error(EXAMPLE_ERROR_MESSAGE);
      },
      validateError: (e) => {
        // Ensure the error is what you expect
        basicAssert(e.message === EXAMPLE_ERROR_MESSAGE, 'h7gNKWkPS');
      },
      lid: 'RW_IV4dSz'
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
