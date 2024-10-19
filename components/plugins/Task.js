// Name: Task
// Method: Plugin
// Desc: Provides methods to run tasks asynchronously and handle their completion or failure. Basically a Promise wrapper, but with more control.
// Type: Plugin
// Example: var task = Q.Task('task1', () => console.log('Task 1'), () => console.log('Task 2')); task.Run();
Q.Task = (function () {
    const tasks = {};
    const runningTasks = {};

    function createTask(id) {
        if (!tasks[id]) {
            tasks[id] = [];
        }
    }

    function addTask(id, ...functions) {
        if (!tasks[id]) {
            createTask(id);
        }
        tasks[id].push(...functions);
    }

    async function runTask(id) {
        if (!tasks[id] || tasks[id].length === 0) {
            console.error(`No tasks found with ID: ${id}`);
            return;
        }

        runningTasks[id] = {
            doneCallback: null,
            failCallback: null,
            timeout: 20000, 
            timeoutCallback: null,
        };

        const { timeout, timeoutCallback } = runningTasks[id];
        const timeoutPromise = new Promise((_, reject) => {
            const timer = setTimeout(() => {
                abortTask(id);
                reject(new Error(`Task with ID: ${id} timed out after ${timeout / 1000} seconds`));
            }, timeout);

            runningTasks[id].timeoutClear = () => clearTimeout(timer);
        });

        try {
            await Promise.race([
                (async () => {
                    for (const task of tasks[id]) {
                        await new Promise((resolve, reject) => {
                            try {
                                const result = task();
                                if (result instanceof Promise) {
                                    result.then(resolve).catch(reject);
                                } else {
                                    resolve();
                                }
                            } catch (error) {
                                reject(error);
                            }
                        });
                    }
                })(),
                timeoutPromise
            ]);

            if (runningTasks[id]?.doneCallback) {
                runningTasks[id].doneCallback();
            }
        } catch (error) {
            console.error(`Task with ID: ${id} failed with error:`, error);
            if (runningTasks[id]?.failCallback) {
                runningTasks[id].failCallback(error);
            }
        } finally {
            if (runningTasks[id]?.timeoutClear) {
                runningTasks[id].timeoutClear();
            }
            delete runningTasks[id];
        }
    }

    function abortTask(id) {
        if (runningTasks[id]) {
            delete runningTasks[id];
            console.log(`Task with ID: ${id} has been aborted.`);
        }
    }

    function taskDone(id, callback) {
        if (runningTasks[id]) {
            runningTasks[id].doneCallback = callback;
        }
    }

    function taskFail(id, callback) {
        if (runningTasks[id]) {
            runningTasks[id].failCallback = callback;
        }
    }

    function setTimeoutForTask(id, seconds) {
        if (runningTasks[id]) {
            runningTasks[id].timeout = seconds * 1000;
        }
    }

    function setTimeoutCallback(id, callback) {
        if (runningTasks[id]) {
            runningTasks[id].timeoutCallback = callback;
        }
    }

    return function (id, ...functions) {
        if (functions.length > 0) {
            addTask(id, ...functions);
        }
        return {
            Run: () => runTask(id),
            Abort: () => abortTask(id),
            Done: callback => taskDone(id, callback),
            Fail: callback => taskFail(id, callback),
            Timeout: (seconds) => setTimeoutForTask(id, seconds),
            TimeoutCallback: (callback) => setTimeoutCallback(id, callback),
        };
    };
})();