const assert = require('node:assert/strict');

const { CorebridgeApi } = require('../dist/credentials/CorebridgeApi.credentials.js');

const credential = new CorebridgeApi();
const baseUrl = credential.properties.find((property) => property.name === 'baseUrl');
const apiKey = credential.properties.find((property) => property.name === 'apiKey');
const authorization = credential.authenticate?.properties?.headers?.Authorization;

assert.equal(credential.name, 'corebridgeApi');
assert.ok(baseUrl, 'baseUrl must remain available for saved credentials');
assert.ok(apiKey, 'apiKey must remain available for saved credentials');
assert.equal(baseUrl.displayName, 'V2 API Base URL');
assert.equal(apiKey.displayName, 'Bearer API Code');
assert.match(baseUrl.default, /\.v2api\.corebridge\.net\/api\/public\/$/);
assert.match(authorization, /Bearer /);
assert.match(authorization, /startsWith\("Bearer "\)/);
assert.match(authorization, /startsWith\("Basic "\)/);
assert.match(credential.test.request.url, /ExSalesCenter\/GetLocations/);

console.log('CoreBridge credential compatibility tests passed');
