import { Task } from './task';
import { Machine } from './machine';
import { Machines } from './machines';

export class Instance {
    tasks: Array<Task>;
    length: number;
    fileName: string;
    machines: Machines;

    constructor(tasks: Array<Task>, length: number, fileName: string, machines: Machines = new Machines()) {
        this.tasks = tasks;
        this.length = length;
        this.fileName = fileName;
        this.machines = machines;
    }

    cloneInstance(): Instance {
        const tasksCopy: Array<Task> = this.getTasks().map(task => new Task(
            task.getIndex(),
            task.getProcessingTime(),
            task.getReadyTime(),
            task.getDueDate(),
            task.getCompletionTime(),
            task.getTardiness(),
            task.getIsAssigned())
        );
        const machinesCopy: Array<Machine> = this.getInstancesMachines().getMachines().map(machine => {
            const tasksOnMachine = machine.getTasks().map(task => {
                return tasksCopy.find(taskCopy => taskCopy.getIndex() === task.getIndex())
            })
            return new Machine(machine.getIndex(), tasksOnMachine, machine.getCompletionTime(), machine.getTotalTardiness());
        });
        const machineCopy: Machines = new Machines(machinesCopy, this.getInstancesMachines().countTotalTardiness());
        return new Instance(tasksCopy, this.getLength(), this.getFileName(), machineCopy);
    }

    getTasks(): Array<Task> {
        return this.tasks;
    }

    getInstancesMachines(): Machines {
        return this.machines;
    }

    getLength(): number {
        return this.length;
    }

    getFileName(): string {
        return this.fileName;
    }

    putTask(task: Task, machine: Machine) {
        machine.putTask(task);
    }

    takeTaskOff(task: Task) {
        const machine = this.machines.getMachines().find(machine => machine.getTasks().includes(task));
        console.log('[take off]', task, machine);
        machine.takeTaskOff(task);
        console.log('[take off]', task, machine);
    }

    insertTask(task: Task, machine: Machine, time: number) {
        machine.insertTask(task, time);
    }

    getReadyNotAssignedTaskWithMinDueDate(time: number): Task {
        const readyTasks = this.tasks.filter(task => task.getReadyTime() <= time && task.getIsAssigned() === false);
        if(readyTasks.length > 0){
            return readyTasks.reduce((prev, curr) => prev.getDueDate() < curr.getDueDate() ? prev : curr)
        }
    }

    getTaskWithMinDueDate(): Task {
        const avaiableTasks = this.tasks.filter(task => task.getIsAssigned() === false);
        return avaiableTasks.reduce((prev, curr) => prev.getDueDate() < curr.getDueDate() ? prev : curr)
    }

    getMachineWithMinCompletionTime(): Machine {
        return this.machines.getMachineWithMinCompletionTime();
    }

    getRandomMachine(): Machine {
        return this.machines.getMachine(Math.floor(Math.random() * this.machines.getMachines().length + 1));
    }

    getRandomNotAssignesTask(time: number): Task {
        const readyTasks = this.tasks.filter(task => task.getReadyTime() <= time && task.getIsAssigned() === false);
        if(readyTasks.length > 0){
            return readyTasks[Math.floor(Math.random() * readyTasks.length)];
        }
    }

    getRandomAssignedTask(): Task {
        return this.tasks[Math.floor(Math.random() * this.tasks.length)];
    }

    getRandomTaskWithMaxTardiness() {
        // const 
    }
}