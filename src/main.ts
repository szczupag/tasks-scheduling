import { Parser } from './parser';
import { Scheduler } from './scheduler';
import { Instance } from './instance';

const instancesPath: string = 'instances';
const resultsPath: string = 'results';
const parser: Parser = new Parser(instancesPath);
const instances: Array<Instance> = parser.getInstances();
const scheduler: Scheduler = new Scheduler(instances, resultsPath);
scheduler.main();