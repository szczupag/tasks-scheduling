export class Task {
    index: number;
    processingTime: number;
    readyTime: number;
    dueDate: number;
    completionTime: number;
    tardiness: number;
    isAssigned: boolean;
    weights: Array<Array<number>>;

    constructor(
        index: number,
        processingTime: number,
        readyTime: number,
        dueDate: number,
        completionTime: number = 0,
        tardiness: number = 0,
        isAssigned: boolean = false,
        weights: Array<Array<number>> = [[], [], [], []]
    ) {
        this.index = index;
        this.processingTime = processingTime;
        this.readyTime = readyTime;
        this.dueDate = dueDate;
        this.completionTime = completionTime;
        this.tardiness = tardiness;
        this.isAssigned = isAssigned;
        this.weights = weights;
    }

    getIndex(): number {
        return this.index;
    }

    getReadyTime(): number {
        return this.readyTime;
    }

    getProcessingTime(): number {
        return this.processingTime;
    }

    getDueDate(): number {
        return this.dueDate;
    }

    getCompletionTime(): number {
        return this.completionTime;
    }

    getTardiness(): number {
        return this.tardiness;
    }

    getIsAssigned(): boolean {
        return this.isAssigned;
    }

    getWeights(): Array<Array<number>> {
        return this.weights;
    }

    increaseWeightOnMachine(machineIndex: number) {
        this.weights[machineIndex - 1].push(this.completionTime);
    }

    getBestMachineIndex(): [number, number] {
        const maxElementsMachine = this.weights.reduce((a, b) => a.length > b.length ? a : b);
        const maxElementsMachineIndex = this.weights.indexOf(maxElementsMachine) + 1;
        const taskPosition = maxElementsMachine.reduce((a, b) => a + b) / maxElementsMachine.length;
        return [maxElementsMachineIndex, taskPosition];
    }

    on(taskCompletionTime: number) {
        this.updateCompletionTime(taskCompletionTime);
        this.updateIsAssigned(true);
    }

    off() {
        this.updateCompletionTime(0);
        this.updateIsAssigned(false);
    }

    updateCompletionTime(completionTime: number) {
        this.completionTime = completionTime;
        this.updateTardiness();
    }

    updateTardiness() {
        const lateness = this.completionTime - this.dueDate;
        if (lateness > 0) this.tardiness = lateness;
        else this.tardiness = 0;
    }

    updateIsAssigned(value: boolean) {
        this.isAssigned = value;
    }
}