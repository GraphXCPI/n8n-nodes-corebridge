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
	preserveZero?: boolean;
	minimum?: number;
	maximum?: number;
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
	apiRoot?: 'public' | 'legacy';
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
	minimum: 1,
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
	minimum: required ? 1 : 0,
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

const paging = (apiName: 'intPageIndex' | 'page', name = 'pageIndex', firstPage = 0, pageSize = 10, maximum?: number): CorebridgeParameter[] => [
	{ ...queryNumber(name, firstPage === 0 ? 'Page Index (0-Based)' : 'Page (1-Based)', false, apiName), default: firstPage, preserveZero: true, minimum: firstPage },
	{ ...queryNumber('pageSize', 'Page Size'), default: pageSize, minimum: 1, maximum },
];
const dayCount = (name: string, displayName: string): CorebridgeParameter => ({
	...queryNumber(name, displayName, true), minimum: 0,
});
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
	{ domain: 'contacts', operation: 'getContacts', name: 'Get Contacts', description: 'Get a paginated contact list using the legacy API list action', method: 'GET', path: 'ExContact/Get', apiRoot: 'legacy', parameters: paging('intPageIndex') },
	{ domain: 'contacts', operation: 'getContactById', name: 'Get Contact by ID', description: 'Get a contact by ID', method: 'GET', path: 'ExContact/GetContactById/{contactId}', parameters: [pathNumber('contactId', 'Contact ID')] },
	{ domain: 'contacts', operation: 'getContactsByEmail', name: 'Get Contacts by Email', description: 'Get contacts by email address', method: 'GET', path: 'ExContact/GetContactsByEmailAddress/{emailAddress}', parameters: [pathString('emailAddress', 'Email Address')] },
	{ domain: 'contacts', operation: 'getContactsModifiedAfter', name: 'Get Contacts Modified After', description: 'Get contacts modified within a number of days', method: 'GET', path: 'ExContact/GetContactsModifiedAfterDate/{days}', parameters: [{ ...pathNumber('days', 'Days'), minimum: 0 }] },
	{ domain: 'contacts', operation: 'searchContacts', name: 'Search Contacts', description: 'Search contacts with filters and pagination', method: 'POST', path: 'ExContact/SearchContacts_v2', body: true },
	{ domain: 'contacts', operation: 'createContact', name: 'Create Contact', description: 'Create a contact', method: 'POST', path: 'ExContact/Create', body: true },
	{ domain: 'contacts', operation: 'updateContact', name: 'Update Contact', description: 'Update a contact', method: 'POST', path: 'ExContact/UpdateContact', body: true },
	{ domain: 'contacts', operation: 'updateContactType', name: 'Update Contact Type', description: 'Assign a contact type', method: 'POST', path: 'ExContact/UpdateContactTypeForContact', parameters: [queryNumber('contactId', 'Contact ID', true), queryNumber('contactTypeId', 'Contact Type ID', true)] },
	{ domain: 'contacts', operation: 'createContactType', name: 'Create Contact Type', description: 'Create a contact type', method: 'POST', path: 'ExContact/CreateContactType', body: true },
	{ domain: 'contacts', operation: 'getContactTypes', name: 'Get Contact Types', description: 'Get available contact types', method: 'GET', path: 'ExContact/GetAvailableContactTypes' },
	{ domain: 'contacts', operation: 'getContactJobAuthorities', name: 'Get Contact Job Authorities', description: 'Get available contact job authority values', method: 'GET', path: 'ExContact/GetAvailableContactJobAuthority' },

	// Customers
	{ domain: 'customers', operation: 'getCustomers', name: 'Get Customers', description: 'Get a paginated customer list using the legacy API list action', method: 'GET', path: 'ExCustomer/Get', apiRoot: 'legacy', parameters: paging('intPageIndex') },
	{ domain: 'customers', operation: 'getCustomerByName', name: 'Get Customer by Name', description: 'Get a customer by company name', method: 'GET', path: 'ExCustomer/GetCustomerByName/{customerName}', parameters: [pathString('customerName', 'Customer Name')] },
	{ domain: 'customers', operation: 'getCustomerById', name: 'Get Customer by ID', description: 'Get a customer by account ID', method: 'GET', path: 'ExCustomer/GetCustomerById/{accountId}', parameters: [pathNumber('accountId', 'Account ID')] },
	{ domain: 'customers', operation: 'getCustomerLocations', name: 'Get Customer Locations', description: 'Get customer locations by account ID', method: 'GET', path: 'ExCustomer/GetCustomerLocationsByCustomerId/{accountId}', parameters: [pathNumber('accountId', 'Account ID')] },
	{ domain: 'customers', operation: 'getCustomerLocationByAddressId', name: 'Get Customer Location by Address ID', description: 'Get a customer location by address ID', method: 'GET', path: 'ExCustomer/GetCustomerLocationByAddressId/{addressId}', parameters: [pathNumber('addressId', 'Address ID')] },
	{ domain: 'customers', operation: 'getCustomersByPhone', name: 'Get Customers by Phone', description: 'Get customers by phone number', method: 'GET', path: 'ExCustomer/GetCustomersByPhoneNumber/{phoneNumber}', parameters: [pathString('phoneNumber', 'Phone Number')] },
	{ domain: 'customers', operation: 'getCustomersCreatedAfter', name: 'Get Customers Created After', description: 'Get customers created within a number of days', method: 'GET', path: 'ExCustomer/GetCustomersCreatedAfterDate', parameters: [dayCount('days', 'Days Ago')] },
	{ domain: 'customers', operation: 'getCustomersCreatedBetween', name: 'Get Customers Created Between Dates', description: 'Get customers between relative day counts, not absolute dates; beginDays must exceed endDays', method: 'GET', path: 'ExCustomer/GetCustomersCreatedBetweenDates', parameters: [dayCount('beginDays', 'Begin Days Ago'), dayCount('endDays', 'End Days Ago'), ...paging('page', 'page')] },
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
	{ domain: 'goals', operation: 'getGroupCompareCurrent', name: 'Get Group Compare Current', description: 'Get current group comparison values', method: 'GET', path: 'ExGoal/GetGroupCompareCurrent', parameters: [{ ...queryNumber('reportType', 'Report Type'), default: 210, description: 'Current report code: 210 through 280 in increments of 10' }, ...goalTotals] },
	{ domain: 'goals', operation: 'getGroupCompareTotal', name: 'Get Group Compare Total', description: 'Get total group comparison values', method: 'GET', path: 'ExGoal/GetGroupCompareTotal', parameters: [{ ...queryNumber('reportType', 'Report Type'), default: 10, description: 'Total report code: 10 through 200 in increments of 10' }, ...goalTotals] },
	{ domain: 'goals', operation: 'getSalesMonitorTotals', name: 'Get Sales Monitor Totals', description: 'Get sales monitor totals', method: 'GET', path: 'ExGoal/GetSalesMonitorTotals', parameters: [{ ...queryString('date', 'Date With Offset'), description: 'ISO 8601 date and time with an explicit timezone offset; empty uses the server location date' }] },

	// Orders and estimates
	{ domain: 'orders', operation: 'getEstimate', name: 'Get Estimates', description: 'Get estimates', method: 'GET', path: 'ExEstimate/Get', parameters: [...paging('page', 'page', 1), { ...queryString('sort', 'Sort'), default: 'Id', description: 'Id, EstimateNumber, Customer, OrderContact, OrderDescription, Salesperson, created, or status' }, { ...queryString('direction', 'Direction'), default: 'asc', description: 'asc or desc' }] },
	{ domain: 'orders', operation: 'cancelEstimate', name: 'Cancel Estimate', description: 'Cancel an estimate', method: 'POST', path: 'ExEstimate/CancelEstimate', body: true },
	{ domain: 'orders', operation: 'convertEstimate', name: 'Convert Estimate (GET Compatibility)', description: 'Convert an estimate using the Postman GET contract', method: 'GET', path: 'ExEstimate/ConvertEstimate', parameters: [queryNumber('orderId', 'Order ID', true, 'id')] },
	{ domain: 'orders', operation: 'convertEstimatePost', name: 'Convert Estimate (POST)', description: 'Convert an estimate using the technical-reference POST contract', method: 'POST', path: 'ExEstimate/ConvertEstimate', parameters: [queryNumber('orderId', 'Order ID', true, 'id')] },
	{ domain: 'orders', operation: 'getOrders', name: 'Get Orders', description: 'Get a paginated order list', method: 'GET', path: 'ExOrder', parameters: paging('page') },
	{ domain: 'orders', operation: 'getOrderById', name: 'Get Order by ID', description: 'Get an order by ID', method: 'GET', path: 'ExOrder/{orderId}', parameters: [pathNumber('orderId', 'Order ID')] },
	{ domain: 'orders', operation: 'getCustomerPortalLink', name: 'Get Customer Portal Link', description: 'Get a time-limited customer portal link', method: 'GET', path: 'ExOrder/GetCustomerPortalLink/{orderId}', parameters: [pathNumber('orderId', 'Order ID')] },
	{ domain: 'orders', operation: 'createGenericOrder', name: 'Create Generic Order', description: 'Create an order or estimate', method: 'POST', path: 'ExOrder/CreateGenericOrder', body: true },
	{ domain: 'orders', operation: 'searchOrders', name: 'Search Orders', description: 'Search orders with filters and pagination', method: 'POST', path: 'ExOrder/SearchOrders_v2', body: true },
	{ domain: 'orders', operation: 'addOrderNotes', name: 'Add Order Notes', description: 'Append notes to an order', method: 'POST', path: 'ExOrder/AddOrderNotes', body: true },
	{ domain: 'orders', operation: 'getOrderNotes', name: 'Get Order Notes', description: 'Get order notes', method: 'GET', path: 'ExOrder/GetOrderNotes', parameters: [queryNumber('orderId', 'Order ID', true)] },
	{ domain: 'orders', operation: 'updateOrderNotes', name: 'Update Order Notes', description: 'Replace order notes', method: 'POST', path: 'ExOrder/UpdateOrderNotes', body: true },
	{ domain: 'orders', operation: 'deleteOrderNotes', name: 'Delete Order Notes', description: 'Delete all notes for an order', method: 'DELETE', path: 'ExOrder/DeleteOrderNotes', parameters: [queryNumber('orderId', 'Order ID', true)] },
	{ domain: 'orders', operation: 'updateOrderDueDate', name: 'Update Order Due Date', description: 'Update an order due date', method: 'POST', path: 'ExOrder/UpdateOrderDueDate', body: true },
	{ domain: 'orders', operation: 'getOrderHistory', name: 'Get Order History', description: 'Get order history', method: 'GET', path: 'ExOrder/OrderHistory', parameters: [queryNumber('orderId', 'Order ID', true), queryNumber('orderHistoryTypeId', 'Order History Type ID'), ...paging('page', 'page', 1, 50, 50)] },
	{ domain: 'orders', operation: 'getOrderHistoryTypes', name: 'Get Order History Types', description: 'Get order history types', method: 'GET', path: 'ExOrder/OrderHistoryTypes' },
	{ domain: 'orders', operation: 'getOrderDetailById', name: 'Get Order Detail by ID', description: 'Get order detail by ID', method: 'GET', path: 'ExOrderDetail/GetExOrderDetailById', parameters: [queryNumber('orderId', 'Order ID', true, 'id')] },
	{ domain: 'orders', operation: 'getOrderByInvoiceNumber', name: 'Get Order by Invoice Number', description: 'Get order detail by invoice number', method: 'GET', path: 'ExOrderDetail/GetExOrderByInvoiceNumber', parameters: [queryString('invoiceNumber', 'Invoice Number', true, 'id')] },
	{ domain: 'orders', operation: 'getOrderByEstimateNumber', name: 'Get Order by Estimate Number', description: 'Get order detail by estimate number', method: 'GET', path: 'ExOrderDetail/GetExOrderByEstimateNumber', parameters: [queryString('estimateNumber', 'Estimate Number', true, 'id')] },
	{ domain: 'orders', operation: 'getOrdersByStatus', name: 'Get Orders by Status', description: 'Get orders by comma-separated status names', method: 'GET', path: 'ExOrderDetail/GetOrdersByStatus', parameters: [queryString('statusName', 'Status Names (Comma-Separated)', true, 'listOfStatus')] },
	{ domain: 'orders', operation: 'getOrdersByStatusAndDate', name: 'Get Orders by Status and Date', description: 'Get orders by status within a number of days, not an absolute date range', method: 'GET', path: 'ExOrderDetail/GetOrdersByStatusAndDate', parameters: [queryString('statusName', 'Status Name', true, 'status'), dayCount('days', 'Days Ago')] },
	{ domain: 'orders', operation: 'getOrderAddress', name: 'Get Order Address', description: 'Get an order shipping address', method: 'GET', path: 'ExShipping/GetOrderAddress/{orderAddressId}', parameters: [pathNumber('orderAddressId', 'Order Address ID')] },

	// Order products, parts, status, and Quick Products
	{ domain: 'products', operation: 'getOrderProducts', name: 'Get Order Products', description: 'Get order products', method: 'GET', path: 'ExOrderProduct', parameters: paging('page') },
	{ domain: 'products', operation: 'getOrderProductById', name: 'Get Order Product by ID (Query)', description: 'Get an order product by query ID using the Postman contract', method: 'GET', path: 'ExOrderProduct', parameters: [queryNumber('orderProductId', 'Order Product ID', true, 'id')] },
	{ domain: 'products', operation: 'getOrderProductByPathId', name: 'Get Order Product by ID (Path)', description: 'Get an order product by path ID using the technical-reference contract', method: 'GET', path: 'ExOrderProduct/{orderProductId}', parameters: [pathNumber('orderProductId', 'Order Product ID')] },
	{ domain: 'products', operation: 'getOrderProductParts', name: 'Get Order Product Parts', description: 'Get order product parts', method: 'GET', path: 'ExOrderProductPart', parameters: paging('page') },
	{ domain: 'products', operation: 'getOrderProductPartById', name: 'Get Order Product Part by ID', description: 'Get an order product part by ID', method: 'GET', path: 'ExOrderProductPart/{orderProductPartId}', parameters: [pathNumber('orderProductPartId', 'Order Product Part ID')] },
	{ domain: 'products', operation: 'getAllStatusCbName', name: 'Get All Status CB Names', description: 'Get CoreBridge status names', method: 'GET', path: 'ExOrderProduct/GetAllStatusCBName' },
	{ domain: 'products', operation: 'getAllStatus', name: 'Get All Statuses', description: 'Get order product statuses', method: 'GET', path: 'ExOrderProduct/GetAllStatus' },
	{ domain: 'products', operation: 'updateProductStatus', name: 'Update Product Status', description: 'Update order product status', method: 'POST', path: 'ExOrderProduct/UpdateProductStatusForId', parameters: [queryNumber('orderProductId', 'Order Product ID', true), queryString('statusName', 'Status Name', true, 'newOrderProductStatusName')] },
	{ domain: 'products', operation: 'getAvailableSubStatus', name: 'Get Available Substatus', description: 'Get substatus values for a status', method: 'GET', path: 'ExOrderProduct/GetAvailableSubStatusForStatus', parameters: [queryString('statusName', 'Status Name', true, 'orderProductStatusName')] },
	{ domain: 'products', operation: 'updateProductSubstatus', name: 'Update Product Substatus', description: 'Update order product substatus', method: 'POST', path: 'ExOrderProduct/UpdateProductSubStatusForId', parameters: [queryNumber('orderProductId', 'Order Product ID', true), queryString('substatusTag', 'Substatus Tag', true, 'tag')] },
	{ domain: 'products', operation: 'updateProductFollowUpDueDate', name: 'Update Product Follow-Up Due Date', description: 'Update product follow-up due date', method: 'POST', path: 'ExOrderProduct/UpdateOrderProductFollowUpDueDate', parameters: [queryNumber('orderProductId', 'Order Product ID', true), { ...queryString('followUpDateText', 'Follow-Up Date', true), description: 'Postman specifies YYYY-MM-DD HH:MM:SS; sent unchanged without timezone conversion' }] },
	{ domain: 'products', operation: 'updateProductDesignDueDate', name: 'Update Product Design Due Date', description: 'Update product design due date', method: 'POST', path: 'ExOrderProduct/UpdateOrderProductDesignDueDate', parameters: [queryNumber('orderProductId', 'Order Product ID', true), { ...queryString('designDueDateText', 'Design Due Date', true), description: 'Postman specifies YYYY-MM-DD HH:MM:SS; sent unchanged without timezone conversion' }] },
	{ domain: 'products', operation: 'searchQuickProducts', name: 'Search Quick Products', description: 'Search the Quick Product catalog', method: 'POST', path: 'ExQuickProduct/Search', body: true },
	{ domain: 'products', operation: 'getQuickProductById', name: 'Get Quick Product by ID', description: 'Get a Quick Product by ID', method: 'GET', path: 'ExQuickProduct/GetById/{quickProductId}', parameters: [pathNumber('quickProductId', 'Quick Product ID'), queryBoolean('includeInactive', 'Include Inactive')] },

	// Royalty
	{ domain: 'royalty', operation: 'getRoyaltyPlans', name: 'Get Royalty Plans', description: 'Get royalty plans', method: 'GET', path: 'ExRoyalty/RoyaltyPlans' },
	{ domain: 'royalty', operation: 'searchRoyaltyOverrides', name: 'Get Royalty Customer Overrides', description: 'Search customers with royalty plan overrides', method: 'POST', path: 'ExRoyalty/RoyaltyPlansCustomerOverrides', body: true },

	// Employees, reconciliation, and sales reference data
	{ domain: 'sales', operation: 'getEmployees', name: 'Get Employees', description: 'Get employees', method: 'GET', path: 'ExEmployee/GetEmployees', parameters: [queryString('email', 'Email', false, 'emailAddress')] },
	{ domain: 'sales', operation: 'getReconciliationDetailById', name: 'Get Reconciliation Detail by ID', description: 'Get reconciliation detail by ID', method: 'GET', path: 'ExReconciliation/ReconciliationDetailById', parameters: [queryNumber('id', 'ID', true)] },
	{ domain: 'sales', operation: 'getLocations', name: 'Get Locations', description: 'Get sales center locations', method: 'GET', path: 'ExSalesCenter/GetLocations' },
	{ domain: 'sales', operation: 'getTaxGroups', name: 'Get Tax Groups', description: 'Get tax groups, optionally filtered by location', method: 'GET', path: 'ExSalesCenter/GetTaxGroups', parameters: [queryNumber('locationId', 'Location ID')] },
	{ domain: 'sales', operation: 'getSalespersons', name: 'Get Salespersons', description: 'Get salespersons', method: 'GET', path: 'ExSalesperson/GetSalespersons', parameters: [queryString('email', 'Email', false, 'emailAddress'), queryBoolean('includeInactive', 'Include Inactive')] },
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

export const selectableDomains: CorebridgeDomain[] = [
	'contacts',
	'customers',
	'orders',
	'products',
	'documents',
	'goals',
	'royalty',
	'sales',
];

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
	const operations = endpoints;
	const bodyOperations = operations.filter((endpoint) => endpoint.body).map((endpoint) => endpoint.operation);
	const properties: INodeProperties[] = [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: selectableDomains.map((selectableDomain) => ({
				name: domainLabels[selectableDomain].replace(/^CoreBridge /, ''),
				value: selectableDomain,
			})),
			default: domain,
		},
	];

	for (const selectableDomain of selectableDomains) {
		const domainOperations = getEndpointsForDomain(selectableDomain);
		properties.push({
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			options: getOperationOptions(selectableDomain),
			default: domainOperations[0]?.operation ?? '',
			displayOptions: {
				show: {
					resource: [selectableDomain],
				},
			},
		});
	}

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
			if (parameter.minimum !== undefined) {
				property.typeOptions = { minValue: parameter.minimum, numberPrecision: 0 };
				if (parameter.maximum !== undefined) property.typeOptions.maxValue = parameter.maximum;
			}
			properties.push(property);
		}
	}

	// Keep obsolete saved fields readable by n8n so execution can reject, not reinterpret, them.
	for (const name of ['startDate', 'endDate']) {
		properties.push({
			displayName: name === 'startDate' ? 'Legacy Start Date' : 'Legacy End Date',
			name, type: 'hidden', default: '',
			displayOptions: { show: { operation: ['getCustomersCreatedBetween', 'getOrdersByStatusAndDate'] } },
		});
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
	if (['getCustomersCreatedBetween', 'getOrdersByStatusAndDate'].includes(endpoint.operation)) {
		const hasValue = (value: unknown) => value !== undefined && value !== null && value !== '';
		const extra = readParameter('queryParameters') as { parameters?: Array<{ name?: string }> } | undefined;
		if (['startDate', 'endDate'].some((name) => hasValue(readParameter(name))) ||
			extra?.parameters?.some((parameter) => ['startDate', 'endDate'].includes(parameter.name ?? ''))) {
			throw new Error(`${endpoint.operation} accepts relative day counts, not startDate/endDate. Remove the saved date fields and explicitly configure ${endpoint.operation === 'getCustomersCreatedBetween' ? 'beginDays/endDays' : 'days'}; dates are never converted automatically.`);
		}
	}
	for (const parameter of endpoint.parameters ?? []) {
		const value = readParameter(parameter.name);
		if (value === undefined || value === null || value === '') {
			if (parameter.required) throw new Error(`${endpoint.operation}: ${parameter.name} is required.`);
			continue;
		}
		if (parameter.type === 'number' && value === 0 && !parameter.required && !parameter.preserveZero) continue;
		if (parameter.minimum !== undefined) {
			const numeric = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
			if (!Number.isInteger(numeric) || numeric < parameter.minimum || (parameter.maximum !== undefined && numeric > parameter.maximum)) {
				throw new Error(`${endpoint.operation}: ${parameter.name} must be an integer >= ${parameter.minimum}${parameter.maximum === undefined ? '' : ` and <= ${parameter.maximum}`}.`);
			}
		}
		const target = parameter.location === 'path' ? path : query;
		target[parameter.apiName ?? parameter.name] = (parameter.type === 'number' && parameter.minimum !== undefined ? Number(value) : value) as never;
	}
	if (endpoint.operation === 'getCustomersCreatedBetween' && Number(query.endDays) >= Number(query.beginDays)) {
		throw new Error('getCustomersCreatedBetween: endDays must be less than beginDays.');
	}
	return { path, query };
}
