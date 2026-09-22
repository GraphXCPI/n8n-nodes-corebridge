const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Compile only the owned module in memory: no shared dist build or body-agent dependency.
const filename = path.resolve(__dirname, '../nodes/CorebridgeEndpointDefinitions.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const sourceModule = new Module(filename, module);
sourceModule.filename = filename;
sourceModule.paths = module.paths;
sourceModule.require = (id) => {
	assert.equal(id, './CorebridgeBodyDefinitions');
	return { getBodyProperties: () => [] };
};
sourceModule._compile(compiled.outputText, filename);
const { endpoints, getEndpoint, getEndpointParameterValues, getCorebridgeProperties } = sourceModule.exports;

// Independently transcribed from technical PDF endpoint/query sections, with explicit
// Postman-only compatibility routes. No private request/response examples are fixtures.
// Columns: saved operation | method | relative path | saved name>wire name=value.
// A leading @ denotes a path value; values are synthetic, not extracted examples.
const contracts = `
getContacts|GET|ExContact/Get|pageIndex>intPageIndex=2,pageSize=7
getContactById|GET|ExContact/GetContactById/{contactId}|@contactId=731
getContactsByEmail|GET|ExContact/GetContactsByEmailAddress/{emailAddress}|@emailAddress=a+b@example.test
getContactsModifiedAfter|GET|ExContact/GetContactsModifiedAfterDate/{days}|@days=9
searchContacts|POST|ExContact/SearchContacts_v2|
createContact|POST|ExContact/Create|
updateContact|POST|ExContact/UpdateContact|
updateContactType|POST|ExContact/UpdateContactTypeForContact|contactId=731,contactTypeId=12
createContactType|POST|ExContact/CreateContactType|
getContactTypes|GET|ExContact/GetAvailableContactTypes|
getContactJobAuthorities|GET|ExContact/GetAvailableContactJobAuthority|
getCustomers|GET|ExCustomer/Get|pageIndex>intPageIndex=2,pageSize=7
getCustomerByName|GET|ExCustomer/GetCustomerByName/{customerName}|@customerName=Synthetic / Client
getCustomerById|GET|ExCustomer/GetCustomerById/{accountId}|@accountId=731
getCustomerLocations|GET|ExCustomer/GetCustomerLocationsByCustomerId/{accountId}|@accountId=731
getCustomerLocationByAddressId|GET|ExCustomer/GetCustomerLocationByAddressId/{addressId}|@addressId=732
getCustomersByPhone|GET|ExCustomer/GetCustomersByPhoneNumber/{phoneNumber}|@phoneNumber=+15550100731
getCustomersCreatedAfter|GET|ExCustomer/GetCustomersCreatedAfterDate|days=9
getCustomersCreatedBetween|GET|ExCustomer/GetCustomersCreatedBetweenDates|beginDays=9,endDays=0,page=2,pageSize=7
getReferralTypes|GET|ExCustomer/GetAvailableReferralTypes|
getIndustryTypes|GET|ExCustomer/GetIndustryTypes|
getAccountTypes|GET|ExCustomer/GetAccountTypes|
getCustomerTerms|GET|ExCustomer/GetCustomerTerms|
createCustomerLegacy|POST|ExCustomer/Create|
createCustomerLocation|POST|ExCustomer/CreateCustomerLocation|
updateCustomerLocation|POST|ExCustomer/UpdateCustomerLocation|
updateCustomerName|POST|ExCustomer/UpdateCustomerName|
createCustomerNote|POST|ExCustomer/CreateCustomerNote|customerId=731
createReferralType|POST|ExCustomer/CreateReferralType|
searchCustomers|POST|ExCustomer/SearchCustomers_v2|
createCustomer|POST|ExCustomer/CreateCustomer_v2|
updateCustomer|POST|ExCustomer/UpdateCustomer_v2|
getCustomerMergeHistoryById|GET|ExCustomerMerge/GetCustomerMergeHistoryById|id=731
searchCustomerMergeHistory|POST|ExCustomerMerge/CustomerMergeHistory_v2|
getOrderStatement|GET|ExDocument/OrderStatementByOrderId|orderId=731
getCustomerStatement|GET|ExDocument/CustomerStatementByCustomerId|customerId=731
getWorkOrder|GET|ExDocument/WorkOrder|orderId=731
getWorkOrderProduct|GET|ExDocument/WorkOrderProduct|orderProductId=732
getGoalsForLocations|GET|ExGoal/GetGoalsForLocations|year>intYear=2027,month>intMonth=8
getGoalsForSalespeople|GET|ExGoal/GetGoalsForSalePeople|year>intYear=2027,month>intMonth=8
getCompanyCurrent|GET|ExGoal/GetCompanyCurrent|locationId=13,hasShipping=false,hasPostage=true,hasTax=false,refreshData=true
getCompanyWideTotals|GET|ExGoal/GetCompanyWideTotals|locationId=13,hasShipping=false,hasPostage=true,hasTax=false,refreshData=true
getGroupCompareCurrent|GET|ExGoal/GetGroupCompareCurrent|reportType=270,locationId=13,hasShipping=false,hasPostage=true,hasTax=false,refreshData=true
getGroupCompareTotal|GET|ExGoal/GetGroupCompareTotal|reportType=180,locationId=13,hasShipping=false,hasPostage=true,hasTax=false,refreshData=true
getSalesMonitorTotals|GET|ExGoal/GetSalesMonitorTotals|date=2027-08-19T08:30:00-07:00
getEstimate|GET|ExEstimate/Get|page=2,pageSize=7,sort=EstimateNumber,direction=desc
cancelEstimate|POST|ExEstimate/CancelEstimate|
convertEstimate|GET|ExEstimate/ConvertEstimate|orderId>id=731
convertEstimatePost|POST|ExEstimate/ConvertEstimate|orderId>id=731
getOrders|GET|ExOrder|pageIndex>page=2,pageSize=7
getOrderById|GET|ExOrder/{orderId}|@orderId=731
getCustomerPortalLink|GET|ExOrder/GetCustomerPortalLink/{orderId}|@orderId=731
createGenericOrder|POST|ExOrder/CreateGenericOrder|
searchOrders|POST|ExOrder/SearchOrders_v2|
addOrderNotes|POST|ExOrder/AddOrderNotes|
getOrderNotes|GET|ExOrder/GetOrderNotes|orderId=731
updateOrderNotes|POST|ExOrder/UpdateOrderNotes|
deleteOrderNotes|DELETE|ExOrder/DeleteOrderNotes|orderId=731
updateOrderDueDate|POST|ExOrder/UpdateOrderDueDate|
getOrderHistory|GET|ExOrder/OrderHistory|orderId=731,orderHistoryTypeId=13,page=2,pageSize=7
getOrderHistoryTypes|GET|ExOrder/OrderHistoryTypes|
getOrderDetailById|GET|ExOrderDetail/GetExOrderDetailById|orderId>id=731
getOrderByInvoiceNumber|GET|ExOrderDetail/GetExOrderByInvoiceNumber|invoiceNumber>id=SYNTH-I731
getOrderByEstimateNumber|GET|ExOrderDetail/GetExOrderByEstimateNumber|estimateNumber>id=SYNTH-E731
getOrdersByStatus|GET|ExOrderDetail/GetOrdersByStatus|statusName>listOfStatus=WIP
getOrdersByStatusAndDate|GET|ExOrderDetail/GetOrdersByStatusAndDate|statusName>status=WIP,days=9
getOrderAddress|GET|ExShipping/GetOrderAddress/{orderAddressId}|@orderAddressId=732
getOrderProducts|GET|ExOrderProduct|pageIndex>page=2,pageSize=7
getOrderProductById|GET|ExOrderProduct|orderProductId>id=732
getOrderProductByPathId|GET|ExOrderProduct/{orderProductId}|@orderProductId=732
getOrderProductParts|GET|ExOrderProductPart|pageIndex>page=2,pageSize=7
getOrderProductPartById|GET|ExOrderProductPart/{orderProductPartId}|@orderProductPartId=733
getAllStatusCbName|GET|ExOrderProduct/GetAllStatusCBName|
getAllStatus|GET|ExOrderProduct/GetAllStatus|
updateProductStatus|POST|ExOrderProduct/UpdateProductStatusForId|orderProductId=732,statusName>newOrderProductStatusName=WIP
getAvailableSubStatus|GET|ExOrderProduct/GetAvailableSubStatusForStatus|statusName>orderProductStatusName=WIP
updateProductSubstatus|POST|ExOrderProduct/UpdateProductSubStatusForId|orderProductId=732,substatusTag>tag=SYNTH-TAG
updateProductFollowUpDueDate|POST|ExOrderProduct/UpdateOrderProductFollowUpDueDate|orderProductId=732,followUpDateText=2027-08-19 08:30:00
updateProductDesignDueDate|POST|ExOrderProduct/UpdateOrderProductDesignDueDate|orderProductId=732,designDueDateText=2027-08-19 08:30:00
searchQuickProducts|POST|ExQuickProduct/Search|
getQuickProductById|GET|ExQuickProduct/GetById/{quickProductId}|@quickProductId=734,includeInactive=false
getRoyaltyPlans|GET|ExRoyalty/RoyaltyPlans|
searchRoyaltyOverrides|POST|ExRoyalty/RoyaltyPlansCustomerOverrides|
getEmployees|GET|ExEmployee/GetEmployees|email>emailAddress=staff@example.test
getReconciliationDetailById|GET|ExReconciliation/ReconciliationDetailById|id=735
getLocations|GET|ExSalesCenter/GetLocations|
getTaxGroups|GET|ExSalesCenter/GetTaxGroups|locationId=13
getSalespersons|GET|ExSalesperson/GetSalespersons|email>emailAddress=sales@example.test,includeInactive=true
`.trim().split('\n');

const seen = new Set();
for (const row of contracts) {
	const [operation, method, route, spec] = row.split('|');
	assert.ok(!seen.has(operation), `Duplicate fixture: ${operation}`);
	seen.add(operation);
	const endpoint = getEndpoint(operation);
	assert.ok(endpoint, operation);
	assert.equal(endpoint.method, method, `${operation} method`);
	assert.equal(endpoint.path, route, `${operation} path`);
	const inputs = {};
	const expected = { path: {}, query: {} };
	for (const token of spec ? spec.split(',') : []) {
		const [names, literal] = token.split('=');
		const isPath = names.startsWith('@');
		const [savedName, alias] = names.replace(/^@/, '').split('>');
		const value = /^(true|false)$/.test(literal) ? literal === 'true' : /^\d+$/.test(literal) ? Number(literal) : literal;
		inputs[savedName] = value;
		expected[isPath ? 'path' : 'query'][alias || savedName] = value;
	}
	assert.deepEqual(getEndpointParameterValues(endpoint, (name) => inputs[name]), expected, operation);
	// Exact parameter surface detects undocumented additions, not just missing values.
	assert.deepEqual(endpoint.parameters?.map((p) => p.name).sort() ?? [], Object.keys(inputs).sort(), `${operation} parameter surface`);
}
assert.deepEqual([...seen].sort(), endpoints.map((e) => e.operation).sort(), 'Every operation needs a document-derived fixture');

function values(operation, input) {
	return getEndpointParameterValues(getEndpoint(operation), (name) => input[name]);
}
function defaults(operation) {
	return Object.fromEntries((getEndpoint(operation).parameters ?? []).map((p) => [p.name, p.default]));
}
for (const [operation, wire] of [
	['getContacts', 'intPageIndex'], ['getCustomers', 'intPageIndex'],
	['getOrders', 'page'], ['getOrderProducts', 'page'], ['getOrderProductParts', 'page'],
]) {
	assert.deepEqual(values(operation, { pageIndex: 0, pageSize: 0 }).query, { [wire]: 0 }, `${operation}: retain page zero, omit legacy size sentinel`);
	assert.deepEqual(values(operation, defaults(operation)).query, { [wire]: 0, pageSize: 10 });
	assert.throws(() => values(operation, { pageIndex: -1 }), /integer/);
	assert.throws(() => values(operation, { pageIndex: 1.5 }), /integer/);
}
assert.deepEqual(values('getEstimate', defaults('getEstimate')).query, { page: 1, pageSize: 10, sort: 'Id', direction: 'asc' });
assert.deepEqual(values('getOrderHistory', { ...defaults('getOrderHistory'), orderId: 731 }).query, { orderId: 731, page: 1, pageSize: 50 });
assert.throws(() => values('getOrderHistory', { orderId: 731, page: 0 }), /integer/);
assert.throws(() => values('getOrderHistory', { orderId: 731, pageSize: 51 }), /integer/);
assert.deepEqual(values('getCustomersCreatedBetween', { beginDays: 9, endDays: 0, page: 0 }).query, { beginDays: 9, endDays: 0, page: 0 });
assert.deepEqual(values('getOrdersByStatus', { statusName: 'WIP,BUILT' }).query, { listOfStatus: 'WIP,BUILT' });
assert.deepEqual(values('getOrdersByStatusAndDate', { statusName: 'WIP', days: 0 }).query, { status: 'WIP', days: 0 });
for (const operation of ['getCustomersCreatedBetween', 'getOrdersByStatusAndDate']) {
	const input = operation === 'getCustomersCreatedBetween' ? { beginDays: 9, endDays: 0 } : { statusName: 'WIP', days: 9 };
	for (const name of ['startDate', 'endDate']) {
		assert.throws(() => values(operation, { ...input, [name]: '2027-08-19' }), /never converted/);
		assert.throws(() => values(operation, { ...input, queryParameters: { parameters: [{ name, value: '2027-08-19' }] } }), /never converted/);
	}
}
for (const input of [{ beginDays: 0, endDays: 0 }, { beginDays: 2, endDays: 9 }]) {
	assert.throws(() => values('getCustomersCreatedBetween', input), /endDays must be less/);
}
for (const days of [-1, 0.5, '2027-08-19', NaN, Infinity, true, ' ']) {
	assert.throws(() => values('getOrdersByStatusAndDate', { statusName: 'WIP', days }), /integer/);
}
assert.throws(() => values('getCustomersCreatedBetween', {}), /beginDays is required/);
assert.throws(() => values('getOrdersByStatusAndDate', { statusName: 'WIP' }), /days is required/);
assert.deepEqual(values('getEmployees', { email: 'staff@example.test', includeInactive: true }).query, { emailAddress: 'staff@example.test' });
assert.deepEqual(values('getSalesMonitorTotals', { locationId: 13, hasShipping: true, refreshData: true }).query, {});
assert.equal(defaults('getGroupCompareCurrent').reportType, 210);
assert.equal(defaults('getGroupCompareTotal').reportType, 10);
for (const operation of ['getGroupCompareCurrent', 'getGroupCompareTotal', 'getCompanyCurrent', 'getCompanyWideTotals']) {
	const query = values(operation, defaults(operation)).query;
	assert.equal(query.hasShipping, true);
	assert.equal(query.hasPostage, true);
	assert.equal(query.hasTax, false);
	assert.equal(query.refreshData, false);
}
const properties = getCorebridgeProperties('customers');
for (const name of ['startDate', 'endDate']) {
	assert.ok(properties.some((p) => p.name === name && p.type === 'hidden'), 'Legacy saved dates must remain readable for the migration guard');
}
console.log(`CoreBridge document query/path contracts passed: ${seen.size} operations plus pagination, aliases, and date migration guards (source-only; no shared build).`);
