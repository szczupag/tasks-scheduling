export class Task {
    index: number;
    processingTime: number;
    readyTime: number;
    dueDate: number;
    completionTime: number;
    tardiness: number;
    isAssigned: boolean;

    constructor(index: number, processingTime: number, readyTime: number, dueDate: number, completionTime: number = 0, tardiness: number = 0, isAssigned: boolean = false) {
        this.index = index;
        this.processingTime = processingTime;
        this.readyTime = readyTime;
        this.dueDate = dueDate;
        this.completionTime = completionTime;
        this.tardiness = tardiness;
        this.isAssigned = isAssigned;
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