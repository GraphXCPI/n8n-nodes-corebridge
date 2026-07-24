const assert = require('node:assert/strict');

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
assert.match(credential.test.request.url, /Login/);
assert.equal(credential.test.rules[0].type, 'responseCode');

assert.equal(
	normalizeCorebridgeBaseUrl('https://ag679test.corebridge.net/Login.aspx'),
	'https://ag679test.v2api.corebridge.net/api/public/',
);
assert.equal(
	normalizeCorebridgeBaseUrl('https://ag679test.corebridge.net/apidoc/index'),
	'https://ag679test.v2api.corebridge.net/api/public/',
);
assert.equal(
	normalizeCorebridgeBaseUrl('https://ag679test.v2api.corebridge.net/api/public/'),
	'https://ag679test.v2api.corebridge.net/api/public/',
);
assert.equal(normalizeCorebridgeBaseUrl('https://example.com/Login.aspx'), undefined);

console.log('CoreBridge credential compatibility tests passed');
