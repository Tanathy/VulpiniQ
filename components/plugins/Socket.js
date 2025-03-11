// Name: Socket
// Method: Plugin
// Desc: Provides a WebSocket implementation with automatic reconnection and status callbacks.
// Type: Plugin
// Example: var socket = Q.Socket('ws://localhost:8080', console.log, console.log);
Q.Socket = function (url, onMessage, onStatus, options = {}) {
    const {
        retries = 5,                   // Number of reconnection attempts (0 means unlimited)
        delay = 1000,                  // Initial delay between reconnections in ms
        protocols = [],                // WebSocket sub-protocols
        backoff = false,               // Exponential backoff toggle
        pingInterval = 0,              // Interval for heartbeat pings (ms); 0 disables
        pingMessage = 'ping',          // Message to send for heartbeat
        queueMessages = false,         // Queue messages if socket is not open yet
        autoReconnect = true,          // Automatically reconnect on close
        onOpen = null,                 // Additional callback on open
        onClose = null,                // Additional callback on close
        onError = null                 // Additional callback on error
    } = options;

    let socket, attempts = 0, currentDelay = delay, pingId = null;
    const messageQueue = [];

    const connect = () => {
        socket = new WebSocket(url, protocols);
        socket.onopen = () => {
            attempts = 0;
            currentDelay = delay;
            onStatus?.('connected');
            onOpen?.();
            if (queueMessages && messageQueue.length) {
                while (messageQueue.length) {
                    socket.send(messageQueue.shift());
                }
            }
            if (pingInterval) {
                pingId && clearInterval(pingId);
                pingId = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(pingMessage);
                    }
                }, pingInterval);
            }
        };
        socket.onmessage = event => onMessage?.(event.data);
        socket.onerror = error => {
            onStatus?.('error', error);
            onError?.(error);
        };
        socket.onclose = event => {
            onClose?.(event);
            pingId && clearInterval(pingId);
            if (autoReconnect && (retries === 0 || attempts < retries)) {
                onStatus?.('closed');
                attempts++;
                setTimeout(() => {
                    connect();
                    if (backoff) {
                        currentDelay *= 2;
                    }
                }, currentDelay);
            } else {
                onStatus?.('Max retries exceeded');
            }
        };
    };

    connect();

    return {
        send: message => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            } else if (queueMessages) {
                messageQueue.push(message);
            }
        },
        reconnect: () => connect(),
        close: () => {
            // Disable autoReconnect on manual close.
            autoReconnect = false;
            pingId && clearInterval(pingId);
            socket.close();
        },
        getState: () => socket?.readyState
    };
};