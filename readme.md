# Nano Test Runner

A simple test runner for node for high developer productivity

## Features

* Runs in normal javascript! No annoying test runner wrapper env required. Debug the file like you would any other!
* Handles async or normal functions automatically. You don't have to handle functions differently.
* Run tests in 'parallel' or 'serial' modes.
* Written in typescript so intellisense works great.
* No dependencies. Extremely small.


## Limitations

* Currently does not scan your directories to find your test files. Rather you need to manually create a file that imports your test files. This is more work but it allows us to eliminate globals and provides easy debugging. In the future the ability to automatically generate this test entry point will likely be added..
* Currently does not have watch functionality.

## Usage

1. Add to project: `yarn add nano-test-runner` or `npm install nano-test-runner`

2. Create a file an import

```ts


```

3. Run the file `node dist/example-test.js`

`describe` - breaks your tests into groups

`test` - will accept normal or async functions




## Why

For small to medium projects normal test runners are problematic for various reasons. The main problem being developers tend to vastly underestimate the amount of cognitive overhead test runners add. Consider the following:

* Most test runners have large surface API. Developers are human and can only retain a finite number of code patterns in their working memory. Don't underestimate how much productivity is lost even with the best developers as result of this.
* Awkward debug flows. This is mostly due as result of indirection caused by the way test runners scan directories and then executing the code in a wrapped code block (so that they can inject their globals such as `describe`). Granted you can configure debuggers to work in this environment but that extra steps results in many developers just using a logging debug strategy. Logging is fine in many instances but for complex bugs a debugger speeds things up.
* Typically don't handle
* Globals such as `describe`. Much has been written on the challenges global variables. Suffice it to say the problems still exist with with test runners, though the larger problem is the cognitive load added to the developer as result of having to magically know what globals exists.

## Intentional Omissions

* Global Variable - `describe` , `test` and other helpers must be imported intentionally. Everything is meant to be very explicit.
* `beforeEach` - Once again contributes to the indirection of how the code is being executed, which in turns adds to the cognitive overload.
* Test Coverage - There are great use cases for this but the reality is most projects lack sufficient resources to implement this feature. In addition too many teams implement them early on when large architectural decisions are being made resulting in a significant amount of time being lost reworking the tests. These tend to make more sense for a mission critical (aka cannot tolerate many bugs) after the code base has begun to mature. For projects where this make sense they should transition to library that supports this.

### Potential Future Additions

* Print out "In Progress" with the test description when executing
* Add `xdescribe` and `odescribe` functionality
* Directory scanner that generate test files that can easily be debugged with watch functionality so it runs on file changes
* Max execution time for async tests

### Final Note

I think many people want to love testing more. The reality is though our tool chains have become so heavy and frankly the time alloted to testing so limited that many developers steer away from it. I don't think this is a problem of intelligence or ability but rather the reality of the constrained time most people work under.
