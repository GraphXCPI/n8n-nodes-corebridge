const assert = require('node:assert/strict');
const { Expression } = require('n8n-workflow');

const { CorebridgeApi } = require('../dist/credentials/CorebridgeApi.credentials.js');
const {
	normalizeCorebridgeBaseUrl,
} = require('../dist/nodes/CorebridgeUrl.js');

const credential = new CorebridgeApi();
const baseUrl = credential.properties.find((property) => property.name === 'baseUrl');
const apiKey = credential.properties.find((property) => property.name === 'apiKey');
const authorizationScheme = credential.properties.find(
	(property) => property.name === 'authorizationScheme',
);
const authorization = credential.authenticate?.properties?.headers?.Authorization;

assert.equal(credential.name, 'corebridgeApi');
assert.ok(baseUrl, 'baseUrl must remain available for saved credentials');
assert.ok(apiKey, 'apiKey must remain available for saved credentials');
assert.ok(authorizationScheme, 'authorizationScheme must be available for bare API codes');
assert.equal(baseUrl.displayName, 'Tenant or V2 API URL');
assert.equal(apiKey.displayName, 'API Authorization Code');
assert.match(baseUrl.default, /\.v2api\.corebridge\.net\/api\/public\/$/);
assert.equal(authorizationScheme.default, 'Basic');
assert.match(authorization, /Bearer /);
assert.match(authorization, /Basic /);
assert.match(authorization, /startsWith\("Bearer "\)/);
assert.match(authorization, /startsWith\("Basic "\)/);
assert.match(credential.test.request.url, /ExSalesCenter\/GetLocations/);
assert.equal(credential.test.rules[0].type, 'responseCode');
assert.deepEqual(credential.test.rules.map(rule => rule.properties.value), [401, 403]);

assert.equal(
	normalizeCorebridgeBaseUrl('https://tenant.corebridge.net/Login.aspx'),
	'https://tenant.v2api.corebridge.net/api/public/',
);
assert.equal(
	normalizeCorebridgeBaseUrl('https://tenant.corebridge.net/apidoc/index'),
	'https://tenant.v2api.corebridge.net/api/public/',
);
assert.equal(
	normalizeCorebridgeBaseUrl('https://tenant.v2api.corebridge.net/api/public/'),
	'https://tenant.v2api.corebridge.net/api/public/',
);
assert.equal(normalizeCorebridgeBaseUrl('https://example.com/Login.aspx'), undefined);
assert.equal(normalizeCorebridgeBaseUrl('https://user:pass@tenant.corebridge.net'), undefined);

const expression = new Expression({});
for (const input of [
	'https://tenant.corebridge.net/Login.aspx?next=dashboard',
	'https://tenant.corebridge.net/',
	'https://tenant.corebridge.net:8443/Login.aspx',
	'https://tenant.v2api.corebridge.net',
	'https://tenant.v2api.corebridge.net/',
	'https://tenant.v2api.corebridge.net/api/public',
	'https://tenant.v2api.corebridge.net:8443/api/public/',
	' https://tenant.v2api.corebridge.net/api/public/?example=1#test ',
	'https://api.example.com/api/public/',
	'https://api.example.com/proxy/api/public/',
	'HTTPS://TENANT.COREBRIDGE.NET:443/Login.aspx',
]) {
	const actual = expression.resolveSimpleParameterValue(credential.test.request.url, { $credentials: { baseUrl: input } });
	assert.equal(actual, normalizeCorebridgeBaseUrl(input) + 'ExSalesCenter/GetLocations', input);
}
for (const input of ['https://user:pass@tenant.corebridge.net', 'https://example.com/Login.aspx', 'ftp://tenant.corebridge.net', 'https://tenant.corebridge.net:99999', 'not-a-url']) {
	assert.equal(normalizeCorebridgeBaseUrl(input), undefined);
	let result;
	try { result = expression.resolveSimpleParameterValue(credential.test.request.url, { $credentials: { baseUrl: input } }); } catch { result = undefined; }
	assert.equal(result, undefined, 'Credential test must not construct a URL rejected by execution');
}
for (const [apiKey, scheme, expected] of [
	['fixture', 'Basic', 'Basic fixture'], ['fixture', 'Bearer', 'Bearer fixture'],
	['Basic fixture', 'Bearer', 'Basic fixture'], ['Bearer fixture', 'Basic', 'Bearer fixture'],
	[' fixture ', undefined, 'Basic fixture'],
]) {
	assert.equal(expression.resolveSimpleParameterValue(authorization, { $credentials: { apiKey, authorizationScheme: scheme } }), expected);
}

console.log('CoreBridge credential compatibility tests passed');
