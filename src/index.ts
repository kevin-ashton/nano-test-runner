import { GroupBlock, executeFn, Config } from './helpers/model';

/* *************
 * VARIABLES
 * ************* */

let config: Config = {
  suppressConsole: true
};
let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;
let totalTests = 0;
let startEngineTimeMs = 0;
let onlyActivated = false;
let pendingStartEngineTimeout;
let workQueue: GroupBlock[] = [];

// Monkey patch console to suppress errors and random console.logs
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/* *************
 * EXPORTS
 * ************* */

export function basicAssert(v1: boolean, lid: string) {
  if (!v1) {
    throw `basic assert ${lid}`;
  }
}

// Will output in summary display to tell a larger testing story
export function basicStory(msg: string, v1: boolean) {
  if (!v1) {
    throw msg;
  }

  if (msg) {
    const x = workQueue[currentDescribeIndex].executeQueue[currentTestIndex];
    if (x && x.type === 'test') {
      if (!x.basicStoryDescriptions) {
        x.basicStoryDescriptions = [];
      }
      x.basicStoryDescriptions.push(msg);
    }
  }
}

export const originalConsole = {
  log: originalConsoleLog,
  warn: originalConsoleWarn,
  error: originalConsoleError
};

export const setOptions = (c: Config) => (config = c);

export function it(description: string, fn: executeFn) {
  queueTestFn(description, fn, { only: false, skip: false });
}

export function run(fn: executeFn) {
  queueRunFn(fn);
}

export function xit(description: string, fn: executeFn) {
  queueTestFn(description, fn, { only: false, skip: true });
}

export function oit(description: string, fn: executeFn) {
  onlyActivated = true;
  queueTestFn(description, fn, { only: true, skip: false });
}

let oDescribePresent = false;

export function xdescribe(description: string, fn: () => void) {
  originalConsoleLog(color.gray(`SKIPPING: ${description}`));
}

export function odescribe(description: string, fn: () => void) {
  oDescribePresent = true;
  workQueue = [];
  originalConsoleLog(color.yellow(`------------------------------------------`));
  originalConsoleLog(color.yellow(`All other describe groups will be ignored!`));
  originalConsoleLog(color.yellow(`------------------------------------------`));

  if (isAsyncFn(fn)) {
    throw new Error(`Cannot use async functions for 'describe'. Please use normal or async functions in 'test'`);
  }

  clearTimeout(pendingStartEngineTimeout);
  pendingStartEngineTimeout = setTimeout(() => startEngine(), 200);

  workQueue.push({ description, executeQueue: [] });
  fn();
}

export function describe(description: string, fn: () => void) {
  if (oDescribePresent) {
    return;
  }

  if (isAsyncFn(fn)) {
    throw new Error(`Cannot use async functions for 'describe'. Please use normal or async functions in 'test'`);
  }

  clearTimeout(pendingStartEngineTimeout);
  pendingStartEngineTimeout = setTimeout(() => startEngine(), 200);

  workQueue.push({ description, executeQueue: [] });
  fn();
}

/* *************
 * CORE
 * ************* */

function queueRunFn(fn: executeFn) {
  const describeIndex = workQueue.length - 1;
  workQueue[describeIndex].executeQueue.push({
    type: 'run',
    fn: async () => {
      try {
        await fn();
      } catch (e) {
        originalConsoleError('Trouble executing run block', e);
      }
    }
  });
}

// let describeIndex = 0;
function queueTestFn(description: string, fn: executeFn, options: { skip: boolean; only: boolean }) {
  totalTests += 1;
  const describeIndex = workQueue.length - 1;
  const testIndex = workQueue[describeIndex].executeQueue.length;
  workQueue[describeIndex].executeQueue.push({
    type: 'test',
    description,
    only: options.only,
    skip: options.skip,
    fn: async () => {
      if (options.skip) {
        totalSkipped += 1;
        return;
      }
      if (onlyActivated && !options.only) {
        totalSkipped += 1;
        return;
      }
      const start = Date.now();
      let hasError = false;
      try {
        await fn();
      } catch (e) {
        hasError = true;
        // @ts-ignore
        workQueue[describeIndex].executeQueue[testIndex].error = e;
      }

      if (hasError) {
        totalFailed += 1;
      } else {
        totalPassed += 1;
      }

      // @ts-ignore
      workQueue[describeIndex].executeQueue[testIndex].passed = !hasError;
      // @ts-ignore
      workQueue[describeIndex].executeQueue[testIndex].timeElapsedMS = Date.now() - start;
    }
  });
}

let currentDescribeIndex = 0;
let currentTestIndex = 0;

async function startEngine() {
  startEngineTimeMs = Date.now();
  // suppress output if needed
  if (config.suppressConsole) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  originalConsoleLog('');
  for (let i = 0; i < workQueue.length; i++) {
    currentDescribeIndex = i;
    const wq = workQueue[i];
    reportDescribe(i);
    for (let k = 0; k < wq.executeQueue.length; k++) {
      currentTestIndex = k;
      const t = wq.executeQueue[k];
      await t.fn();
      if (t.type === 'test') {
        reportTest(i, k);
      }
    }
    originalConsoleLog('');
  }

  printSummaryAndFinish();
}

function reportTest(describeIndex: number, testIndex: number) {
  const t = workQueue[describeIndex].executeQueue[testIndex];
  if (t.type !== 'test') {
    originalConsoleError('Should not be running a report for a test on an executeQueue item that is not a test');
    return;
  }

  if (t.skip || (onlyActivated && !t.only)) {
    originalConsoleLog(`${color.gray(`  - ${t.description}`)} `);
  } else if (t.passed) {
    originalConsoleLog(`${color.green(`  ✓ ${t.description}`)}   ${t.timeElapsedMS}ms`);
    if (t.basicStoryDescriptions) {
      t.basicStoryDescriptions.forEach((d) => {
        originalConsoleLog(`${color.green(`    - ${d}`)}`);
      });
    }
  } else if (!t.passed) {
    originalConsoleLog(`${color.red(`  ✗ ${t.description}`)}   ${t.timeElapsedMS}ms`);
  }
}

function reportDescribe(describeIndex: number) {
  originalConsoleLog(`${color.cyan(workQueue[describeIndex].description)}`);
}

function printSummaryAndFinish() {
  // Extract any errors for display at the end
  const errors: { description: string; error: any }[] = [];
  workQueue.forEach((wq) =>
    wq.executeQueue.forEach((t) => {
      if (t.type === 'test' && t.error) {
        errors.push({ description: t.description, error: t.error });
      }
    })
  );

  if (errors.length > 0) {
    originalConsoleLog('');
    originalConsoleLog(`${color.red('_________')}`);
    originalConsoleLog(`${color.red('| ERRORS')}`);
    originalConsoleLog(`${color.red('|')}`);
    errors.forEach((e) => {
      originalConsoleLog(`${color.red(`| Test: ${e.description}`)}`);
      originalConsoleLog(`${color.red(`| Error: ${typeof e.error === 'string' ? e.error : e.error.message}`)}`);
      originalConsoleLog(`${color.red('|')}`);
    });
    originalConsoleLog(`${color.red('_________')}`);
  }

  originalConsoleLog('');
  originalConsoleLog(`Total Tests Passed:  ${color.green(`${totalPassed}`)}`);
  originalConsoleLog(`Total Tests Failed:  ${color.red(`${totalFailed}`)}`);
  originalConsoleLog(`Total Tests Skipped: ${color.yellow(`${totalSkipped}`)}`);
  originalConsoleLog(`Total Time: ${color.cyan(`${Date.now() - startEngineTimeMs}ms`)}`);
  if (errors.length > 0) {
    originalConsoleLog('');
    originalConsoleLog(color.red('----------'));
    originalConsoleLog(color.red('- FAILED -'));
    originalConsoleLog(color.red('----------'));
    process.exit(1);
  } else {
    originalConsoleLog(color.green('-----------'));
    originalConsoleLog(color.green('- SUCCESS -'));
    originalConsoleLog(color.green('-----------'));
    process.exit(0);
  }
}

/* *************
 * HELPER FUNCTIONS
 * ************* */

// Usage: console.log(`Hello ${color.green("world")}!`);
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
// For anything fancier just use chalk or color on npm
const colorEscape = '\x1b[0m';
const color = {
  black: (s: string) => `\x1b[30m${s}${colorEscape}`,
  red: (s: string) => `\x1b[31m${s}${colorEscape}`,
  green: (s: string) => `\x1b[32m${s}${colorEscape}`,
  yellow: (s: string) => `\x1b[33m${s}${colorEscape}`,
  blue: (s: string) => `\x1b[34m${s}${colorEscape}`,
  magenta: (s: string) => `\x1b[35m${s}${colorEscape}`,
  cyan: (s: string) => `\x1b[36m${s}${colorEscape}`,
  white: (s: string) => `\x1b[37m${s}${colorEscape}`,
  gray: (s: string) => `\x1b[2m\x1b[37m${s}${colorEscape}`
};

function isAsyncFn(fn: any) {
  return fn.constructor.name === 'AsyncFunction';
}

// Will update the text on a line in the terminal
const progressCharacters = ['-', '\\', '|', '/'];
let progressCharacterIndex = 0;
function printProgress(str: string) {
  if (!progressCharacters[progressCharacterIndex]) {
    progressCharacterIndex = 0;
  }
  const output = `${progressCharacters[progressCharacterIndex]} ${str}`;
  progressCharacterIndex += 1;

  if (process.stdout.clearLine) {
    process.stdout.clearLine(1);
    process.stdout.cursorTo(0);
    process.stdout.write(output);
  } else {
    originalConsoleLog(output);
  }
}
