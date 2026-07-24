/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-boolean */
import type { IDataObject, INodeProperties } from 'n8n-workflow';

import { getBodyProperties } from './CorebridgeBodyDefinitions';

export type CorebridgeDomain =
	| 'contacts'
	| 'customers'
	| 'documents'
	| 'goals'
	| 'orders'
	| 'products'
	| 'royalty'
	| 'sales'
	| 'apiRequest';

export type CorebridgeResponseFormat = 'json' | 'text';
export type CorebridgeMethod = 'DELETE' | 'GET' | 'POST';

type ParameterType = 'boolean' | 'number' | 'options' | 'string';

export type CorebridgeParameter = {
	name: string;
	apiName?: string;
	displayName: string;
	location: 'path' | 'query';
	type?: ParameterType;
	default?: boolean | number | string;
	required?: boolean;
	description?: string;
	options?: Array<{ name: string; value: string }>;
};

export type CorebridgeEndpoint = {
	domain: CorebridgeDomain;
	operation: string;
	name: string;
	description: string;
	method: CorebridgeMethod;
	path: string;
	body?: boolean;
	parameters?: CorebridgeParameter[];
	responseFormat?: CorebridgeResponseFormat;
};

const pathNumber = (name: string, displayName: string, apiName?: string): CorebridgeParameter => ({
	name,
	apiName,
	displayName,
	location: 'path',
	type: 'number',
	default: 0,
	required: true,
});
const pathString = (name: string, displayName: string, apiName?: string): CorebridgeParameter => ({
	name,
	apiName,
	displayName,
	location: 'path',
	default: '',
	required: true,
});
const queryNumber = (name: string, displayName: string, required = false, apiName?: string): CorebridgeParameter => ({
	name,
	apiName,
	displayName,
	location: 'query',
	type: 'number',
	default: 0,
	required,
});
const queryString = (name: string, displayName: string, required = false, apiName?: string): CorebridgeParameter => ({
	name,
	apiName,
	displayName,
	location: 'query',
	default: '',
	required,
});
const queryBoolean = (name: string, displayName: string, defaultValue = false, apiName?: string): CorebridgeParameter => ({
	name,
	apiName,
	displayName,
	location: 'query',
	type: 'boolean',
	default: defaultValue,
});

const paging: CorebridgeParameter[] = [
	queryNumber('pageIndex', 'Page Index', false, 'intPageIndex'),
	queryNumber('pageSize', 'Page Size'),
];
const goalPeriod: CorebridgeParameter[] = [
	queryNumber('year', 'Year', false, 'intYear'),
	queryNumber('month', 'Month', false, 'intMonth'),
];
const goalTotals: CorebridgeParameter[] = [
	queryNumber('locationId', 'Location ID'),
	queryBoolean('hasShipping', 'Include Shipping', true),
	queryBoolean('hasPostage', 'Include Postage', true),
	queryBoolean('hasTax', 'Include Tax'),
	queryBoolean('refreshData', 'Refresh Data'),
];

export const endpoints: CorebridgeEndpoint[] = [
	// Contacts
	{ domain: 'contacts', operation: 'getContacts', name: 'Get Contacts', description: 'Get a paginated contact list', method: 'GET', path: 'ExContact', parameters: paging },
	{ domain: 'contacts', operation: 'getContactById', name: 'Get Contact by ID', description: 'Get a contact by ID', method: 'GET', path: 'ExContact/GetContactById/{contactId}', parameters: [pathNumber('contactId', 'Contact ID')] },
	{ domain: 'contacts', operation: 'getContactsByEmail', name: 'Get Contacts by Email', description: 'Get contacts by email address', method: 'GET', path: 'ExContact/GetContactsByEmailAddress/{emailAddress}', parameters: [pathString('emailAddress', 'Email Address')] },
	{ domain: 'contacts', operation: 'getContactsModifiedAfter', name: 'Get Contacts Modified After', description: 'Get contacts modified within a number of days', method: 'GET', path: 'ExContact/GetContactsModifiedAfterDate/{days}', parameters: [pathNumber('days', 'Days')] },
	{ domain: 'contacts', operation: 'searchContacts', name: 'Search Contacts', description: 'Search contacts with filters and pagination', method: 'POST', path: 'ExContact/SearchContacts_v2', body: true },
	{ domain: 'contacts', operation: 'createContact', name: 'Create Contact', description: 'Create a contact', method: 'POST', path: 'ExContact/Create', body: true },
	{ domain: 'contacts', operation: 'updateContact', name: 'Update Contact', description: 'Update a contact', method: 'POST', path: 'ExContact/UpdateContact', body: true },
	{ domain: 'contacts', operation: 'updateContactType', name: 'Update Contact Type', description: 'Assign a contact type', method: 'POST', path: 'ExContact/UpdateContactTypeForContact', parameters: [queryNumber('contactId', 'Contact ID', true), queryNumber('contactTypeId', 'Contact Type ID', true)] },
	{ domain: 'contacts', operation: 'createContactType', name: 'Create Contact Type', description: 'Create a contact type', method: 'POST', path: 'ExContact/CreateContactType', body: true },
	{ domain: 'contacts', operation: 'getContactTypes', name: 'Get Contact Types', description: 'Get available contact types', method: 'GET', path: 'ExContact/GetAvailableContactTypes' },
	{ domain: 'contacts', operation: 'getContactJobAuthorities', name: 'Get Contact Job Authorities', description: 'Get available contact job authority values', method: 'GET', path: 'ExContact/GetAvailableContactJobAuthority' },

	// Customers
	{ domain: 'customers', operation: 'getCustomers', name: 'Get Customers', description: 'Get a paginated customer list', method: 'GET', path: 'ExCustomer', parameters: paging },
	{ domain: 'customers', operation: 'getCustomerByName', name: 'Get Customer by Name', description: 'Get a customer by company name', method: 'GET', path: 'ExCustomer/GetCustomerByName/{customerName}', parameters: [pathString('customerName', 'Customer Name')] },
	{ domain: 'customers', operation: 'getCustomerById', name: 'Get Customer by ID', description: 'Get a customer by account ID', method: 'GET', path: 'ExCustomer/GetCustomerById/{accountId}', parameters: [pathNumber('accountId', 'Account ID')] },
	{ domain: 'customers', operation: 'getCustomerLocations', name: 'Get Customer Locations', description: 'Get customer locations by account ID', method: 'GET', path: 'ExCustomer/GetCustomerLocationsByCustomerId/{accountId}', parameters: [pathNumber('accountId', 'Account ID')] },
	{ domain: 'customers', operation: 'getCustomerLocationByAddressId', name: 'Get Customer Location by Address ID', description: 'Get a customer location by address ID', method: 'GET', path: 'ExCustomer/GetCustomerLocationByAddressId/{addressId}', parameters: [pathNumber('addressId', 'Address ID')] },
	{ domain: 'customers', operation: 'getCustomersByPhone', name: 'Get Customers by Phone', description: 'Get customers by phone number', method: 'GET', path: 'ExCustomer/GetCustomersByPhoneNumber/{phoneNumber}', parameters: [pathString('phoneNumber', 'Phone Number')] },
	{ domain: 'customers', operation: 'getCustomersCreatedAfter', name: 'Get Customers Created After', description: 'Get customers created within a number of days', method: 'GET', path: 'ExCustomer/GetCustomersCreatedAfterDate', parameters: [queryNumber('days', 'Days', true)] },
	{ domain: 'customers', operation: 'getCustomersCreatedBetween', name: 'Get Customers Created Between Dates', description: 'Get customers created between dates', method: 'GET', path: 'ExCustomer/GetCustomersCreatedBetweenDates', parameters: [queryString('startDate', 'Start Date', true), queryString('endDate', 'End Date', true)] },
	{ domain: 'customers', operation: 'getReferralTypes', name: 'Get Referral Types', description: 'Get available referral types', method: 'GET', path: 'ExCustomer/GetAvailableReferralTypes' },
	{ domain: 'customers', operation: 'getIndustryTypes', name: 'Get Industry Types', description: 'Get industry types', method: 'GET', path: 'ExCustomer/GetIndustryTypes' },
	{ domain: 'customers', operation: 'getAccountTypes', name: 'Get Account Types', description: 'Get account types', method: 'GET', path: 'ExCustomer/GetAccountTypes' },
	{ domain: 'customers', operation: 'getCustomerTerms', name: 'Get Customer Terms', description: 'Get customer terms', method: 'GET', path: 'ExCustomer/GetCustomerTerms' },
	{ domain: 'customers', operation: 'createCustomerLegacy', name: 'Create Customer (Legacy)', description: 'Create a customer using the legacy contract', method: 'POST', path: 'ExCustomer/Create', body: true },
	{ domain: 'customers', operation: 'createCustomerLocation', name: 'Create Customer Location', description: 'Create a customer location', method: 'POST', path: 'ExCustomer/CreateCustomerLocation', body: true },
	{ domain: 'customers', operation: 'updateCustomerLocation', name: 'Update Customer Location', description: 'Update a customer location', method: 'POST', path: 'ExCustomer/UpdateCustomerLocation', body: true },
	{ domain: 'customers', operation: 'updateCustomerName', name: 'Update Customer Name', description: 'Update a customer company name', method: 'POST', path: 'ExCustomer/UpdateCustomerName', body: true },
	{ domain: 'customers', operation: 'createCustomerNote', name: 'Create Customer Note', description: 'Create a customer note', method: 'POST', path: 'ExCustomer/CreateCustomerNote', body: true, parameters: [queryNumber('customerId', 'Customer ID', true)] },
	{ domain: 'customers', operation: 'createReferralType', name: 'Create Referral Type', description: 'Create a referral type', method: 'POST', path: 'ExCustomer/CreateReferralType', body: true },
	{ domain: 'customers', operation: 'searchCustomers', name: 'Search Customers', description: 'Search customers with filters and pagination', method: 'POST', path: 'ExCustomer/SearchCustomers_v2', body: true },
	{ domain: 'customers', operation: 'createCustomer', name: 'Create Customer (V2)', description: 'Create a customer using the V2 contract', method: 'POST', path: 'ExCustomer/CreateCustomer_v2', body: true },
	{ domain: 'customers', operation: 'updateCustomer', name: 'Update Customer (V2)', description: 'Update a customer using the V2 contract', method: 'POST', path: 'ExCustomer/UpdateCustomer_v2', body: true },
	{ domain: 'customers', operation: 'getCustomerMergeHistoryById', name: 'Get Customer Merge History by ID', description: 'Get customer merge history by ID', method: 'GET', path: 'ExCustomerMerge/GetCustomerMergeHistoryById', parameters: [queryString('id', 'ID', true)] },
	{ domain: 'customers', operation: 'searchCustomerMergeHistory', name: 'Search Customer Merge History', description: 'Search customer merge history', method: 'POST', path: 'ExCustomerMerge/CustomerMergeHistory_v2', body: true },

	// Documents
	{ domain: 'documents', operation: 'getOrderStatement', name: 'Get Order Statement', description: 'Get an order statement PDF', method: 'GET', path: 'ExDocument/OrderStatementByOrderId', parameters: [queryNumber('orderId', 'Order ID', true)], responseFormat: 'text' },
	{ domain: 'documents', operation: 'getCustomerStatement', name: 'Get Customer Statement', description: 'Get a customer statement PDF', method: 'GET', path: 'ExDocument/CustomerStatementByCustomerId', parameters: [queryNumber('customerId', 'Customer ID', true)], responseFormat: 'text' },
	{ domain: 'documents', operation: 'getWorkOrder', name: 'Get Work Order', description: 'Get a work order PDF', method: 'GET', path: 'ExDocument/WorkOrder', parameters: [queryNumber('orderId', 'Order ID', true)], responseFormat: 'text' },
	{ domain: 'documents', operation: 'getWorkOrderProduct', name: 'Get Work Order Product', description: 'Get a work order product PDF', method: 'GET', path: 'ExDocument/WorkOrderProduct', parameters: [queryNumber('orderProductId', 'Order Product ID', true)], responseFormat: 'text' },

	// Goals
	{ domain: 'goals', operation: 'getGoalsForLocations', name: 'Get Goals for Locations', description: 'Get location goals and actuals', method: 'GET', path: 'ExGoal/GetGoalsForLocations', parameters: goalPeriod },
	{ domain: 'goals', operation: 'getGoalsForSalespeople', name: 'Get Goals for Salespeople', description: 'Get salesperson goals and actuals', method: 'GET', path: 'ExGoal/GetGoalsForSalePeople', parameters: goalPeriod },
	{ domain: 'goals', operation: 'getCompanyCurrent', name: 'Get Company Current', description: 'Get current company sales report values', method: 'GET', path: 'ExGoal/GetCompanyCurrent', parameters: goalTotals },
	{ domain: 'goals', operation: 'getCompanyWideTotals', name: 'Get Company-Wide Totals', description: 'Get company totals by period', method: 'GET', path: 'ExGoal/GetCompanyWideTotals', parameters: goalTotals },
	{ domain: 'goals', operation: 'getGroupCompareCurrent', name: 'Get Group Compare Current', description: 'Get current group comparison values', method: 'GET', path: 'ExGoal/GetGroupCompareCurrent', parameters: goalTotals },
	{ domain: 'goals', operation: 'getGroupCompareTotal', name: 'Get Group Compare Total', description: 'Get total group comparison values', method: 'GET', path: 'ExGoal/GetGroupCompareTotal', parameters: goalTotals },
	{ domain: 'goals', operation: 'getSalesMonitorTotals', name: 'Get Sales Monitor Totals', description: 'Get sales monitor totals', method: 'GET', path: 'ExGoal/GetSalesMonitorTotals', parameters: goalTotals },

	// Orders and estimates
	{ domain: 'orders', operation: 'getEstimate', name: 'Get Estimates', description: 'Get estimates', method: 'GET', path: 'ExEstimate/Get', parameters: [queryString('direction', 'Direction')] },
	{ domain: 'orders', operation: 'cancelEstimate', name: 'Cancel Estimate', description: 'Cancel an estimate', method: 'POST', path: 'ExEstimate/CancelEstimate', body: true },
	{ domain: 'orders', operation: 'convertEstimate', name: 'Convert Estimate (GET Compatibility)', description: 'Convert an estimate using the Postman GET contract', method: 'GET', path: 'ExEstimate/ConvertEstimate', parameters: [queryNumber('orderId', 'Order ID', true, 'id')] },
	{ domain: 'orders', operation: 'convertEstimatePost', name: 'Convert Estimate (POST)', description: 'Convert an estimate using the technical-reference POST contract', method: 'POST', path: 'ExEstimate/ConvertEstimate', parameters: [queryNumber('orderId', 'Order ID', true, 'id')] },
	{ domain: 'orders', operation: 'getOrders', name: 'Get Orders', description: 'Get a paginated order list', method: 'GET', path: 'ExOrder', parameters: paging },
	{ domain: 'orders', operation: 'getOrderById', name: 'Get Order by ID', description: 'Get an order by ID', method: 'GET', path: 'ExOrder/{orderId}', parameters: [pathNumber('orderId', 'Order ID')] },
	{ domain: 'orders', operation: 'getCustomerPortalLink', name: 'Get Customer Portal Link', description: 'Get a time-limited customer portal link', method: 'GET', path: 'ExOrder/GetCustomerPortalLink/{orderId}', parameters: [pathNumber('orderId', 'Order ID')] },
	{ domain: 'orders', operation: 'createGenericOrder', name: 'Create Generic Order', description: 'Create an order or estimate', method: 'POST', path: 'ExOrder/CreateGenericOrder', body: true },
	{ domain: 'orders', operation: 'searchOrders', name: 'Search Orders', description: 'Search orders with filters and pagination', method: 'POST', path: 'ExOrder/SearchOrders_v2', body: true },
	{ domain: 'orders', operation: 'addOrderNotes', name: 'Add Order Notes', description: 'Append notes to an order', method: 'POST', path: 'ExOrder/AddOrderNotes', body: true },
	{ domain: 'orders', operation: 'getOrderNotes', name: 'Get Order Notes', description: 'Get order notes', method: 'GET', path: 'ExOrder/GetOrderNotes', parameters: [queryNumber('orderId', 'Order ID', true)] },
	{ domain: 'orders', operation: 'updateOrderNotes', name: 'Update Order Notes', description: 'Replace order notes', method: 'POST', path: 'ExOrder/UpdateOrderNotes', body: true },
	{ domain: 'orders', operation: 'deleteOrderNotes', name: 'Delete Order Notes', description: 'Delete all notes for an order', method: 'DELETE', path: 'ExOrder/DeleteOrderNotes', parameters: [queryNumber('orderId', 'Order ID', true)] },
	{ domain: 'orders', operation: 'updateOrderDueDate', name: 'Update Order Due Date', description: 'Update an order due date', method: 'POST', path: 'ExOrder/UpdateOrderDueDate', body: true },
	{ domain: 'orders', operation: 'getOrderHistory', name: 'Get Order History', description: 'Get order history', method: 'GET', path: 'ExOrder/OrderHistory', parameters: [queryNumber('orderId', 'Order ID', true)] },
	{ domain: 'orders', operation: 'getOrderHistoryTypes', name: 'Get Order History Types', description: 'Get order history types', method: 'GET', path: 'ExOrder/OrderHistoryTypes' },
	{ domain: 'orders', operation: 'getOrderDetailById', name: 'Get Order Detail by ID', description: 'Get order detail by ID', method: 'GET', path: 'ExOrderDetail/GetExOrderDetailById', parameters: [queryNumber('orderId', 'Order ID', true, 'id')] },
	{ domain: 'orders', operation: 'getOrderByInvoiceNumber', name: 'Get Order by Invoice Number', description: 'Get order detail by invoice number', method: 'GET', path: 'ExOrderDetail/GetExOrderByInvoiceNumber', parameters: [queryString('invoiceNumber', 'Invoice Number', true, 'id')] },
	{ domain: 'orders', operation: 'getOrderByEstimateNumber', name: 'Get Order by Estimate Number', description: 'Get order detail by estimate number', method: 'GET', path: 'ExOrderDetail/GetExOrderByEstimateNumber', parameters: [queryString('estimateNumber', 'Estimate Number', true, 'id')] },
	{ domain: 'orders', operation: 'getOrdersByStatus', name: 'Get Orders by Status', description: 'Get orders by status', method: 'GET', path: 'ExOrderDetail/GetOrdersByStatus', parameters: [queryString('statusName', 'Status Name', true)] },
	{ domain: 'orders', operation: 'getOrdersByStatusAndDate', name: 'Get Orders by Status and Date', description: 'Get orders by status and date range', method: 'GET', path: 'ExOrderDetail/GetOrdersByStatusAndDate', parameters: [queryString('statusName', 'Status Name', true), queryString('startDate', 'Start Date', true), queryString('endDate', 'End Date', true)] },
	{ domain: 'orders', operation: 'getOrderAddress', name: 'Get Order Address', description: 'Get an order shipping address', method: 'GET', path: 'ExShipping/GetOrderAddress/{orderAddressId}', parameters: [pathNumber('orderAddressId', 'Order Address ID')] },

	// Order products, parts, status, and Quick Products
	{ domain: 'products', operation: 'getOrderProducts', name: 'Get Order Products', description: 'Get order products', method: 'GET', path: 'ExOrderProduct', parameters: paging },
	{ domain: 'products', operation: 'getOrderProductById', name: 'Get Order Product by ID (Query)', description: 'Get an order product by query ID using the Postman contract', method: 'GET', path: 'ExOrderProduct', parameters: [queryNumber('orderProductId', 'Order Product ID', true, 'id')] },
	{ domain: 'products', operation: 'getOrderProductByPathId', name: 'Get Order Product by ID (Path)', description: 'Get an order product by path ID using the technical-reference contract', method: 'GET', path: 'ExOrderProduct/{orderProductId}', parameters: [pathNumber('orderProductId', 'Order Product ID')] },
	{ domain: 'products', operation: 'getOrderProductParts', name: 'Get Order Product Parts', description: 'Get order product parts', method: 'GET', path: 'ExOrderProductPart', parameters: paging },
	{ domain: 'products', operation: 'getOrderProductPartById', name: 'Get Order Product Part by ID', description: 'Get an order product part by ID', method: 'GET', path: 'ExOrderProductPart/{orderProductPartId}', parameters: [pathNumber('orderProductPartId', 'Order Product Part ID')] },
	{ domain: 'products', operation: 'getAllStatusCbName', name: 'Get All Status CB Names', description: 'Get CoreBridge status names', method: 'GET', path: 'ExOrderProduct/GetAllStatusCBName' },
	{ domain: 'products', operation: 'getAllStatus', name: 'Get All Statuses', description: 'Get order product statuses', method: 'GET', path: 'ExOrderProduct/GetAllStatus' },
	{ domain: 'products', operation: 'updateProductStatus', name: 'Update Product Status', description: 'Update order product status', method: 'POST', path: 'ExOrderProduct/UpdateProductStatusForId', parameters: [queryNumber('orderProductId', 'Order Product ID', true), queryString('statusName', 'Status Name', true, 'newOrderProductStatusName')] },
	{ domain: 'products', operation: 'getAvailableSubStatus', name: 'Get Available Substatus', description: 'Get substatus values for a status', method: 'GET', path: 'ExOrderProduct/GetAvailableSubStatusForStatus', parameters: [queryString('statusName', 'Status Name', true, 'orderProductStatusName')] },
	{ domain: 'products', operation: 'updateProductSubstatus', name: 'Update Product Substatus', description: 'Update order product substatus', method: 'POST', path: 'ExOrderProduct/UpdateProductSubStatusForId', parameters: [queryNumber('orderProductId', 'Order Product ID', true), queryString('substatusTag', 'Substatus Tag', true, 'tag')] },
	{ domain: 'products', operation: 'updateProductFollowUpDueDate', name: 'Update Product Follow-Up Due Date', description: 'Update product follow-up due date', method: 'POST', path: 'ExOrderProduct/UpdateOrderProductFollowUpDueDate', parameters: [queryNumber('orderProductId', 'Order Product ID', true), queryString('followUpDateText', 'Follow-Up Date', true)] },
	{ domain: 'products', operation: 'updateProductDesignDueDate', name: 'Update Product Design Due Date', description: 'Update product design due date', method: 'POST', path: 'ExOrderProduct/UpdateOrderProductDesignDueDate', parameters: [queryNumber('orderProductId', 'Order Product ID', true), queryString('designDueDateText', 'Design Due Date', true)] },
	{ domain: 'products', operation: 'searchQuickProducts', name: 'Search Quick Products', description: 'Search the Quick Product catalog', method: 'POST', path: 'ExQuickProduct/Search', body: true },
	{ domain: 'products', operation: 'getQuickProductById', name: 'Get Quick Product by ID', description: 'Get a Quick Product by ID', method: 'GET', path: 'ExQuickProduct/GetById/{quickProductId}', parameters: [pathNumber('quickProductId', 'Quick Product ID'), queryBoolean('includeInactive', 'Include Inactive')] },

	// Royalty
	{ domain: 'royalty', operation: 'getRoyaltyPlans', name: 'Get Royalty Plans', description: 'Get royalty plans', method: 'GET', path: 'ExRoyalty/RoyaltyPlans' },
	{ domain: 'royalty', operation: 'searchRoyaltyOverrides', name: 'Get Royalty Customer Overrides', description: 'Search customers with royalty plan overrides', method: 'POST', path: 'ExRoyalty/RoyaltyPlansCustomerOverrides', body: true },

	// Employees, reconciliation, and sales reference data
	{ domain: 'sales', operation: 'getEmployees', name: 'Get Employees', description: 'Get employees', method: 'GET', path: 'ExEmployee/GetEmployees', parameters: [queryString('email', 'Email'), queryBoolean('includeInactive', 'Include Inactive')] },
	{ domain: 'sales', operation: 'getReconciliationDetailById', name: 'Get Reconciliation Detail by ID', description: 'Get reconciliation detail by ID', method: 'GET', path: 'ExReconciliation/ReconciliationDetailById', parameters: [queryString('id', 'ID', true)] },
	{ domain: 'sales', operation: 'getLocations', name: 'Get Locations', description: 'Get sales center locations', method: 'GET', path: 'ExSalesCenter/GetLocations' },
	{ domain: 'sales', operation: 'getTaxGroups', name: 'Get Tax Groups', description: 'Get tax groups, optionally filtered by location', method: 'GET', path: 'ExSalesCenter/GetTaxGroups', parameters: [queryNumber('locationId', 'Location ID')] },
	{ domain: 'sales', operation: 'getSalespersons', name: 'Get Salespersons', description: 'Get salespersons', method: 'GET', path: 'ExSalesperson/GetSalespersons', parameters: [queryString('email', 'Email'), queryBoolean('includeInactive', 'Include Inactive')] },
];

export const domainLabels: Record<CorebridgeDomain, string> = {
	contacts: 'CoreBridge Contacts',
	customers: 'CoreBridge Customers',
	documents: 'CoreBridge Documents',
	goals: 'CoreBridge Goals',
	orders: 'CoreBridge Orders',
	products: 'CoreBridge Products',
	royalty: 'CoreBridge Royalty',
	sales: 'CoreBridge Sales',
	apiRequest: 'CoreBridge API Request',
};

export function getEndpointsForDomain(domain: CorebridgeDomain): CorebridgeEndpoint[] {
	return endpoints.filter((endpoint) => endpoint.domain === domain);
}

export function getEndpoint(operation: string): CorebridgeEndpoint | undefined {
	return endpoints.find((endpoint) => endpoint.operation === operation);
}

export function getOperationOptions(domain: CorebridgeDomain) {
	return getEndpointsForDomain(domain).map((endpoint) => ({
		name: endpoint.name,
		value: endpoint.operation,
		description: endpoint.description,
		action: endpoint.name.toLowerCase(),
	}));
}

export function getCorebridgeProperties(domain: CorebridgeDomain): INodeProperties[] {
	const operations = getEndpointsForDomain(domain);
	const bodyOperations = operations.filter((endpoint) => endpoint.body).map((endpoint) => endpoint.operation);
	const properties: INodeProperties[] = [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			options: getOperationOptions(domain),
			default: operations[0]?.operation ?? '',
		},
	];

	for (const endpoint of operations) {
		for (const parameter of endpoint.parameters ?? []) {
			const property: INodeProperties = {
				displayName: parameter.displayName,
				name: parameter.name,
				type: parameter.type ?? 'string',
				default: parameter.default ?? (parameter.type === 'boolean' ? false : parameter.type === 'number' ? 0 : ''),
				required: parameter.required,
				description: parameter.description,
				displayOptions: { show: { operation: [endpoint.operation] } },
			};
			if (parameter.type === 'options') property.options = parameter.options;
			properties.push(property);
		}
	}

	properties.push(...getBodyProperties(bodyOperations));
	properties.push({
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'fixedCollection',
		default: {},
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: 'Parameter',
				name: 'parameters',
				values: [
					{ displayName: 'Name', name: 'name', type: 'string', default: '' },
					{ displayName: 'Value', name: 'value', type: 'string', default: '' },
				],
			},
		],
		description: 'Additional query parameters. These override generated parameters with the same name.',
	});
	return properties;
}

export function getEndpointParameterValues(
	endpoint: CorebridgeEndpoint,
	readParameter: (name: string) => unknown,
): { path: IDataObject; query: IDataObject } {
	const path: IDataObject = {};
	const query: IDataObject = {};
	for (const parameter of endpoint.parameters ?? []) {
		const value = readParameter(parameter.name);
		if (value === undefined || value === null || value === '') continue;
		if (parameter.type === 'number' && value === 0 && !parameter.required) continue;
		const target = parameter.location === 'path' ? path : query;
		target[parameter.apiName ?? parameter.name] = value as never;
	}
	return { path, query };
}
