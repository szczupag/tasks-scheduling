import { Parser } from './Instance/parser';
import { Scheduler } from './Scheduler/scheduler';
import { Instance } from './Instance/instance';

const instancesPath: string = 'instances';
const resultsPath: string = 'results';
const parser: Parser = new Parser(instancesPath);
const instances: Array<Instance> = parser.getInstances();
const scheduler: Scheduler = new Scheduler(instances, resultsPath);
scheduler.main();