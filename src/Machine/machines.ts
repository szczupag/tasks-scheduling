import { Task } from '../Instance/task';
import { Machine } from './machine';

export class Machines {
    machines: Array<Machine>;

    constructor(machines?: Array<Machine>, totalTardiness: number = 0) {
        if(!machines) {
            this.machines = new Array<Machine>();
            for (let i: number = 1; i <= 4; i++) {
                const machine: Machine = new Machine(i, new Array<Task>())
                this.machines.push(machine);
            }
        } else {
            this.machines = machines;
        }
    }

    getMachine(machineIndex: number): Machine {
        return this.machines.find(m => m.getIndex() === machineIndex);
    }

    showMachines() {
        this.machines.forEach(machine => machine.showMachine())
        console.log('[TOTAL TARDINESS]',this.countTotalTardiness());
    }

    countTotalTardiness(): number {
        let totalTardiness: number = 0;
        this.machines.forEach(machine => totalTardiness += machine.getTotalTardiness())
        return totalTardiness;
    }

    getMachineWithMinCompletionTime(): Machine {
        return this.machines.reduce((prev, curr) => prev.getCompletionTime() < curr.getCompletionTime() ? prev : curr)
    }

    getTotalTasksCount(): number {
        let tasksNumber = 0;
        this.machines.forEach(machine => tasksNumber += machine.getTasksCount());
        return tasksNumber;
    }

    getMachines(): Array<Machine> {
        return this.machines;
    }
}