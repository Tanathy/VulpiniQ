/**
 * Q.Thread - Egységesített plugin séma
 * @param {Object} options
 *   - maxWorkers: szálak száma
 */
Q.Thread = function(options = {}) {
    const defaults = { maxWorkers: 1 };
    this.options = { ...defaults, ...options };
    this.maxWorkers = this.options.maxWorkers;
    this.workers = [];
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.taskIdCounter = 0;
    this.resultCallbacks = [];
    this.doneCallbacks = [];
    this.aborted = false;
    this.blobURL = Q.Thread._createWorkerBlob();
    for (let i = 0; i < this.maxWorkers; i++) this._addWorker();
};
Q.Thread._createWorkerBlob = function() {
    const code = `self.onmessage = event => { const { taskId, functionCode, parameters } = event.data; let executionFunction; try { executionFunction = eval('(' + functionCode + ')'); } catch (error) { self.postMessage({ taskId, error: error.toString() }); return; } Promise.resolve().then(() => executionFunction(...parameters)).then(result => self.postMessage({ taskId, result }), error => self.postMessage({ taskId, error: error.toString() })); };`;
    return URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
};
Q.Thread.prototype._addWorker = function() {
    const worker = new Worker(this.blobURL);
    worker.busy = false;
    worker.onmessage = event => {
        const { taskId, result, error } = event.data;
        worker.busy = false;
        const task = this.activeTasks.get(taskId);
        if (task) {
            error !== undefined ? task.reject(new Error(error)) : task.resolve(result);
            this.resultCallbacks.forEach(cb => cb({ id: taskId, result, error }));
            this.activeTasks.delete(taskId);
        }
        this._processQueue();
    };
    worker.onerror = () => { worker.busy = false; };
    this.workers.push(worker);
};
Q.Thread.prototype._processQueue = function() {
    if (this.aborted) return;
    while (true) {
        const idleIndex = this.workers.findIndex(w => !w.busy);
        if (idleIndex === -1 || this.workers.length <= this.maxWorkers) break;
        this.workers[idleIndex].terminate();
        this.workers.splice(idleIndex, 1);
    }
    for (const worker of this.workers) {
        if (!worker.busy && this.taskQueue.length) {
            const task = this.taskQueue.shift();
            worker.busy = true;
            this.activeTasks.set(task.id, task);
            worker.postMessage({ taskId: task.id, functionCode: task.functionCode, parameters: task.parameters });
        }
    }
    if (!this.taskQueue.length && !this.activeTasks.size) {
        const callbacks = this.doneCallbacks.slice();
        this.doneCallbacks.length = 0;
        callbacks.forEach(cb => cb());
    }
};
Q.Thread.prototype.init = function() {
    // nincs külön inicializáció
    return this;
};
Q.Thread.prototype.Workers = function(newWorkerCount) {
    if (this.aborted) return this;
    this.maxWorkers = newWorkerCount;
    if (newWorkerCount > this.workers.length) {
        for (let i = 0, diff = newWorkerCount - this.workers.length; i < diff; i++) this._addWorker();
    } else {
        this._processQueue();
    }
    return this;
};
Q.Thread.prototype.Push = function(taskInput, ...parameters) {
    if (this.aborted) return Promise.reject(new Error('Thread aborted'));
    const taskFunction = typeof taskInput === 'function' ? taskInput : (() => taskInput);
    const taskId = ++this.taskIdCounter;
    const task = { id: taskId, functionCode: taskFunction.toString(), parameters, resolve: null, reject: null };
    const promiseResult = new Promise((resolve, reject) => { task.resolve = resolve; task.reject = reject; });
    this.taskQueue.push(task);
    this._processQueue();
    return promiseResult;
};
Q.Thread.prototype.Result = function(callbackFunction) {
    if (typeof callbackFunction === 'function') this.resultCallbacks.push(callbackFunction);
    return this;
};
Q.Thread.prototype.Done = function(callbackFunction) {
    if (typeof callbackFunction !== 'function') return this;
    if (!this.taskQueue.length && !this.activeTasks.size) callbackFunction();
    else this.doneCallbacks.push(callbackFunction);
    return this;
};
Q.Thread.prototype.Abort = function() {
    this.aborted = true;
    while (this.taskQueue.length) this.taskQueue.shift().reject(new Error('Task aborted'));
    this.activeTasks.forEach(task => task.reject(new Error('Task aborted')));
    this.activeTasks.clear();
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.doneCallbacks.length = 0;
    this.resultCallbacks.length = 0;
    URL.revokeObjectURL(this.blobURL);
    return this;
};
Q.Thread.prototype.getState = function() {
    return {
        maxWorkers: this.maxWorkers,
        aborted: this.aborted,
        queueLength: this.taskQueue.length
    };
};
Q.Thread.prototype.setState = function(state) {
    if (state) {
        this.maxWorkers = state.maxWorkers || 1;
        this.aborted = state.aborted || false;
    }
};
