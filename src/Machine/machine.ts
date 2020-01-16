import { Task } from '../Instance/task';

export class Machine {
    index: number;
    tasks: Array<Task>;
    completionTime: number;
    totalTardiness: number;

    constructor(index: number, tasks: Array<Task>, completionTime: number = 0, totalTardiness: number = 0) {
        this.index = index;
        this.tasks = tasks;
        this.completionTime = completionTime;
        this.totalTardiness = totalTardiness;
    }

    getIndex(): number {
        return this.index;
    }

    getTotalTardiness(): number {
        return this.totalTardiness;
    }

    getCompletionTime(): number {
        return this.completionTime;
    }

    getTasks(): Array<Task> {
        return this.tasks;
    }

    updateCompletionTime(completionTime: number) {
        this.completionTime = completionTime;
        this.updateTardiness();
    }

    putTask(task: Task) {
        this.tasks.push(task);
        if(task.getReadyTime() > this.completionTime) this.updateCompletionTime(task.getReadyTime())
        const taskCompletionTime = this.completionTime + task.getProcessingTime();
        task.on(taskCompletionTime);
        this.updateCompletionTime(taskCompletionTime);
    }

    takeTaskOff(task: Task) {
        const taskIndex = this.tasks.indexOf(task);
        this.tasks.splice(taskIndex, 1);
        task.off();
        let previousTaskCompletionTime: number = 0;
        if(taskIndex > 0) { previousTaskCompletionTime = this.tasks[taskIndex - 1].getCompletionTime();
        console.log('[previous task]', this.tasks[taskIndex - 1]) }
        this.updateTasksTimes(taskIndex, previousTaskCompletionTime);
    }

    insertTask(task: Task, time: number) {
        let startTime = time < task.getReadyTime() ? task.getReadyTime() : time;
        const previousTask = this.tasks.find(task => task.completionTime <= startTime);
        if(!previousTask) {
            this.tasks.splice(0, 0, task)
            const taskCompletionTime = startTime + task.getProcessingTime()
            task.updateCompletionTime(taskCompletionTime);
            this.updateTasksTimes(1, taskCompletionTime);
        } else {
            const taskIndex = this.tasks.indexOf(previousTask);
            const taskCompletionTime = previousTask.getCompletionTime() + task.getProcessingTime()
            task.updateCompletionTime(taskCompletionTime);
            this.tasks.splice(taskIndex + 1, 0, task)
            this.updateTasksTimes(taskIndex + 2, taskCompletionTime);
        }
    }

    updateTasksTimes(taskIndex: number, previousTaskCompletionTime: number) {
        let completionTime: number = previousTaskCompletionTime;
        for (let i: number = taskIndex; i < this.tasks.length; i++) {
            const currentTask = this.tasks[i];
            if(currentTask.getReadyTime() > completionTime) {
                completionTime = currentTask.getReadyTime() + currentTask.getProcessingTime()
                currentTask.updateCompletionTime(completionTime)
            } else {
                completionTime += currentTask.getProcessingTime()
                currentTask.updateCompletionTime(completionTime)
            }
        }
        this.updateCompletionTime(completionTime);
    }

    showMachine() {
        console.log(`----- Machine [${this.index}] -----`);
        console.log(`completion time: ${this.completionTime}`);
        console.log(`total tardiness: ${this.totalTardiness}`);
        if (this.tasks.length == 0) console.log('tasks: machine is empty');
        else {
            console.log('tasks:')
            this.tasks.forEach(task => {
                console.log(task);
            });
        }
        console.log(`-----------------------\n`)
    }

    updateTardiness() {
        let tardiness = 0;
        this.tasks.forEach(task => tardiness += task.getTardiness());
        this.totalTardiness = tardiness;
    }

    getTasksCount(): number {
        return this.tasks.length;
    }
}