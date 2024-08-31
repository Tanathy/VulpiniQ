// Name: Timer
// Method: Plugin
// Desc: Provides a timer implementation with automatic stop and interrupt. Useful for running tasks at intervals or for a specific duration.
// Type: Plugin
// Example: Q.Timer(() => console.log('Tick'), 'timer1', { tick: 5, delay: 1000, interrupt: true });
Q.Timer = function (callback, id, options = {}) {
    const defaultOptions = {
        tick: 1,
        delay: 1000,
        interrupt: false
    };

    options = { ...defaultOptions, ...options };
    let tickCount = 0;
    let intervalId = null;

    if (!Q.Timer.activeTimers) {
        Q.Timer.activeTimers = new Map();
    }

    if (options.interrupt && Q.Timer.activeTimers.has(id)) {
        clearInterval(Q.Timer.activeTimers.get(id));
    }

    intervalId = setInterval(() => {
        callback();

        tickCount++;
        if (options.tick > 0 && tickCount >= options.tick) {
            clearInterval(intervalId);
            Q.Timer.activeTimers.delete(id);
        }
    }, options.delay);

    Q.Timer.activeTimers.set(id, intervalId);

    return intervalId;
};

Q.Timer.stop = function (id) {
    if (Q.Timer.activeTimers && Q.Timer.activeTimers.has(id)) {
        clearInterval(Q.Timer.activeTimers.get(id));
        Q.Timer.activeTimers.delete(id);
    }
};

Q.Timer.stopAll = function () {
    if (Q.Timer.activeTimers) {
        for (let intervalId of Q.Timer.activeTimers.values()) {
            clearInterval(intervalId);
        }
        Q.Timer.activeTimers.clear();
    }
};