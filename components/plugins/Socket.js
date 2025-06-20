/**
 * Q.Socket - Egységesített plugin séma
 * @param {Object} options
 *   - url: websocket url
 *   - onMessage, onStatus, onOpen, onClose, onError, stb.
 */
Q.Socket = function(options = {}) {
    const defaults = {
        url: '',
        retries: 5,
        delay: 1000,
        protocols: [],
        backoff: false,
        pingInterval: 0,
        pingMessage: 'ping',
        queueMessages: false,
        autoReconnect: true,
        onOpen: null,
        onClose: null,
        onError: null,
        onMessage: null,
        onStatus: null
    };
    this.options = { ...defaults, ...options };
    this.attempts = 0;
    this.currentDelay = this.options.delay;
    this.pingId = null;
    this.messageQueue = [];
    this.socket = null;
    this.init();
};
Q.Socket.prototype.init = function() {
    const self = this;
    const o = this.options;
    function connect() {
        self.socket = new WebSocket(o.url, o.protocols);
        self.socket.onopen = function() {
            self.attempts = 0;
            self.currentDelay = o.delay;
            o.onStatus?.('connected');
            o.onOpen?.();
            if (o.queueMessages && self.messageQueue.length) {
                while (self.messageQueue.length) {
                    self.socket.send(self.messageQueue.shift());
                }
            }
            if (o.pingInterval) {
                self.pingId && clearInterval(self.pingId);
                self.pingId = setInterval(() => {
                    if (self.socket.readyState === WebSocket.OPEN) {
                        self.socket.send(o.pingMessage);
                    }
                }, o.pingInterval);
            }
        };
        self.socket.onmessage = event => o.onMessage?.(event.data);
        self.socket.onerror = error => {
            o.onStatus?.('error', error);
            o.onError?.(error);
        };
        self.socket.onclose = event => {
            o.onClose?.(event);
            self.pingId && clearInterval(self.pingId);
            if (o.autoReconnect && (o.retries === 0 || self.attempts < o.retries)) {
                o.onStatus?.('closed');
                self.attempts++;
                setTimeout(() => {
                    connect();
                    if (o.backoff) {
                        self.currentDelay *= 2;
                    }
                }, self.currentDelay);
            } else {
                o.onStatus?.('Max retries exceeded');
            }
        };
    }
    connect();
};
Q.Socket.prototype.send = function(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
    } else if (this.options.queueMessages) {
        this.messageQueue.push(message);
    }
};
Q.Socket.prototype.reconnect = function() {
    this.init();
};
Q.Socket.prototype.close = function() {
    this.options.autoReconnect = false;
    this.pingId && clearInterval(this.pingId);
    this.socket.close();
};
Q.Socket.prototype.getState = function() {
    return this.socket?.readyState;
};
Q.Socket.prototype.setState = function(state) {
    // nincs értelmezhető állapot
};
Q.Socket.prototype.destroy = function() {
    this.close();
    this.messageQueue = [];
};