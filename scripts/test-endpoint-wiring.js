const assert = require('node:assert/strict');

const { endpoints } = require('../dist/nodes/CorebridgeEndpointDefinitions.js');
const { CorebridgeExecutor } = require('../dist/nodes/CorebridgeExecutor.js');

function sampleValue(parameter) {
	if (parameter.type === 'boolean') return true;
	if (parameter.type === 'number') return 123;
	return 'sample';
}

async function captureRequest(endpoint) {
	const values = {
		operation: endpoint.operation,
		bodyMode: 'json',
		jsonBody: '{}',
		queryParameters: {},
	};
	for (const parameter of endpoint.parameters ?? []) values[parameter.name] = sampleValue(parameter);

	const node = {
		name: `Test ${endpoint.operation}`,
		type: 'n8n-nodes-corebridge.test',
		typeVersion: 1,
		position: [0, 0],
		parameters: values,
	};
	let captured;
	const context = {
		getInputData: () => [{ json: {} }],
		getCredentials: async () => ({ baseUrl: 'https://corebridge.example.test/api/public/', apiKey: 'not-a-secret' }),
		getNodeParameter: (name, _itemIndex, fallback) => Object.hasOwn(values, name) ? values[name] : fallback,
		getNode: () => node,
		continueOnFail: () => false,
		helpers: {
			httpRequestWithAuthentication: async (_credential, options) => {
				captured = options;
				return { success: true };
			},
		},
	};

	await CorebridgeExecutor.prototype.execute.call(context);
	return captured;
}

(async () => {
	for (const endpoint of endpoints) {
		const request = await captureRequest(endpoint);
		const expectedPath = endpoint.path.replace(/\{([^}]+)\}/g, (_match, name) => {
			const parameter = (endpoint.parameters ?? []).find((candidate) => (candidate.apiName ?? candidate.name) === name);
			return encodeURIComponent(String(sampleValue(parameter ?? {})));
		});
		assert.equal(request.method, endpoint.method, `${endpoint.operation} method`);
		assert.equal(request.url.includes('{'), false, `${endpoint.operation} has unresolved path parameters`);
		assert.equal(request.url, `https://corebridge.example.test/api/public/${expectedPath}`, `${endpoint.operation} URL`);
		for (const parameter of endpoint.parameters ?? []) {
			if (parameter.location !== 'query') continue;
			assert.equal(
				Object.hasOwn(request.qs, parameter.apiName ?? parameter.name),
				true,
				`${endpoint.operation} missing query parameter ${parameter.apiName ?? parameter.name}`,
			);
		}
		if (endpoint.body) assert.deepEqual(request.body, {}, `${endpoint.operation} JSON body`);
	}
	console.log(`CoreBridge endpoint wire tests passed: ${endpoints.length} mocked requests`);
})().catch((error) => {
	console.error(error);
	process.exit(1);
});
