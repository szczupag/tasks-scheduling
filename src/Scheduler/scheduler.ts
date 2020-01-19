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
        /* 1. init first (previous) ranodm instance
        ** 2. init second (current) random instance
        ** 3. check which instance is better
        ** 4. save probabilities of better instance
        ** 5. generate next random instance with probabilities
        ** 6. repeat
        */
        /* 1. create best instance (edd) & copy to current instance
        ** 2. iterate: change random tasks in x iterations & save best result to best instance
        ** 3. copy best result and repeat 2.
        */

        this.bestSchedule = instance.cloneInstance();
        this.schedule(this.bestSchedule, this.earliestDueDate);
        for (let i: number = 0; i < 100; i++) {
            this.currentInstance = this.bestSchedule.cloneInstance();
            for (let i: number = 0; i < 100; i++) {
                const randomTask = this.currentInstance.getRandomAssignedTask();
                const randomMachine = this.currentInstance.getRandomMachine();
                this.currentInstance.takeTaskOff(randomTask);
                // this.currentInstance.insertTask(randomTask, randomMachine, randomMachine.randomMachineTime());
                this.currentInstance.putTask(randomTask, randomMachine);
                if(this.currentInstance.getInstancesMachines().countTotalTardiness() < this.bestSchedule.getInstancesMachines().countTotalTardiness()) {
                    this.bestSchedule = this.currentInstance.cloneInstance();
                }
            }        
        }
        this.showSchedule(this.bestSchedule);
        this.writeToFile(this.bestSchedule);
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
            if (task) this.putTaskOnMachine(instance, task, machine);
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
                    if (random < 5) this.putTaskOnMachine(instance, bestTask, machine);
                    else this.putTaskOnMachine(instance, readyTask, machine);
                }
                else if (bestTask) this.putTaskOnMachine(instance, bestTask, machine);
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