# Nano Test Runner

A simple test runner for node for high developer productivity

## Features

* Runs in normal javascript! No annoying test runner wrapper env required. Debug the file like you would any other!
* Handles async or normal functions automatically. You don't have to handle functions differently.
* Written in typescript so intellisense works great.
* No dependencies. Extremely small.
* Forces you to insert location ids (lid) with most things for easy searching

## Tools

In order to facilate the inserting of nanoids for the `lid` parameters you should consider a VsCode plugin with a shortcut to generate them. [Nanoid Snippets](https://marketplace.visualstudio.com/items?itemName=kevin-ashton.vsc-nanoid-snippets) is one I build for this purpose, but there are others that work fine.

## Usage

1. Add to project: `yarn add nano-test-runner` or `npm install nano-test-runner`


<img src="https://github.com/kevin-ashton/nano-test-runner/blob/master/assets/simple-example.png?raw=true" width="600" />


## Full Example


```js
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

```

<img src="https://github.com/kevin-ashton/nano-test-runner/blob/master/assets/full-example.png?raw=true" width="600" />

Note: `xtest` and `otest` where used in place of the somewhat common `test.skip` and `test.only`. Testing is meant to be fast and adding and removing a character at the beginning of line speeds things up considerably.


## Limitations

* Currently does not scan your directories to find your test files. Rather you need to manually create a file that imports your test files. Granted this is more work but it allows us to eliminate globals and provides an easy debugging experience. In the future the ability to automatically generate this test entry point will likely be added.
* Currently does not have watch functionality.
* Does not support nesting.


## Why

For small to medium projects normal test runners are problematic for various reasons. The main problem being developers tend to vastly underestimate the amount of cognitive overhead test runners add. Consider the following:

* Most test runners have large surface API. Developers are human and can only retain a finite number of code patterns in their working memory. Don't underestimate how much productivity is lost even with the best developers as result of this.
* Awkward debug flows. This is mostly due as result of indirection caused by the way test runners scan directories and then execute the code in a wrapped code block (so that they can inject their globals such as `describe`). This is complicated even further if you want to use typescript or some transpile step. Granted you can configure debuggers to work in this environment but that extra steps results in many developers just using a logging debug strategy. Logging is fine in many instances but for complex bugs a debugger speeds things up.
* Globals such as `describe`. Much has been written on the challenges global variables. Suffice it to say the problems still exist with with test runners, though the larger problem is the cognitive load added to the developer as result of having to magically know what globals exists.

## Intentional Omissions

* Global Variable - `describe` , `test` and other helpers must be imported intentionally. Everything is meant to be very explicit.
* `beforeEach` - Once again contributes to the indirection of how the code is being executed, which in turns adds to the cognitive overload.
* Test Coverage - There are great use cases for this but the reality is most projects lack sufficient resources to implement this feature. In addition too many teams implement them early on when large architectural decisions are being made resulting in a significant amount of time being lost reworking the tests. Coverage tests can make for a mission critical (aka cannot tolerate many bugs) after the code base has begun to mature.

### Potential Future Additions

* Print out "In Progress" with the test description when executing
* Directory scanner that generate test files that can easily be debugged with watch functionality so it runs on file changes
* Add a max execution time option for async tests

### Example Directory Scan

Example if you want to run tests by scanning for files

```ts
import fg from "fast-glob";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const r1 = await fg(["**/**.test.js"], {
    cwd: __dirname,
    ignore: ["**/node_modules/**"],
    objectMode: true,
  });

  for (let i = 0; i < r1.length; i++) {
    const f = r1[i];
    import(`${__dirname}/${f?.path}`);
  }
}

await main();

