const assert = require('node:assert/strict');

const {
	endpoints,
	getCorebridgeProperties,
	selectableDomains,
} = require('../dist/nodes/CorebridgeEndpointDefinitions.js');
const { CorebridgeExecutor } = require('../dist/nodes/CorebridgeExecutor.js');

function sampleValue(parameter) {
	if (parameter.type === 'boolean') return true;
	if (parameter.type === 'number') return 123;
	return 'sample';
}

async function captureRequest(endpoint, resource = endpoint.domain) {
	const values = {
		operation: endpoint.operation,
		bodyMode: 'json',
		jsonBody: '{}',
		queryParameters: {},
	};
	if (resource !== undefined) values.resource = resource;
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
	for (const defaultDomain of selectableDomains) {
		const properties = getCorebridgeProperties(defaultDomain);
		const resource = properties.find((property) => property.name === 'resource');
		const operationSelectors = properties.filter((property) => property.name === 'operation');

		assert.equal(resource.default, defaultDomain, `${defaultDomain} resource default`);
		assert.deepEqual(
			resource.options.map((option) => option.value),
			selectableDomains,
			`${defaultDomain} resource options`,
		);
		assert.equal(
			operationSelectors.length,
			selectableDomains.length,
			`${defaultDomain} operation selector count`,
		);
		for (const selectableDomain of selectableDomains) {
			const selector = operationSelectors.find(
				(property) => property.displayOptions?.show?.resource?.[0] === selectableDomain,
			);
			assert.ok(selector, `${defaultDomain} missing ${selectableDomain} operation selector`);
			assert.deepEqual(
				selector.options.map((option) => option.value),
				endpoints
					.filter((endpoint) => endpoint.domain === selectableDomain)
					.map((endpoint) => endpoint.operation),
				`${defaultDomain} ${selectableDomain} operation options`,
			);
		}
	}

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

	const legacyRequest = await captureRequest(endpoints[0], undefined);
	assert.equal(
		legacyRequest.url,
		'https://corebridge.example.test/api/public/ExContact',
		'Legacy workflow without resource must remain executable',
	);
	await assert.rejects(
		() => captureRequest(endpoints[0], 'orders'),
		/does not belong to the selected orders resource/,
		'Resource and operation mismatches must not execute',
	);

	console.log(
		`CoreBridge endpoint wire tests passed: ${endpoints.length} mocked requests and ${selectableDomains.length} resource selectors`,
	);
})().catch((error) => {
	console.error(error);
	process.exit(1);
});
