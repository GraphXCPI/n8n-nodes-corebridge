const assert = require('node:assert/strict');
const { NodeOperationError } = require('n8n-workflow');
const { CorebridgeContacts } = require('../dist/nodes/CorebridgeContacts.node');
const { CorebridgeApiRequest } = require('../dist/nodes/CorebridgeApiRequest.node');

const node = { name: 'Fixture', type: 'fixture', typeVersion: 1, position: [0, 0], parameters: {} };
let requests = 0;
function context(parameters, error, keepGoing = false) {
	return {
		getNode: () => node,
		getInputData: () => [{ json: {} }, { json: {} }],
		getCredentials: async () => ({ baseUrl: 'https://tenant.corebridge.net/Login.aspx', apiKey: 'credential-marker' }),
		getNodeParameter: (key, _i, fallback) => parameters[key] ?? fallback,
		continueOnFail: () => keepGoing,
		helpers: { httpRequestWithAuthentication: async function () { requests++; if (error) throw error; return { result: true }; } },
	};
}
async function main() {
	// Live routing evidence overrides the PDF root-list examples. Keep these URLs literal.
	for (const [operation, resource, path] of [
		['getContacts', 'contacts', 'api/ExContact/Get'],
		['getCustomers', 'customers', 'api/ExCustomer/Get'],
		['getLocations', 'sales', 'api/public/ExSalesCenter/GetLocations'],
	]) {
		for (const [baseUrl, expectedBase] of [
			['https://tenant.corebridge.net/Login.aspx', 'https://tenant.v2api.corebridge.net/'],
			['https://tenant.v2api.corebridge.net/api/public/', 'https://tenant.v2api.corebridge.net/'],
			['https://gateway.example.test/prefix/api/public/', 'https://gateway.example.test/prefix/'],
		]) {
			const ctx = context({ operation, resource, pageIndex: 0, pageSize: 1 });
			ctx.getCredentials = async () => ({ baseUrl, apiKey: 'credential-marker' });
			ctx.helpers.httpRequestWithAuthentication = async function (auth, options) {
				assert.equal(auth, 'corebridgeApi');
				assert.equal(options.url, expectedBase + path);
				assert.equal(options.method, 'GET');
				if (operation !== 'getLocations') assert.deepEqual(options.qs, { intPageIndex: 0, pageSize: 1 });
				return [];
			};
			await new CorebridgeContacts().execute.call(ctx);
		}
	}
	for (const statusCode of [400, 401, 403, 404, 429, 503]) {
		const error = Object.assign(new Error('credential-marker customer-private-data'), { statusCode, request: { headers: { Authorization: 'credential-marker' } } });
		const parameters = { operation: 'getContacts', resource: 'contacts', pageIndex: 0, pageSize: 1 };
		await assert.rejects(new CorebridgeContacts().execute.call(context(parameters, error)), (actual) => {
			assert.match(actual.message, new RegExp('HTTP ' + statusCode));
			assert.match(actual.message, /GET ExContact/);
			assert.doesNotMatch(JSON.stringify(actual), /credential-marker|customer-private-data/);
			return true;
		});
		const [items] = await new CorebridgeContacts().execute.call(context(parameters, error, true));
		assert.equal(items.length, 2);
		assert.deepEqual(items.map(i => i.pairedItem), [{ item: 0 }, { item: 1 }]);
		assert.doesNotMatch(JSON.stringify(items), /credential-marker|customer-private-data/);
	}
	requests = 0;
	await assert.rejects(new CorebridgeContacts().execute.call(context({ operation: 'getContactById', resource: 'contacts', contactId: -1 })), /contactId must be an integer >= 1/);
	await assert.rejects(new CorebridgeContacts().execute.call(context({ operation: 'getCustomersCreatedBetween', resource: 'customers', startDate: '2020-01-01', beginDays: 5, endDays: 1 })), /relative day counts/);
	await assert.rejects(new CorebridgeContacts().execute.call(context({ operation: 'getOrderHistory', resource: 'orders', orderId: 1, page: 1, pageSize: 10, queryParameters: { parameters: [{ name: 'pageSize', value: '999' }] } })), /<= 50/);
	assert.equal(requests, 0, 'Invalid requests must never reach the API');
	await assert.rejects(new CorebridgeContacts().execute.call(context({ operation: 'getContacts', resource: 'contacts' }, new NodeOperationError(node, 'credential-marker'))), (error) => {
		assert.doesNotMatch(JSON.stringify(error), /credential-marker/); return true;
	});
	for (const [value, expected] of [[0, undefined], ['1e1', 10]]) {
		const ctx = context({ operation: 'getContacts', resource: 'contacts', queryParameters: { parameters: [{ name: 'pageSize', value }] } });
		ctx.helpers.httpRequestWithAuthentication = async function (_auth, options) { assert.equal(options.qs.pageSize, expected); return {}; };
		await new CorebridgeContacts().execute.call(ctx);
	}
	for (const note of ['Synthetic note', 'true', '42']) {
		const ctx = context({ operation: 'createCustomerNote', resource: 'customers', customerId: 1, bodyMode: 'json', jsonBody: JSON.stringify(note) });
		ctx.helpers.httpRequestWithAuthentication = async function (_auth, options) {
			assert.equal(options.headers['Content-Type'], 'application/json');
			assert.equal(JSON.parse(options.body), note);
			return { result: true };
		};
		await new CorebridgeContacts().execute.call(ctx);
	}
	await assert.rejects(new CorebridgeApiRequest().execute.call(context({ method: 'POST', path: 'Fixture', jsonBody: '{private-body-marker' })), (e) => {
		assert.match(e.message, /Invalid JSON body/); assert.doesNotMatch(e.message, /private-body-marker/); return true;
	});
	const [raw] = await new CorebridgeApiRequest().execute.call(context({ method: 'POST', path: 'Fixture', jsonBody: { synthetic: true } }));
	assert.equal(raw.length, 2);
	for (const response of [[{ id: 1 }, { id: 2 }], { data: [{ id: 1 }, { id: 2 }], total: 2 }]) {
		for (const [instance, parameters] of [
			[new CorebridgeContacts(), { operation: 'getContacts', resource: 'contacts', pageIndex: 0, pageSize: 2 }],
			[new CorebridgeApiRequest(), { method: 'GET', path: 'ExContact' }],
		]) {
			const ctx = context(parameters);
			ctx.helpers.httpRequestWithAuthentication = async () => response;
			const [output] = await instance.execute.call(ctx);
			assert.equal(output.length, 2);
			assert.deepEqual(output[0].json, Array.isArray(response) ? { data: response } : response);
			assert.equal(output[0].json.data.length, 2, 'No records dropped');
			assert.deepEqual(output[1].pairedItem, { item: 1 });
		}
	}
	console.log('Runtime error redaction, item linking, query guards and raw object-expression tests passed');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
