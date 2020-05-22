type testFn1 = () => void;
type testFn2 = () => Promise<void>;
export type testFn = testFn1 | testFn2;

export interface Test {
  description: string;
  fn: testFn;
  skip?: boolean;
  timeElapsedMS?: number;
  only?: boolean;
  passed?: boolean;
  error?: any;
}

export interface DescribeBlock {
  description: string;
  tests: Test[];
}

export interface Config {
  verbose: boolean;
  runPattern: 'parallel' | 'serial';
}
