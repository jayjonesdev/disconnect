import test from 'node:test';
import assert from 'node:assert';
import { Queue } from '../src/queue.js';

test('Queue.setConfig overrides config', () => {
  const queue = new Queue();
  queue.setConfig({ maxStack: 2, maxCalls: 5, interval: 5000 });
  assert.strictEqual(queue.config.maxStack, 2);
  assert.strictEqual(queue.config.maxCalls, 5);
  assert.strictEqual(queue.config.interval, 5000);
});

test('Queue.add fills, overflows with 429, and clears', (t, done) => {
  const queue = new Queue({ maxStack: 2, maxCalls: 5, interval: 5000 });
  const dummy = (): boolean => true;
  queue.add(dummy); // 1
  queue.add(dummy); // 2
  queue.add(dummy); // 3
  queue.add(dummy); // 4
  queue.add((err, remainingFree, remainingStack) => {
    // 5 (last free call)
    assert.strictEqual(err, null);
    assert.strictEqual(remainingFree, 0, 'remaining free positions === 0');
    assert.strictEqual(remainingStack, 2, 'remaining stack positions === 2');
  });
  queue.add(dummy); // 6 (first in the stack)
  queue.add(dummy); // 7 (second in the stack)
  queue.add((err) => {
    // 8 overflow
    assert.ok(err, 'overflow produces an error');
    assert.strictEqual(
      (err as { statusCode?: number }).statusCode,
      429,
      'statusCode === 429'
    );
    done();
  });
});

test('Queue sliding-window helpers track recent calls', () => {
  const queue = new Queue({ maxStack: 2, maxCalls: 2, interval: 60000 });
  assert.strictEqual(queue.canCall(), true);
  queue.recordCall();
  queue.recordCall();
  assert.strictEqual(queue.canCall(), false, 'limit reached within window');
});
