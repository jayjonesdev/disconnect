import type { QueueConfig } from './types.js';
export type { QueueConfig } from './types.js';
type QueueCallback = (err: Error | null, freeCallsRemaining?: number, freeStackPositions?: number) => void;
/**
 * Rate-limit request queue. A single instance is shared by all DiscogsClient
 * instances (see client.ts).
 */
export declare class Queue {
    config: QueueConfig;
    private _stack;
    private _firstCall;
    private _callCount;
    /** Timestamps of recent calls, used by the sliding-window helpers. */
    private _callTimes;
    constructor(customConfig?: Partial<QueueConfig>);
    /**
     * Override the default configuration.
     */
    setConfig(customConfig: Partial<QueueConfig>): this;
    /**
     * Add a function to the queue.
     *
     * queue.add(function(err, freeCallsRemaining, freeStackPositionsRemaining){
     *     if(!err){ ... }
     * });
     */
    add(callback: QueueCallback): this;
    /**
     * Push a callback on the callback stack to be executed.
     */
    private _pushStack;
    /**
     * Shift a function from the callback stack and call it.
     */
    private _callStack;
    /**
     * Clear the request stack. All queued requests/callbacks will be cancelled!
     */
    clear(): this;
    /**
     * Sliding-window helper: whether another call may be made right now without
     * exceeding `maxCalls` within the trailing `interval` window. Discogs uses a
     * moving-average window, so this is more accurate than the fixed-window model
     * used by `add()`.
     */
    canCall(): boolean;
    /**
     * Sliding-window helper: record that a call was just made.
     */
    recordCall(): void;
}
//# sourceMappingURL=queue.d.ts.map