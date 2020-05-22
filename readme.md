# Nano Test Runner

A simple test runner for node for high developer productivity

## Features

* Runs in normal javascript! No annoying test runner wrapper env required. Debug the file like you would any other!
* Handles async or normal functions automatically. You don't have to handle functions differently.
* Run tests in 'parallel' or 'serial' modes.
* Written in typescript so intellisense works great.
* No dependencies. Extremely small.

## Usage

1. Add to project: `yarn add nano-test-runner` or `npm install nano-test-runner`

2. Create a file and add the following

```js
const { describe, test } = require('nano-test-runner');
const assert = require('assert');

describe('Group 1', () => {
  test('Test 1', () => {
    assert.equal(1, 1, 'Numbers should equal');
    assert.equal('hello', 'hello', 'Strings should be equal');
  });
});
```

<img src="https://github.com/kevin-ashton/nano-test-runner/blob/master/assets/simple-example.png?raw=true" width="600" />

3. Run the file `node example-test.js`


## Full Example


```js
const { describe, test, otest, xtest, setOptions } = require('nano-test-runner');
const assert = require('assert');

/*
 CONFIG (optional)
   runPattern - run all the test at once or one right after another
     options: 'parallel' | 'serial' (default 'parallel')
   verbose - suppress console.log, console.warn, console.error during the test run
     options: true | false  (default true)
*/
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

```

<img src="https://github.com/kevin-ashton/nano-test-runner/blob/master/assets/full-example.png?raw=true" width="600" />

Note: `xtest` and `otest` where used in place of the somewhat common `test.skip` and `test.only`. Testing is meant to be fast and adding and removing a character at the beginning of line speeds things up considerably.


## Limitations

* Currently does not scan your directories to find your test files. Rather you need to manually create a file that imports your test files. Granted this is more work but it allows us to eliminate globals and provides an easy debugging experience. In the future the ability to automatically generate this test entry point will likely be added.
* Currently does not have watch functionality.


## Why

For small to medium projects normal test runners are problematic for various reasons. The main problem being developers tend to vastly underestimate the amount of cognitive overhead test runners add. Consider the following:

* Most test runners have large surface API. Developers are human and can only retain a finite number of code patterns in their working memory. Don't underestimate how much productivity is lost even with the best developers as result of this.
* Awkward debug flows. This is mostly due as result of indirection caused by the way test runners scan directories and then execute the code in a wrapped code block (so that they can inject their globals such as `describe`). Granted you can configure debuggers to work in this environment but that extra steps results in many developers just using a logging debug strategy. Logging is fine in many instances but for complex bugs a debugger speeds things up.
* Typically don't handle
* Globals such as `describe`. Much has been written on the challenges global variables. Suffice it to say the problems still exist with with test runners, though the larger problem is the cognitive load added to the developer as result of having to magically know what globals exists.

## Intentional Omissions

* Global Variable - `describe` , `test` and other helpers must be imported intentionally. Everything is meant to be very explicit.
* `beforeEach` - Once again contributes to the indirection of how the code is being executed, which in turns adds to the cognitive overload.
* Test Coverage - There are great use cases for this but the reality is most projects lack sufficient resources to implement this feature. In addition too many teams implement them early on when large architectural decisions are being made resulting in a significant amount of time being lost reworking the tests. Coverage tests can make for a mission critical (aka cannot tolerate many bugs) after the code base has begun to mature.

### Potential Future Additions

* Print out "In Progress" with the test description when executing
* Add `xdescribe` and `odescribe` functionality
* Directory scanner that generate test files that can easily be debugged with watch functionality so it runs on file changes
* Add a max execution time option for async tests

### Final Note

I think many people want to love testing more. The reality is though our tool chains have become so heavy and frankly the time alloted to testing so limited that many developers steer away from it. I don't think this is a problem of intelligence or ability but rather the reality of the constrained time most people work under.
