import { writeFileSync, appendFileSync } from 'fs';
import { Task } from '../Instance/task';
import { Machine } from '../Machine/machine';
import { Instance } from '../Instance/instance';

export class Scheduler {
    instances: Array<Instance>;
    resultsPath: string;
    eddInstance: Instance;
    bestSchedule: Instance;
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
        /* 1. create best instance (edd)
        ** 2. repeat:
        **    i. copy best instance to current instance
        **   ii. take off random task & put on best machine 
        **  iii. if result is better - increase weights & save to best instance
        */
        this.bestSchedule = instance.cloneInstance();
        this.schedule(this.bestSchedule, this.earliestDueDate);
        const start = new Date().getTime();
        const maxTime = instance.getLength() * 100;
        while (new Date().getTime() - start < maxTime) {
            this.currentInstance = this.bestSchedule.cloneInstance();
            for (let i: number = 0; i < 10000; i++) {
                this.shiftRandomTaskToBestOrRandomMachine(this.currentInstance);
                if (this.currentInstance.getInstancesMachines().countTotalTardiness() < this.bestSchedule.getInstancesMachines().countTotalTardiness()) {
                    this.currentInstance.increaseTasksWeights();
                    this.bestSchedule = this.currentInstance.cloneInstance();
                }
            }
        }
        const end = new Date().getTime();
        console.log('[TIME]', end - start, '[SCORE]', this.bestSchedule.getInstancesMachines().countTotalTardiness())
        // this.showSchedule(this.bestSchedule);
        this.writeToFile(this.bestSchedule);
    }

    shiftRandomTaskToBestOrRandomMachine(instance: Instance) {const randomTask = this.currentInstance.getRandomAssignedTask();
        instance.takeTaskOff(randomTask);
        const [bestMachineIndex, _] = randomTask.getBestMachineIndex();
        const randomNumber = Math.floor(Math.random() * 10);
        if (bestMachineIndex && randomNumber < 7) {
            const bestMachine = instance.getInstancesMachines().getMachine(bestMachineIndex);
            instance.putTask(randomTask, bestMachine);
        } else {
            const randomMachine = instance.getMachineWithMinCompletionTime();
            instance.putTask(randomTask, randomMachine);
        }
    }

    schedule(instance: Instance, algorithm: Function) {
        while (instance.getInstancesMachines().getTotalTasksCount() < instance.getLength()) {
            const [task, machine] = algorithm(instance);
            if (task) instance.putTask(task, machine);
            else machine.updateCompletionTime(machine.getCompletionTime() + 1);
        }
    }

    scheduleWithProbabilities(instance: Instance) {
        while (instance.getInstancesMachines().getTotalTasksCount() < instance.getLength()) {
            instance.getInstancesMachines().getMachines().forEach(machine => {
                const bestTask = instance.getBestTaskForMachine(machine);
                const readyTask = instance.getRandomNotAssignesTask(machine.getCompletionTime());
                const random = Math.floor(Math.random() * 10)
                if (bestTask && readyTask) {
                    if (random < 5) instance.putTask(bestTask, machine);
                    else instance.putTask(readyTask, machine);
                }
                else if (bestTask) instance.putTask(bestTask, machine);
                else machine.updateCompletionTime(machine.getCompletionTime() + 1);
            });
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