import { readdirSync, readFileSync } from 'fs';
import { Instance } from './instance'; 
import { Task } from './task';

export class Parser {
    instancesPath: string;

    constructor(instancesPath: string) {
        this.instancesPath = instancesPath;
    }

    getInstances(): Array<Instance> {
        console.log(`Reading directory: ${this.instancesPath}`);
        let instancesTasks = new Array<Instance>();
        const files: Array<string> = readdirSync(this.instancesPath);
        files.forEach(fileName => {
            const instance: Instance = this.parseFile(fileName)
            instancesTasks.push(instance);
        })
        return instancesTasks;
    }

    parseFile(fileName: string): Instance {
        console.log(`Reading file: ${fileName}`);
        let instanceTasks = new Array<Task>();
        const file: Array<string> = readFileSync(`${this.instancesPath}/` + fileName).toString().split('\n');
        const instanceLength: number = parseInt(file[0]);
        file.shift();
        file.filter(Boolean).forEach((line, index) => {
            const task = this.createTask(line, index);
            instanceTasks.push(task);
        })
        return new Instance(instanceTasks, instanceLength, fileName);
    }

    createTask(instanceLine: String, index: number): Task {
        const [p, r, d] = instanceLine.split(' ');
        const task = new Task(index + 1, parseInt(p), parseInt(r), parseInt(d));
        return task;
    }

}