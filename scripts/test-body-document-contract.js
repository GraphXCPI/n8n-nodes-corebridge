/* Independent, synthetic fixtures transcribed from the PDF request contracts.
 * No endpoint definitions, dist files, private package files, or network required.
 */
// Exported without compiling source or executing assertions on require().
const bodyJsonFixtures = {
	searchContacts: { page: 1, pageSize: 10 },
	createContact: { FirstName: 'Fixture', LastName: 'Contact', Email: 'fixture@example.test', CustomerId: 7 },
	updateContact: { contactId: 9, firstName: 'Fixture' },
	createContactType: { Name: 'Fixture Type' },
	createCustomerLegacy: { CompanyName: 'Fixture', CompanyPhone: '5550100', FirstName: 'Fixture', LastName: 'Contact', Email: 'fixture@example.test', Address1: '1 Test Way', City: 'Test City', State: 'AZ', PostalCode: '85000', ReferralTypeId: 1 },
	createCustomerLocation: { accountId: 7, addressName: 'Fixture', address1: '1 Test Way', city: 'Test City', state: 'AZ', country: 'US' },
	updateCustomerLocation: { customerLocationId: 8, addressName: 'Fixture' },
	updateCustomerName: { Id: 7, NewCompanyName: 'Fixture' },
	createCustomerNote: 'Synthetic fixture note',
	createReferralType: { Name: 'Fixture Referral' },
	searchCustomers: { companyName: 'Fixture', includeRoyaltyOverrides: 'false', page: 1 },
	createCustomer: { companyName: 'Fixture', primaryAccountContact: { firstName: 'Fixture', lastName: 'Contact', email: 'fixture@example.test' } },
	updateCustomer: { accountId: 7, companyName: 'Fixture' },
	searchCustomerMergeHistory: { accountId: 7, Page: 1, PageSize: 10 },
	cancelEstimate: { orderId: 12, cancelNotes: 'Fixture cancellation' },
	createGenericOrder: { CbAccountId: 7, GenericOrderLineItems: [{ ProductDescription: 'Fixture product', ProductQuantity: 1 }] },
	searchOrders: { page: 1, pageSize: 10 },
	addOrderNotes: { orderId: 12, orderNotes: 'Fixture note' },
	updateOrderNotes: { orderId: 12, orderNotes: 'Fixture replacement' },
	updateOrderDueDate: { Id: 12, DueDate: '2026-10-01T12:00:00-07:00', TimeZone: 'US Mountain Standard Time' },
	searchRoyaltyOverrides: { accountId: 7, page: 1, pageSize: 50 },
	searchQuickProducts: { Name: 'Fixture', Page: 1, PageSize: 10 },
};

function runTests() {
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const filename = path.resolve(__dirname, '../nodes/CorebridgeBodyDefinitions.ts');
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { buildRequestBody, getBodyProperties, hasStructuredBody } = loaded.exports;

function build(operation, values = {}, parameters = {}) {
	const params = { bodyMode: 'fields', ...Object.fromEntries(Object.entries(values).map(([key, value]) => [`body_${operation}_${key}`, value])), ...parameters };
	return buildRequestBody({ getNodeParameter: (name, _index, fallback) => Object.hasOwn(params, name) ? params[name] : fallback }, operation, 0, { name: 'Fixture', type: 'test', typeVersion: 1, position: [0, 0], parameters: params });
}
function json(operation, value) { return build(operation, {}, { bodyMode: 'json', jsonBody: JSON.stringify(value) }); }
function canonical(operation, value) { return build(operation, {}, { additionalBodyJson: JSON.stringify(value) }); }
let checks = 0;
function equal(actual, expected) { assert.deepEqual(actual, expected); checks++; }
function rejects(fn, pattern) { assert.throws(fn, pattern); checks++; }

// Contacts PDF sections 5-7, 9. CustomerId on create; accountId on update.
equal(build('searchContacts', { email: 'fixture@example.test' }), { email: 'fixture@example.test', page: 1, pageSize: 10, sort: 'id', direction: 'asc' });
equal(build('createContact', { firstName: 'Fixture', lastName: 'Contact', email: 'fixture@example.test', customerId: 7, contactTypeId: 2 }), { FirstName: 'Fixture', LastName: 'Contact', Email: 'fixture@example.test', CustomerId: 7, contactTypeId: 2, IsActive: true });
equal(build('updateContact', { contactId: 9, firstName: 'Changed' }), { contactId: 9, firstName: 'Changed' });
equal(build('updateContact', { contactId: 9, customerId: 7, isActive: false, isPrimary: false }), { contactId: 9, accountId: 7, isActive: false, isPrimary: false });
equal(build('createContactType', { name: 'Fixture Type' }), { Name: 'Fixture Type' });
rejects(() => build('updateContact', { contactId: 9, accountId: 8, customerId: 7 }), /Conflicting/);
rejects(() => build('updateContact', { contactId: 9, isActive: false, isPrimary: true }), /inactive/);
rejects(() => canonical('createContact', { FirstName: 'X'.repeat(26), LastName: 'Fixture', Email: 'fixture@example.test', CustomerId: 7 }), /25 characters/);
rejects(() => build('createContact', { firstName: 'Fixture', lastName: 'Contact', email: 'invalid', customerId: 7 }), /email/i);
rejects(() => build('updateContact', { contactId: 9, otherPhoneType: 'fax' }), /documented option/);

// Customers PDF sections 13-21. All values are invented, not source sample data.
const legacy = { companyName: 'Fixture Company', companyPhone: '5550100', firstName: 'Fixture', lastName: 'Contact', email: 'fixture@example.test', address1: '1 Test Way', city: 'Test City', state: 'AZ', postalCode: '85000', referralTypeId: 1, accountStatusId: 0 };
equal(build('createCustomerLegacy', legacy), { CompanyName: 'Fixture Company', CompanyPhone: '5550100', FirstName: 'Fixture', LastName: 'Contact', Email: 'fixture@example.test', Address1: '1 Test Way', City: 'Test City', State: 'AZ', PostalCode: '85000', ReferralTypeId: 1, AccountStatusId: 0, IsActive: true });
const location = { accountId: 7, addressName: 'Fixture', address1: '1 Test Way', city: 'Test City', country: 'US', state: 'AZ' };
equal(build('createCustomerLocation', location), { ...location, IsDefault: false });
equal(build('updateCustomerLocation', { customerLocationId: 8, addressName: 'Changed' }), { customerLocationId: 8, addressName: 'Changed' });
equal(build('updateCustomerName', { id: 7, newCompanyName: 'Changed' }), { Id: 7, NewCompanyName: 'Changed' });
equal(build('createCustomerNote', { note: 'Synthetic note' }), 'Synthetic note');
equal(json('createCustomerNote', 'Synthetic JSON note'), 'Synthetic JSON note');
rejects(() => json('createCustomerNote', { note: 'Wrong shape' }), /JSON string/);
equal(build('createReferralType', { name: 'Fixture Referral', parentId: 2 }), { Name: 'Fixture Referral', ParentId: 2 });
equal(build('searchCustomers', { companyName: 'Fixture', isActive: false, includeRoyaltyOverrides: true }), { companyName: 'Fixture', isActive: false, includeRoyaltyOverrides: 'true', page: 1, pageSize: 10, sort: 'id', direction: 'asc' });
equal(build('searchCustomers'), { includeRoyaltyOverrides: 'false', page: 1, pageSize: 10, sort: 'id', direction: 'asc' });
const primary = { firstName: 'Fixture', lastName: 'Contact', email: 'fixture@example.test' };
equal(build('createCustomer', { companyName: 'Fixture', primaryAccountContact_fields: primary, billingAddress_fields: { address1: '1 Test Way', country: 'US' } }), { companyName: 'Fixture', primaryAccountContact: primary, billingAddress: { address1: '1 Test Way', country: 'US' } });
equal(build('createCustomer', { companyName: 'Fixture', primaryAccountContact: JSON.stringify(primary) }), { companyName: 'Fixture', primaryAccountContact: primary });
equal(build('createCustomer', { companyName: 'Fixture', primaryAccountContact: JSON.stringify({ ...primary, firstName: 'Old' }), primaryAccountContact_fields: primary }), { companyName: 'Fixture', primaryAccountContact: primary });
equal(build('createCustomer', { companyName: 'Fixture', primaryAccountContact: JSON.stringify(primary), primaryAccountContact_fields: { firstName: 'Ignored' }, primaryAccountContact_mode: 'json' }), { companyName: 'Fixture', primaryAccountContact: primary });
equal(build('updateCustomer', { accountId: 7, creditLimit: 0, taxExempt: false }), { accountId: 7, creditLimit: 0, taxExempt: false });
rejects(() => build('createCustomer', { companyName: 'Fixture', primaryAccountContact: '[]' }), /object/);
rejects(() => build('createCustomer', { companyName: 'Fixture', primaryAccountContact: '{}' }), /empty/);
rejects(() => build('updateCustomer'), /accountId is required/);
rejects(() => build('createCustomerLocation', { ...location, country: 'USA' }), /two-letter/);
rejects(() => build('updateCustomerLocation', { addressName: 'Missing ID' }), /required/);
rejects(() => canonical('searchCustomers', { includeRoyaltyOverrides: true }), /true.*false/);
rejects(() => build('updateCustomer', { accountId: 7, taxExempt: 'false' }), /boolean/);

// Merge history: Postman key/type evidence only; overview lists the route.
equal(build('searchCustomerMergeHistory', { accountId: 7, mergedOnOrAfter: '2026-01-01' }), { accountId: 7, mergedOnOrAfter: '2026-01-01', Page: 1, PageSize: 10, Sort: 'id', Direction: 'asc' });

// Quick Products PDF, POST Search request table: all 13 documented fields.
equal(build('searchQuickProducts', { quickProductId: 11, name: 'Fixture', externalId: 'fixture-id', productCategoryId: 2, quickProductCategoryId: 3, customerAccountId: 7, isGlobal: false, ecommerceEnabled: true, includeInactive: false, page: 2, pageSize: 25, sort: 'id', direction: 'desc' }), { QuickProductId: 11, Name: 'Fixture', ExternalId: 'fixture-id', ProductCategoryId: 2, QuickProductCategoryId: 3, CustomerAccountId: 7, IsGlobal: false, EcommerceEnabled: true, IncludeInactive: false, Page: 2, PageSize: 25, Sort: 'id', Direction: 'desc' });
equal(build('searchQuickProducts', { searchText: 'Fixture' }), { Name: 'Fixture', Page: 1, PageSize: 10, Sort: 'id', Direction: 'asc' });
rejects(() => build('searchQuickProducts', { locationId: 1 }), /not a customerAccountId alias/);

// Orders PDF sections 4-9 and Cancel Estimate. Quick Product and generic lines.
equal(build('cancelEstimate', { orderId: 12, cancelNotes: 'Fixture cancellation' }), { orderId: 12, cancelNotes: 'Fixture cancellation' });
equal(build('addOrderNotes', { orderId: 12, orderNotes: 'Fixture note' }), { orderId: 12, orderNotes: 'Fixture note', important: false });
equal(build('updateOrderNotes', { orderId: 12, orderNotes: 'Replacement', important: true }), { orderId: 12, orderNotes: 'Replacement', important: true });
equal(build('updateOrderDueDate', { id: 12, dueDate: '2026-10-01T12:00:00-07:00', timeZone: 'US Mountain Standard Time' }), { Id: 12, DueDate: '2026-10-01T12:00:00-07:00', TimeZone: 'US Mountain Standard Time' });
equal(build('searchOrders', { orderSalespersonId: 3, dateFilterFor: 'dueDate' }), { orderSalespersonId: 3, dateFilterFor: 'dueDate', includeImportDetails: false, includeProductDetails: false, page: 1, pageSize: 10, sort: 'id', direction: 'asc' });
const lines = [{ ExternalProductId: 'fixture-product', ProductQuantity: 2, UseQuickProductPricing: true, UnitPrice: 0 }];
equal(build('createGenericOrder', { cbAccountId: 7, genericOrderLineItems_fields: { items: lines }, orderShipping: 0 }), { CbAccountId: 7, IsEstimate: false, OrderShipping: 0, GenericOrderLineItems: lines });
equal(build('createGenericOrder', { cbAccountId: 7, genericOrderLineItems: JSON.stringify(lines), isEstimate: true }), { CbAccountId: 7, IsEstimate: true, GenericOrderLineItems: lines });
const nestedOrder = build('createGenericOrder', {
	account_fields: { CompanyName: 'Fixture', Contact: { EmailAddress: 'fixture@example.test' }, Addresses: { items: [{ StreetAddress1: '1 Test Way', CountryCode: 'US' }] } },
	genericOrderLineItems_fields: { items: [{ ProductDescription: 'Fixture', ProductQuantity: 1, Files: { items: [{ Type: 'Artwork', Link: 'https://example.test/fixture.pdf' }] }, PartIds: '[2]' }] },
	taxes_fields: { items: [{ Name: 'Fixture Tax', Rate: 0, Amount: 0 }] },
	orderShipments_fields: { items: [{ TrackingNumbers: 'fixture', OrderAddressItems: { items: [{ ExternalLineItemId: 'fixture-line', Qty: 1 }] } }] },
	orderPayments_fields: { items: [{ PaymentType: 'Other', CustomPaymentType: 'Fixture', Amount: 0 }] },
});
equal(nestedOrder.Account.Addresses, [{ StreetAddress1: '1 Test Way', CountryCode: 'US' }]);
equal(nestedOrder.GenericOrderLineItems[0].Files, [{ Type: 'Artwork', Link: 'https://example.test/fixture.pdf' }]);
equal(nestedOrder.OrderShipments[0].OrderAddressItems, [{ ExternalLineItemId: 'fixture-line', Qty: 1 }]);
equal(nestedOrder.Taxes, [{ Name: 'Fixture Tax', Rate: 0, Amount: 0 }]);
equal(nestedOrder.OrderPayments, [{ PaymentType: 'Other', CustomPaymentType: 'Fixture', Amount: 0 }]);
rejects(() => canonical('createGenericOrder', { GenericOrderLineItems: lines }), /CbAccountId/);
rejects(() => canonical('createGenericOrder', { CbAccountId: 7, GenericOrderLineItems: [] }), /at least one/);
rejects(() => canonical('createGenericOrder', { CbAccountId: 7, GenericOrderLineItems: [{ ProductQuantity: 1 }] }), /ProductDescription or ExternalProductId/);
for (const quantity of [0, -1, 1.5, '2']) rejects(() => canonical('createGenericOrder', { CbAccountId: 7, GenericOrderLineItems: [{ ExternalProductId: 'fixture', ProductQuantity: quantity }] }), /ProductQuantity/);
rejects(() => canonical('createGenericOrder', { CbAccountId: 7, GenericOrderLineItems: lines, OrderPayments: [{ PaymentType: 'Other' }] }), /CustomPaymentType/);
rejects(() => build('createGenericOrder', { cbAccountId: 7, genericOrderLineItems: JSON.stringify(lines), destinations: '[{}]' }), /Migrate explicitly/);
rejects(() => build('createGenericOrder', { cbAccountId: 7, genericOrderLineItems: JSON.stringify(lines), orderOriginationId: 2 }), /undocumented/);
rejects(() => build('cancelEstimate', { orderId: 12 }), /cancelNotes/);
rejects(() => build('addOrderNotes', { orderId: 12, orderNotes: 'x'.repeat(2001) }), /2000/);
rejects(() => build('updateOrderDueDate', { id: 12, dueDate: '2026-10-01T12:00:00', timeZone: 'UTC' }), /timezone/);

// Royalty PDF section 2: default size 50, sort accountId; no firm documented max.
equal(build('searchRoyaltyOverrides', { accountId: 7 }), { accountId: 7, page: 1, pageSize: 50, sort: 'accountId', direction: 'asc' });

// Fields validation runs after Additional JSON merge. JSON mode is shape-only.
rejects(() => build('searchContacts', {}, { additionalBodyJson: '{"pageSize":51}' }), /at most 50/);
rejects(() => build('searchContacts', { page: 0 }), /at least 1/);
rejects(() => build('searchContacts', { page: 1.5 }), /integer/);
rejects(() => build('updateContact', { contactId: 0 }), /greater than zero/);
for (const bad of ['null', '[]', 'false', '42', '"text"']) {
	rejects(() => build('searchContacts', {}, { bodyMode: 'json', jsonBody: bad }), /object/);
	rejects(() => build('searchContacts', {}, { additionalBodyJson: bad }), /object/);
}
for (const source of ['jsonBody', 'additionalBodyJson']) {
	try { build('searchContacts', {}, { ...(source === 'jsonBody' ? { bodyMode: 'json' } : {}), [source]: '{"PRIVATE_SENTINEL":invalid}' }); assert.fail('Expected parse error'); }
	catch (error) { assert.match(error.message, /expected valid JSON/); assert.ok(!error.message.includes('PRIVATE_SENTINEL')); checks++; }
}
try { build('createCustomer', { companyName: 'Fixture', primaryAccountContact: '{"PRIVATE_SENTINEL":invalid}' }); assert.fail('Expected nested parse error'); }
catch (error) { assert.match(error.message, /expected valid JSON/); assert.ok(!error.message.includes('PRIVATE_SENTINEL')); checks++; }
equal(build('searchContacts', {}, { bodyMode: undefined, jsonBody: '{"email":"fixture@example.test","page":2}' }), { email: 'fixture@example.test', page: 2 });
const liveExtension = { CompanyName: 'Fixture', IncludeRoyaltyOverrides: true, FutureProperty: { enum: 'vendor-supported', amount: '0' }, PageSize: 100 };
equal(json('searchCustomers', liveExtension), liveExtension);
equal(build('searchCustomers', {}, { bodyMode: undefined, jsonBody: liveExtension }), liveExtension);
equal(json('createContact', {}), {});
equal(json('createGenericOrder', { Destinations: [{ FutureProperty: true }] }), { Destinations: [{ FutureProperty: true }] });
equal(json('createCustomerNote', ''), '');
rejects(() => build('createCustomerNote', { note: '' }), /non-empty/);
for (const [operation, fixture] of Object.entries(bodyJsonFixtures)) {
	equal(json(operation, fixture), fixture);
	if (operation !== 'createCustomerNote') canonical(operation, fixture);
}

const operations = ['searchContacts', 'createContact', 'updateContact', 'createContactType', 'createCustomerLegacy', 'createCustomerLocation', 'updateCustomerLocation', 'updateCustomerName', 'createCustomerNote', 'createReferralType', 'searchCustomers', 'createCustomer', 'updateCustomer', 'searchCustomerMergeHistory', 'cancelEstimate', 'createGenericOrder', 'searchOrders', 'addOrderNotes', 'updateOrderNotes', 'updateOrderDueDate', 'searchRoyaltyOverrides', 'searchQuickProducts'];
for (const operation of operations) { assert.equal(hasStructuredBody(operation), true); checks++; }
const props = getBodyProperties(operations);
for (const [name, type] of [['body_createCustomer_primaryAccountContact_fields', 'collection'], ['body_createGenericOrder_genericOrderLineItems_fields', 'fixedCollection'], ['body_createGenericOrder_orderPayments_fields', 'fixedCollection'], ['body_createGenericOrder_orderShipments_fields', 'fixedCollection'], ['body_updateContact_isPrimary', 'options']]) {
	assert.equal(props.find((p) => p.name === name)?.type, type); checks++;
}
console.log(`Body document contract: ${checks} checks passed across ${operations.length} operations (source-only, no build).`);
}

module.exports = { bodyJsonFixtures, runTests };
if (require.main === module) runTests();
