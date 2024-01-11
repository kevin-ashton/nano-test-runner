import {
  xdescribe,
  odescribe,
  describe,
  it,
  oit,
  xit,
  setOptions,
  run,
  originalConsole,
  basicExpectReject,
  basicAssert,
  basicAssertEqual,
  basicAssertNotEqual,
  basicStory,
  basicStoryEqual,
  basicStoryNotEqual
} from '../index';

/*
 CONFIG (optional)
   suppressConsole - suppress console.log, console.warn, console.error during the test run
     options: true | false  (default true)
*/
setOptions({ suppressConsole: false });

describe('Group 1', 'zfcf8JILKR', () => {
  run(() => {
    // Run block that can be used setup test
  });

  it('Sync Example', 'le5owKVv8U', () => {
    basicStory('Strings should match', 'hello' === 'hello', 'AEC3flcxD7');
    basicStoryEqual('Strings should match2', 'hello', 'hello', 'VZsFwlacgK');
    basicAssert('world' === 'world', 'L9s1unY6L');
  });

  it('Basic story equal fail', 'vw1fXwcvin', () => {
    basicStoryEqual('Strings should match', 'hello', 'hello1', 'bWGHMbh2dN');
  });

  it('Basic story not equal fail', 'cEpveXKPKc', () => {
    basicStoryNotEqual('Strings should match', 'hello', 'hello', 'jkvf15qytM');
  });

  it('Fail Example 2', 'M3k1Jg4Rfe', () => {
    basicAssertEqual('world!', 'world', '4QQ6zdLynt');
  });

  it('Fail Example 3', '4gnAzlzkuJ', () => {
    basicAssertNotEqual('world', 'world', 'L9m3iWI6DW');
  });

  it('Not Equal Working', 'x6qhCTUssZ', () => {
    basicAssertNotEqual('world', 'world12', 'kznGUbLxFx');
  });

  run(async () => {
    // Async run block that can be used setup test
    await new Promise<void>((r) => setTimeout(() => r(), 300));
  });

  it('Async Example', 'YtGzqTvHhL', async () => {
    // Notice the only thing changed was making this an async function
    // code...
    await new Promise<void>((r) => setTimeout(() => r(), 500));
  });

  const EXAMPLE_ERROR_MESSAGE = 'EXAMPLE_ERROR_MESSAGE';

  it('Async Example with Expected Error', 'MqTeBxhBlZ', async () => {
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

  it('Example Error', 'zNtzTrwMIa', () => {
    basicAssertEqual(5, 10, '"zfDcXLfdqQ"');
  });

  xit('Example Test Being Skipped', 'NmciaSPPI4', () => {
    // This test is currently being skipped due to the xtest
    basicAssertEqual(5, 5, '"vSybvk8dQf"');
  });

  /*
  // Currently commented out but if uncommitted would only run this test
  otest('Example Test with Only', () => {
    assert.strictEqual(5, 5);
  });
  */
});

describe('Group 2', 't0odz7nwKz', () => {
  run(() => {
    // Run block that can be used setup test
    console.log('Run block in group 2');
  });

  it('Another random test 1', '0HUqcxrEGs', () => {
    // A test where we expect nothing to be thrown
  });
});

describe('Group 3', 'AUWMCMujKg', () => {
  it('When do stories stop', '9D1UcYsVBU', () => {
    basicStoryEqual('Story part 1', 1, 1, 'dMp7HeJ4kg');
    basicStoryEqual('Story part 2', 1, 1, 'wxHc4X3CJv');
    if (1 === 1) {
      throw new Error('Stop here');
    }
    basicStoryEqual('Story part 3', 1, 1, 'AZfWB3dnXL');
  });
});
