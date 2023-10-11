type executeFn1 = () => void;
type executeFn2 = () => Promise<void>;
export type executeFn = executeFn1 | executeFn2;

export interface Test {
  type: 'test';
  description: string;
  fn: executeFn;
  skip?: boolean;
  timeElapsedMS?: number;
  only?: boolean;
  passed?: boolean;
  error?: any;
  basicAssertDescriptions?: string[]
}

export interface Run {
  type: 'run';
  fn: executeFn;
}

type ExecuteQueueItem = Test | Run;

export interface GroupBlock {
  description: string;
  executeQueue: ExecuteQueueItem[];
}

export interface Config {
  suppressConsole: boolean;
}
