const assert = require('node:assert/strict');

const { buildRequestBody } = require('../dist/nodes/CorebridgeBodyDefinitions.js');

function context(values) {
	return {
		getNodeParameter(name, _itemIndex, fallback) {
			return Object.hasOwn(values, name) ? values[name] : fallback;
		},
	};
}

const legacyNode = {
	parameters: {
		operation: 'searchContacts',
		jsonBody: '{"email":"legacy@example.test","page":2}',
	},
};
assert.deepEqual(
	buildRequestBody(context(legacyNode.parameters), 'searchContacts', 0, legacyNode),
	{ email: 'legacy@example.test', page: 2 },
	'Existing workflows with jsonBody must remain in JSON compatibility mode',
);

const fieldsNode = {
	parameters: {
		operation: 'searchContacts',
		bodyMode: 'fields',
		body_searchContacts_email: 'typed@example.test',
		body_searchContacts_page: 3,
		body_searchContacts_pageSize: 25,
		additionalBodyJson: '{"sort":"lastName"}',
	},
};
assert.deepEqual(
	buildRequestBody(context(fieldsNode.parameters), 'searchContacts', 0, fieldsNode),
	{ email: 'typed@example.test', page: 3, pageSize: 25, sort: 'lastName', direction: 'asc' },
	'Guided fields and additional JSON must merge into the documented request object',
);

const orderNode = {
	parameters: {
		operation: 'createGenericOrder',
		bodyMode: 'fields',
		body_createGenericOrder_externalId: 'TEST-1',
		body_createGenericOrder_isEstimate: true,
		body_createGenericOrder_genericOrderLineItems: '[{"ExternalId":"LINE-1","ProductDescription":"Test","ProductQuantity":1}]',
		additionalBodyJson: '{}',
	},
};
assert.deepEqual(
	buildRequestBody(context(orderNode.parameters), 'createGenericOrder', 0, orderNode),
	{
		ExternalId: 'TEST-1',
		IsEstimate: true,
		GenericOrderLineItems: [{ ExternalId: 'LINE-1', ProductDescription: 'Test', ProductQuantity: 1 }],
	},
	'Generic Order must accept a JSON object array for line items',
);

console.log('CoreBridge request builder tests passed');
