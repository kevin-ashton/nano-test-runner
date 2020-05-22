import { describe, test, otest, xtest, setOptions } from '../index';
import { strict as asset } from 'assert';

setOptions({ runPattern: 'parallel', verbose: false });

describe('Should do x', () => {
  test('Test1', () => {
    asset.rejects(() => {
      throw new Error('lame');
    });
  });
  test('Test2', async () => {
    console.log('Start await');
    await new Promise((r) => setTimeout(() => r(), 3000));
    console.log('End');
  });
});

describe('Should do Yo', () => {
  test('Test1', async () => {
    await new Promise((r) => setTimeout(() => r(), 3000));

    // throw new Error('lame');
  });
  test('Test2', () => {});
});
