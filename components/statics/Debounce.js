// Name: Debounce
// Method: Static
// Desc: Debounces a function to only be called after a certain amount of time has passed since the last call avoiding multiple calls in a short period of time.
// Type: Event Handling
// Example: Q.Debounce('myFunction', 500, myFunction);
// Variables: id, time, callback
Q.Debounce = function (id, time, callback) {
    GLOBAL = GLOBAL || {};
    GLOBAL.Flood = GLOBAL.Flood || {};
    if (GLOBAL.Flood[id]) {
        clearTimeout(GLOBAL.Flood[id]);
    }
    GLOBAL.Flood[id] = time ? setTimeout(callback, time) : callback();
};