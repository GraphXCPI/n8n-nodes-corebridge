const assert = require('node:assert/strict');
const { CorebridgeSearchRateLimit, isPacedSearch } = require('../dist/nodes/CorebridgeSearchRateLimit');

function fixture() {
	let now = 0;
	const waits = [];
	return { limiter: new CorebridgeSearchRateLimit({ now: () => now, sleep: async (ms) => { waits.push(ms); now += ms; } }), waits };
}
async function main() {
	assert.equal(isPacedSearch('searchCustomers'), true);
	assert.equal(isPacedSearch('searchContacts'), true);
	for (const op of ['createCustomer', 'updateContact', 'convertEstimate', 'searchOrders', 'apiRequest']) assert.equal(isPacedSearch(op), false);
	{
		const { limiter, waits } = fixture();
		const results = [];
		for (let i = 0; i < 158; i++) results.push(await limiter.request(async () => i, 8, 2));
		assert.equal(results.length, 158);
		assert.equal(results[157], 157);
		assert.equal(waits.length, 157);
		assert.ok(waits.every(ms => ms === 8000));
	}
	for (const [headers, delay] of [[{}, 60000], [{ 'Retry-After': '10' }, 10000], [{ 'retry-after': new Date(90000).toUTCString() }, 90000], [{ 'retry-after': 'invalid' }, 60000], [{ 'retry-after': '0' }, 8000]]) {
		const { limiter, waits } = fixture();
		let attempts = 0;
		const result = await limiter.request(async () => { if (++attempts === 1) throw { response: { status: 429, headers } }; return { data: [1] }; }, 8, 2);
		assert.deepEqual(result, { data: [1] });
		assert.deepEqual(waits, [delay]);
		assert.equal(attempts, 2);
	}
	for (const [error, retries, count] of [
		[{ statusCode: 429 }, 2, 3], [{ httpCode: '429' }, 0, 1],
		[{ statusCode: 429, headers: { 'retry-after': '3600' } }, 2, 1],
		[{ statusCode: 401 }, 2, 1], [{ statusCode: 503 }, 2, 1],
	]) {
		const { limiter } = fixture();
		let attempts = 0;
		await assert.rejects(limiter.request(async () => { attempts++; throw error; }, 8, retries), actual => actual === error);
		assert.equal(attempts, count);
	}
	for (const [interval, retries] of [[0, 2], [NaN, 2], [8, 4], [8, -1]]) {
		const { limiter } = fixture();
		await assert.rejects(limiter.request(async () => assert.fail('Invalid options sent request'), interval, retries), /interval must be/);
	}
	console.log('Search pacing: 158 items, Retry-After seconds/date, bounded retries, no write retries passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
