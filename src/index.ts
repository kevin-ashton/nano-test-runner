import { DescribeBlock, testFn, Config } from './helpers/model';

/* *************
 * VARIABLES
 * ************* */

let config: Config = {
  runPattern: 'parallel',
  verbose: false
};
let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;
let totalTests = 0;
let onlyActivated = false;
let pendingStartEngineTimeout;
const workQueue: DescribeBlock[] = [];

// Monkey patch console to suppress errors and random console.logs
const originalConsoleLog = console.log;
console.log = (...args: any) => {
  if (config.verbose) {
    originalConsoleLog(...args);
  }
};
const originalConsoleError = console.error;
console.error = (...args: any) => {
  if (config.verbose) {
    originalConsoleError(...args);
  }
};
const originalConsoleWarn = console.warn;
console.warn = (...args: any) => {
  if (config.verbose) {
    originalConsoleWarn(...args);
  }
};

/* *************
 * EXPORTS
 * ************* */

export const setOptions = (c: Config) => (config = c);

export function test(description: string, fn: testFn) {
  processTest(description, fn, { only: false, skip: false });
}

export function xtest(description: string, fn: testFn) {
  processTest(description, fn, { only: false, skip: true });
}

export function otest(description: string, fn: testFn) {
  onlyActivated = true;
  processTest(description, fn, { only: true, skip: false });
}

export function describe(description: string, fn: () => void) {
  if (isAsyncFn(fn)) {
    throw new Error(`Cannot use async functions for 'describe'. Please use normal or async functions in 'test'`);
  }

  clearTimeout(pendingStartEngineTimeout);
  pendingStartEngineTimeout = setTimeout(() => startEngine(), 200);

  workQueue.push({ description, tests: [] });
  fn();
}

/* *************
 * CORE
 * ************* */

function processTest(description: string, fn: testFn, options: { skip: boolean; only: boolean }) {
  totalTests += 1;
  const describeIndex = workQueue.length - 1;
  const testIndex = workQueue[describeIndex].tests.length;
  workQueue[describeIndex].tests.push({
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
        workQueue[describeIndex].tests[testIndex].error = e;
      }

      if (hasError) {
        totalFailed += 1;
      } else {
        totalPassed += 1;
      }

      workQueue[describeIndex].tests[testIndex].passed = !hasError;
      workQueue[describeIndex].tests[testIndex].timeElapsedMS = Date.now() - start;
    }
  });
}

async function startEngine() {
  originalConsoleLog('');
  if (config.runPattern === 'serial') {
    for (let i = 0; i < workQueue.length; i++) {
      const wq = workQueue[i];
      reportDescribe(i);
      for (let k = 0; k < wq.tests.length; k++) {
        const t = wq.tests[k];
        await t.fn();
        reportTest(i, k);
      }
      originalConsoleLog('');
    }
  } else if (config.runPattern === 'parallel') {
    const fns: any = [];
    workQueue.forEach((wq) => {
      wq.tests.forEach((t) => {
        fns.push(t.fn());
      });
    });

    const progressInterval = setInterval(() => {
      printProgress(
        `STATUS passed: ${color.green(`${totalPassed}`)}   failed: ${color.red(
          `${totalFailed}`
        )}   skipped: ${color.yellow(`${totalSkipped}`)}   remaining: ${
          totalTests - (totalPassed + totalFailed + totalSkipped)
        } `
      );
    }, 1000);
    await Promise.all(fns);
    clearInterval(progressInterval);
    originalConsoleLog('');
    originalConsoleLog('');

    // Print results
    workQueue.forEach((wq, index) => {
      reportDescribe(index);
      wq.tests.forEach((t, tIndex) => {
        reportTest(index, tIndex);
      });
      originalConsoleLog('');
    });
  } else {
    throw new Error('Unknown runPattern');
  }

  printSummaryAndFinish();
}

function reportTest(describeIndex: number, testIndex: number) {
  const t = workQueue[describeIndex].tests[testIndex];
  if (t.skip || (onlyActivated && !t.only)) {
    originalConsoleLog(`${color.gray(`  - ${t.description}`)} `);
  } else if (t.passed) {
    originalConsoleLog(`${color.green(`  ✓ ${t.description}`)}   ${t.timeElapsedMS}ms`);
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
    wq.tests.forEach((t) => {
      if (t.error) {
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
      originalConsoleLog(`${color.red(`| Error: ${e.error.message}`)}`);
      originalConsoleLog(`${color.red('|')}`);
    });

    originalConsoleLog(`${color.red('_________')}`);
  }

  originalConsoleLog('');
  originalConsoleLog(`Total Tests Passed:  ${color.green(`${totalPassed}`)}`);
  originalConsoleLog(`Total Tests Failed:  ${color.red(`${totalFailed}`)}`);
  originalConsoleLog(`Total Tests Skipped: ${color.yellow(`${totalSkipped}`)}`);
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
