const test = require('node:test');
const assert = require('node:assert/strict');
const { retry, isComplete, fillFromPrevious } = require('./news.selection');

test('retries a failed operation twice and returns a later success', async () => {
    let attempts = 0;
    const result = await retry(async () => {
        if (++attempts < 3) throw new Error('temporary failure');
        return 'ok';
    });
    assert.equal(result, 'ok');
    assert.equal(attempts, 3);
});

test('stops after the initial attempt and two retries', async () => {
    let attempts = 0;
    await assert.rejects(retry(async () => { attempts++; throw new Error('unavailable'); }), /unavailable/);
    assert.equal(attempts, 3);
});

test('requires an image and a nonempty summary', () => {
    assert.equal(isComplete({ imageUrl: 'https://example.com/a.jpg', points: ['Point'] }), true);
    assert.equal(isComplete({ imageUrl: '', points: ['Point'] }), false);
    assert.equal(isComplete({ imageUrl: 'https://example.com/a.jpg', points: [] }), false);
    assert.equal(isComplete({ imageUrl: 'https://example.com/a.jpg', points: ['  '] }), false);
});

test('fills gaps with recent complete stories but never reuses rejected or duplicate stories', () => {
    const now = Date.now();
    const item = (id, overrides = {}) => ({ id, url: `https://example.com/${id}`, submittedAt: new Date(now).toISOString(), imageUrl: 'https://example.com/a.jpg', points: ['Point'], ...overrides });
    const current = [item(1)];
    const previous = [item(1), item(2), item(3), item(4, { points: [] }), item(5, { submittedAt: new Date(now - 73 * 60 * 60 * 1000).toISOString() })];
    assert.deepEqual(fillFromPrevious(current, previous, new Set([3]), now).map((article) => article.id), [1, 2]);
});
