/**
 * Q.Timer - Egységesített plugin séma
 * @param {Object} options
 *   - tick: hány alkalommal fusson le (0 = végtelen)
 *   - delay: időzítés ms-ban
 *   - interrupt: megszakítsa-e a futó azonosítót
 *   - autoStart: automatikus indítás
 *   - done: callback, ha vége
 */
Q.Timer = function(options = {}) {
    const defaults = { tick: 1, delay: 1000, interrupt: false, autoStart: true, done: null, callback: null, id: null };
    this.options = { ...defaults, ...options };
    if (!Q.Timer.activeTimers) Q.Timer.activeTimers = new Map();
    if (this.options.interrupt && Q.Timer.activeTimers.has(this.options.id)) Q.Timer.stop(this.options.id);
    this.tickCount = 0;
    this.isPaused = false;
    this.remainingDelay = this.options.delay;
    this.startTime = 0;
    this.timerHandle = null;
    if (this.options.autoStart) this.init();
    Q.Timer.activeTimers.set(this.options.id, this);
};
Q.Timer.prototype.init = function() {
    this.startTime = Date.now();
    const self = this;
    function tickHandler() {
        if (typeof self.options.callback === 'function') self.options.callback();
        self.tickCount++;
        if (self.options.tick > 0 && self.tickCount >= self.options.tick) {
            Q.Timer.stop(self.options.id);
            if (typeof self.options.done === 'function') self.options.done();
        } else {
            self.startTime = Date.now();
            self.timerHandle = setTimeout(tickHandler, self.options.delay);
        }
    }
    this.timerHandle = setTimeout(tickHandler, this.remainingDelay);
};
Q.Timer.prototype.pause = function() {
    if (!this.isPaused) {
        this.isPaused = true;
        clearTimeout(this.timerHandle);
        const elapsed = Date.now() - this.startTime;
        this.remainingDelay = this.options.delay - elapsed;
    }
    return this;
};
Q.Timer.prototype.resume = function() {
    if (this.isPaused) {
        this.isPaused = false;
        this.init();
    }
    return this;
};
Q.Timer.prototype.stop = function() {
    Q.Timer.stop(this.options.id);
};
Q.Timer.prototype.getState = function() {
    return {
        tickCount: this.tickCount,
        isPaused: this.isPaused,
        remainingDelay: this.remainingDelay
    };
};
Q.Timer.prototype.setState = function(state) {
    if (state) {
        this.tickCount = state.tickCount || 0;
        this.isPaused = state.isPaused || false;
        this.remainingDelay = state.remainingDelay || this.options.delay;
    }
};
Q.Timer.stop = function(identifier) {
    if (Q.Timer.activeTimers?.has(identifier)) {
        const timer = Q.Timer.activeTimers.get(identifier);
        clearTimeout(timer.timerHandle);
        Q.Timer.activeTimers.delete(identifier);
    }
};
Q.Timer.stopAll = function() {
    if (Q.Timer.activeTimers) {
        Q.Timer.activeTimers.forEach(timer => clearTimeout(timer.timerHandle));
        Q.Timer.activeTimers.clear();
    }
};