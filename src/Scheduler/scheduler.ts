import { writeFileSync, appendFileSync } from 'fs';
import { Task } from '../Instance/task';
import { Machine } from '../Machine/machine';
import { Instance } from '../Instance/instance';

export class Scheduler {
    instances: Array<Instance>;
    resultsPath: string;
    eddInstance: Instance;
    previousInstance: Instance;
    currentInstance: Instance;

    constructor(instances: Array<Instance>, resultsDirPath: string) {
        this.instances = instances;
        this.resultsPath = resultsDirPath;
    }

    main() {
        this.instances.forEach(instance => {
            this.processInstance(instance);
        });
    }

    processInstance(instance: Instance) {
    }

    initEDDInstance(instance: Instance) {
        this.eddInstance = instance.cloneInstance();
        this.schedule(this.eddInstance, this.earliestDueDate);
    }

    initRandomInstance(instance: Instance) {
        this.previousInstance = instance.cloneInstance();
        this.schedule(this.previousInstance, this.randomSchedule);
    }

    schedule(instance: Instance, algorithm: Function) {
        while (instance.getInstancesMachines().getTotalTasksCount() < instance.getLength()) {
            const [task, machine] = algorithm(instance);
            if (task) {
                this.putTaskOnMachine(instance, task, machine);
            }
            else machine.updateCompletionTime(machine.getCompletionTime() + 1);
        }
    }

    earliestDueDate(instance: Instance): any {
        const machine: Machine = instance.getMachineWithMinCompletionTime();
        const task: Task = instance.getReadyNotAssignedTaskWithMinDueDate(machine.getCompletionTime());
        return [task, machine];
    }

    randomSchedule(instance: Instance): any {
        const machine: Machine = instance.getMachineWithMinCompletionTime();
        const task: Task = instance.getRandomNotAssignesTask(machine.getCompletionTime());
        return [task, machine];
    }

    putTaskOnMachine(instance: Instance, task: Task, machine: Machine) {
        instance.putTask(task, machine);
    }

    takeTaskOffMachine(instance: Instance, task: Task) {
        instance.takeTaskOff(task);
    }

    showSchedule(instance: Instance) {
        instance.getInstancesMachines().showMachines();
    }

    writeToFile(instance: Instance) {
        const filePath = `${this.resultsPath}/${instance.fileName.replace('in', 'out')}`;
        writeFileSync(filePath, `${instance.getInstancesMachines().countTotalTardiness()}\n`);
        instance.getInstancesMachines().getMachines().forEach(machine => {
            machine.getTasks().forEach(task => {
                appendFileSync(filePath, `${task.getIndex()} `)
            })
            appendFileSync(filePath, `\n`)
        });
    }
}