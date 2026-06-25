"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const error_js_1 = require("./error.js");
const defaultConfig = {
    maxStack: 20, // Max 20 calls queued in the stack
    maxCalls: 60, // Max 60 calls per interval
    interval: 60000, // 1 minute interval
};
/**
 * Rate-limit request queue. A single instance is shared by all DiscogsClient
 * instances (see client.ts).
 */
class Queue {
    constructor(customConfig) {
        this._stack = [];
        this._firstCall = 0;
        this._callCount = 0;
        /** Timestamps of recent calls, used by the sliding-window helpers. */
        this._callTimes = [];
        this.config = { ...defaultConfig };
        if (customConfig) {
            this.setConfig(customConfig);
        }
    }
    /**
     * Override the default configuration.
     */
    setConfig(customConfig) {
        Object.assign(this.config, customConfig);
        return this;
    }
    /**
     * Add a function to the queue.
     *
     * queue.add(function(err, freeCallsRemaining, freeStackPositionsRemaining){
     *     if(!err){ ... }
     * });
     */
    add(callback) {
        if (this._stack.length === 0) {
            const now = Date.now();
            // Within call interval limits: just execute the callback
            if (this._callCount < this.config.maxCalls) {
                this._callCount++;
                if (this._callCount === 1) {
                    this._firstCall = now;
                }
                setTimeout(callback, 0, null, this.config.maxCalls - this._callCount, this.config.maxStack);
                // Upon reaching the next interval: execute callback and reset
            }
            else if (now - this._firstCall > this.config.interval) {
                this._callCount = 1;
                this._firstCall = now;
                setTimeout(callback, 0, null, this.config.maxCalls - this._callCount, this.config.maxStack);
                // Within the interval exceeding call limit: queue the call
            }
            else {
                this._pushStack(callback);
            }
            // Current stack is not empty and must be processed first, queue new calls
        }
        else {
            this._pushStack(callback);
        }
        return this;
    }
    /**
     * Push a callback on the callback stack to be executed.
     */
    _pushStack(callback) {
        if (this._stack.length < this.config.maxStack) {
            const factor = Math.ceil(this._stack.length / this.config.maxCalls);
            const timeout = this._firstCall +
                this.config.interval * factor -
                Date.now() +
                (this._stack.length % this.config.maxCalls) +
                1;
            this._stack.push({
                callback,
                timeout: setTimeout(() => this._callStack(), timeout),
            });
        }
        else {
            // Queue max length exceeded: pass an error to the callback
            setTimeout(callback, 0, new error_js_1.DiscogsError(429, 'Too many requests'), 0, 0);
        }
    }
    /**
     * Shift a function from the callback stack and call it.
     */
    _callStack() {
        const item = this._stack.shift();
        if (item) {
            item.callback(null, 0, this.config.maxStack - this._stack.length);
            this._callCount++;
        }
    }
    /**
     * Clear the request stack. All queued requests/callbacks will be cancelled!
     */
    clear() {
        let item;
        while ((item = this._stack.shift())) {
            clearTimeout(item.timeout);
        }
        return this;
    }
    /**
     * Sliding-window helper: whether another call may be made right now without
     * exceeding `maxCalls` within the trailing `interval` window. Discogs uses a
     * moving-average window, so this is more accurate than the fixed-window model
     * used by `add()`.
     */
    canCall() {
        const now = Date.now();
        const windowStart = now - this.config.interval;
        this._callTimes = this._callTimes.filter((t) => t > windowStart);
        return this._callTimes.length < this.config.maxCalls;
    }
    /**
     * Sliding-window helper: record that a call was just made.
     */
    recordCall() {
        this._callTimes.push(Date.now());
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map