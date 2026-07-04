import type { IDataObject, INodeProperties } from 'n8n-workflow';

export type CorebridgeDomain =
	| 'contacts'
	| 'customers'
	| 'documents'
	| 'orders'
	| 'products'
	| 'sales'
	| 'apiRequest';

export type CorebridgeResponseFormat = 'json' | 'text';

export type CorebridgeEndpoint = {
	domain: CorebridgeDomain;
	operation: string;
	name: string;
	description: string;
	method: 'GET' | 'POST';
	path: string;
	body?: boolean;
	responseFormat?: CorebridgeResponseFormat;
};

export const endpoints: CorebridgeEndpoint[] = [
	// Contacts
	{ domain: 'contacts', operation: 'createContact', name: 'Create Contact', description: 'Create a contact record', method: 'POST', path: 'ExContact/Create', body: true },
	{ domain: 'contacts', operation: 'updateContact', name: 'Update Contact', description: 'Update an existing contact record', method: 'POST', path: 'ExContact/UpdateContact', body: true },
	{ domain: 'contacts', operation: 'searchContacts', name: 'Search Contacts', description: 'Search contact records', method: 'POST', path: 'ExContact/SearchContacts_v2', body: true },
	{ domain: 'contacts', operation: 'getContactsByEmail', name: 'Get Contacts by Email', description: 'Get contacts by email address', method: 'GET', path: 'ExContact/GetContactsByEmailAddress/{emailAddress}' },
	{ domain: 'contacts', operation: 'getContactById', name: 'Get Contact by ID', description: 'Get a contact by contact ID', method: 'GET', path: 'ExContact/GetContactById/{contactId}' },

	// Customers
	{ domain: 'customers', operation: 'createCustomer', name: 'Create Customer', description: 'Create a customer account', method: 'POST', path: 'ExCustomer/CreateCustomer_v2', body: true },
	{ domain: 'customers', operation: 'updateCustomer', name: 'Update Customer', description: 'Update a customer account', method: 'POST', path: 'ExCustomer/UpdateCustomer_v2', body: true },
	{ domain: 'customers', operation: 'searchCustomers', name: 'Search Customers', description: 'Search customer accounts', method: 'POST', path: 'ExCustomer/SearchCustomers_v2', body: true },
	{ domain: 'customers', operation: 'getCustomerById', name: 'Get Customer by ID', description: 'Get a customer by account ID', method: 'GET', path: 'ExCustomer/GetCustomerById/{accountId}' },
	{ domain: 'customers', operation: 'getCustomerByName', name: 'Get Customer by Name', description: 'Get a customer by company name', method: 'GET', path: 'ExCustomer/GetCustomerByName/{customerName}' },
	{ domain: 'customers', operation: 'updateCustomerName', name: 'Update Customer Name', description: 'Update a customer company name', method: 'POST', path: 'ExCustomer/UpdateCustomerName', body: true },
	{ domain: 'customers', operation: 'getIndustryTypes', name: 'Get Industry Types', description: 'Get available industry types', method: 'GET', path: 'ExCustomer/GetIndustryTypes' },
	{ domain: 'customers', operation: 'getReferralTypes', name: 'Get Referral Types', description: 'Get available referral types', method: 'GET', path: 'ExCustomer/GetAvailableReferralTypes' },
	{ domain: 'customers', operation: 'getCustomerLocations', name: 'Get Customer Locations', description: 'Get customer locations by account ID', method: 'GET', path: 'ExCustomer/GetCustomerLocationsByCustomerId/{accountId}' },
	{ domain: 'customers', operation: 'createCustomerLocation', name: 'Create Customer Location', description: 'Create a customer location', method: 'POST', path: 'ExCustomer/CreateCustomerLocation', body: true },
	{ domain: 'customers', operation: 'updateCustomerLocation', name: 'Update Customer Location', description: 'Update a customer location', method: 'POST', path: 'ExCustomer/UpdateCustomerLocation', body: true },
	{ domain: 'customers', operation: 'getCustomerMergeHistoryById', name: 'Get Customer Merge History by ID', description: 'Get customer merge history by ID', method: 'GET', path: 'ExCustomerMerge/GetCustomerMergeHistoryById' },
	{ domain: 'customers', operation: 'searchCustomerMergeHistory', name: 'Search Customer Merge History', description: 'Search customer merge history', method: 'POST', path: 'ExCustomerMerge/CustomerMergeHistory_v2', body: true },

	// Documents
	{ domain: 'documents', operation: 'getOrderStatement', name: 'Get Order Statement', description: 'Get an order statement document by order ID', method: 'GET', path: 'ExDocument/OrderStatementByOrderId', responseFormat: 'text' },
	{ domain: 'documents', operation: 'getCustomerStatement', name: 'Get Customer Statement', description: 'Get a customer statement document by customer ID', method: 'GET', path: 'ExDocument/CustomerStatementbyCustomerId', responseFormat: 'text' },
	{ domain: 'documents', operation: 'getWorkOrder', name: 'Get Work Order', description: 'Get a work order document by order ID', method: 'GET', path: 'ExDocument/WorkOrder', responseFormat: 'text' },
	{ domain: 'documents', operation: 'getWorkOrderProduct', name: 'Get Work Order Product', description: 'Get a work order product document by order product ID', method: 'GET', path: 'ExDocument/WorkOrderProduct', responseFormat: 'text' },

	// Orders and estimates
	{ domain: 'orders', operation: 'getEstimate', name: 'Get Estimates', description: 'Get estimates', method: 'GET', path: 'ExEstimate/Get' },
	{ domain: 'orders', operation: 'cancelEstimate', name: 'Cancel Estimate', description: 'Cancel an estimate', method: 'POST', path: 'ExEstimate/CancelEstimate', body: true },
	{ domain: 'orders', operation: 'convertEstimate', name: 'Convert Estimate', description: 'Convert an estimate to an order', method: 'GET', path: 'ExEstimate/ConvertEstimate' },
	{ domain: 'orders', operation: 'createGenericOrder', name: 'Create Generic Order', description: 'Create an estimate or order from a generic order JSON payload', method: 'POST', path: 'ExOrder/CreateGenericOrder', body: true },
	{ domain: 'orders', operation: 'searchOrders', name: 'Search Orders', description: 'Search orders', method: 'POST', path: 'ExOrder/SearchOrders_v2', body: true },
	{ domain: 'orders', operation: 'getOrderHistoryTypes', name: 'Get Order History Types', description: 'Get order history types', method: 'GET', path: 'ExOrder/OrderHistoryTypes' },
	{ domain: 'orders', operation: 'getOrderByInvoiceNumber', name: 'Get Order by Invoice Number', description: 'Get order detail by invoice number', method: 'GET', path: 'ExOrderDetail/GetExOrderByInvoiceNumber' },
	{ domain: 'orders', operation: 'getOrderDetailById', name: 'Get Order Detail by ID', description: 'Get order detail by order ID', method: 'GET', path: 'ExOrderDetail/GetExOrderDetailById' },

	// Products
	{ domain: 'products', operation: 'getOrderProductById', name: 'Get Order Product by ID', description: 'Get order product details by ID', method: 'GET', path: 'ExOrderProduct/' },
	{ domain: 'products', operation: 'getAllStatusCbName', name: 'Get All Status CB Names', description: 'Get all CoreBridge status names', method: 'GET', path: 'ExOrderProduct/GetAllStatusCBName' },
	{ domain: 'products', operation: 'getAllStatus', name: 'Get All Statuses', description: 'Get all order product statuses', method: 'GET', path: 'ExOrderProduct/GetAllStatus' },
	{ domain: 'products', operation: 'updateProductStatus', name: 'Update Product Status', description: 'Update order product status by product ID', method: 'POST', path: 'ExOrderProduct/UpdateProductStatusForId' },
	{ domain: 'products', operation: 'getAvailableSubStatus', name: 'Get Available Substatus', description: 'Get available substatus values for a status', method: 'GET', path: 'ExOrderProduct/GetAvailableSubStatusForStatus' },
	{ domain: 'products', operation: 'updateProductSubstatus', name: 'Update Product Substatus', description: 'Update order product substatus by product ID', method: 'POST', path: 'ExOrderProduct/UpdateProductSubStatusForId' },
	{ domain: 'products', operation: 'updateProductFollowUpDueDate', name: 'Update Product Follow-Up Due Date', description: 'Update order product follow-up due date', method: 'POST', path: 'ExOrderProduct/UpdateOrderProductFollowUpDueDate' },
	{ domain: 'products', operation: 'updateProductDesignDueDate', name: 'Update Product Design Due Date', description: 'Update order product design due date', method: 'POST', path: 'ExOrderProduct/UpdateOrderProductDesignDueDate' },
	{ domain: 'products', operation: 'searchQuickProducts', name: 'Search Quick Products', description: 'Search quick products', method: 'POST', path: 'ExQuickProduct/Search', body: true },
	{ domain: 'products', operation: 'getQuickProductById', name: 'Get Quick Product by ID', description: 'Get quick product by ID', method: 'GET', path: 'ExQuickProduct/GetById/{quickProductId}' },

	// Sales and reference data
	{ domain: 'sales', operation: 'getEmployees', name: 'Get Employees', description: 'Get employees', method: 'GET', path: 'ExEmployee/GetEmployees' },
	{ domain: 'sales', operation: 'getReconciliationDetailById', name: 'Get Reconciliation Detail by ID', description: 'Get reconciliation detail by ID', method: 'GET', path: 'ExReconciliation/ReconciliationDetailById' },
	{ domain: 'sales', operation: 'getLocations', name: 'Get Locations', description: 'Get sales center locations', method: 'GET', path: 'ExSalesCenter/GetLocations' },
	{ domain: 'sales', operation: 'getTaxGroups', name: 'Get Tax Groups', description: 'Get sales center tax groups', method: 'GET', path: 'ExSalesCenter/GetTaxGroups' },
	{ domain: 'sales', operation: 'getSalespersons', name: 'Get Salespersons', description: 'Get salespersons', method: 'GET', path: 'ExSalesperson/GetSalespersons' },
];

export const domainLabels: Record<CorebridgeDomain, string> = {
	contacts: 'CoreBridge Contacts',
	customers: 'CoreBridge Customers',
	documents: 'CoreBridge Documents',
	orders: 'CoreBridge Orders',
	products: 'CoreBridge Products',
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
	const operationValues = operations.map((endpoint) => endpoint.operation);
	const bodyOperations = operations.filter((endpoint) => endpoint.body).map((endpoint) => endpoint.operation);

	return [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			options: getOperationOptions(domain),
			default: operations[0]?.operation ?? '',
		},
		...operationSpecificFields(operationValues),
		{
			displayName: 'JSON Body',
			name: 'jsonBody',
			type: 'json',
			default: '{}',
			description: 'Request body to send as JSON',
			displayOptions: {
				show: {
					operation: bodyOperations,
				},
			},
		},
		{
			displayName: 'Query Parameters',
			name: 'queryParameters',
			type: 'fixedCollection',
			default: {},
			typeOptions: {
				multipleValues: true,
			},
			options: [
				{
					displayName: 'Parameter',
					name: 'parameters',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
			description: 'Additional query string parameters. These override generated parameters with the same name.',
		},
	];
}

function operationSpecificFields(operationValues: string[]): INodeProperties[] {
	const show = (operations: string[]) => ({ operation: operations.filter((operation) => operationValues.includes(operation)) });
	const fields: INodeProperties[] = [
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'number',
			default: 0,
			required: true,
			displayOptions: { show: show(['getCustomerById', 'getCustomerLocations']) },
		},
		{
			displayName: 'Contact ID',
			name: 'contactId',
			type: 'number',
			default: 0,
			required: true,
			displayOptions: { show: show(['getContactById']) },
		},
		{
			displayName: 'Customer Name',
			name: 'customerName',
			type: 'string',
			default: '',
			required: true,
			displayOptions: { show: show(['getCustomerByName']) },
		},
		{
			displayName: 'Email Address',
			name: 'emailAddress',
			type: 'string',
			default: '',
			required: true,
			displayOptions: { show: show(['getContactsByEmail']) },
		},
		{
			displayName: 'Order ID',
			name: 'orderId',
			type: 'number',
			default: 0,
			required: true,
			displayOptions: { show: show(['getOrderStatement', 'getWorkOrder', 'convertEstimate', 'getOrderDetailById']) },
		},
		{
			displayName: 'Customer ID',
			name: 'customerId',
			type: 'number',
			default: 0,
			required: true,
			displayOptions: { show: show(['getCustomerStatement']) },
		},
		{
			displayName: 'Invoice Number',
			name: 'invoiceNumber',
			type: 'string',
			default: '',
			required: true,
			displayOptions: { show: show(['getOrderByInvoiceNumber']) },
		},
		{
			displayName: 'Order Product ID',
			name: 'orderProductId',
			type: 'number',
			default: 0,
			required: true,
			displayOptions: {
				show: show([
					'getWorkOrderProduct',
					'getOrderProductById',
					'updateProductStatus',
					'updateProductSubstatus',
					'updateProductFollowUpDueDate',
					'updateProductDesignDueDate',
				]),
			},
		},
		{
			displayName: 'Status Name',
			name: 'statusName',
			type: 'string',
			default: '',
			required: true,
			displayOptions: { show: show(['updateProductStatus', 'getAvailableSubStatus']) },
		},
		{
			displayName: 'Substatus Tag',
			name: 'substatusTag',
			type: 'string',
			default: '',
			required: true,
			displayOptions: { show: show(['updateProductSubstatus']) },
		},
		{
			displayName: 'Follow-Up Date Text',
			name: 'followUpDateText',
			type: 'string',
			default: '',
			required: true,
			description: 'Date text in the format expected by CoreBridge, for example 2025-05-19 14:00:00',
			displayOptions: { show: show(['updateProductFollowUpDueDate']) },
		},
		{
			displayName: 'Design Due Date Text',
			name: 'designDueDateText',
			type: 'string',
			default: '',
			required: true,
			description: 'Date text in the format expected by CoreBridge, for example 2025-03-04 10:00:00',
			displayOptions: { show: show(['updateProductDesignDueDate']) },
		},
		{
			displayName: 'Quick Product ID',
			name: 'quickProductId',
			type: 'number',
			default: 0,
			required: true,
			displayOptions: { show: show(['getQuickProductById']) },
		},
		{
			displayName: 'Include Inactive',
			name: 'includeInactive',
			type: 'boolean',
			default: false,
			displayOptions: { show: show(['getQuickProductById']) },
		},
		{
			displayName: 'Direction',
			name: 'direction',
			type: 'options',
			options: [
				{ name: 'Ascending', value: 'asc' },
				{ name: 'Descending', value: 'desc' },
			],
			default: 'desc',
			displayOptions: { show: show(['getEstimate']) },
		},
		{
			displayName: 'ID',
			name: 'id',
			type: 'string',
			default: '',
			required: true,
			displayOptions: { show: show(['getCustomerMergeHistoryById', 'getReconciliationDetailById']) },
		},
	];

	return fields.filter((field) => {
		const shown = field.displayOptions?.show?.operation;
		return Array.isArray(shown) && shown.length > 0;
	});
}

export function getGeneratedQuery(operation: string, parameters: IDataObject): IDataObject {
	const query: IDataObject = {};

	switch (operation) {
		case 'getCustomerMergeHistoryById':
		case 'getReconciliationDetailById':
			query.id = parameters.id;
			break;
		case 'getOrderStatement':
		case 'getWorkOrder':
			query.orderId = parameters.orderId;
			break;
		case 'getCustomerStatement':
			query.customerId = parameters.customerId;
			break;
		case 'getWorkOrderProduct':
		case 'getOrderProductById':
			query.orderProductId = parameters.orderProductId;
			if (operation === 'getOrderProductById') {
				query.id = parameters.orderProductId;
				delete query.orderProductId;
			}
			break;
		case 'getEstimate':
			query.direction = parameters.direction;
			break;
		case 'convertEstimate':
		case 'getOrderDetailById':
			query.id = parameters.orderId;
			break;
		case 'getOrderByInvoiceNumber':
			query.id = parameters.invoiceNumber;
			break;
		case 'updateProductStatus':
			query.orderProductId = parameters.orderProductId;
			query.newOrderProductStatusName = parameters.statusName;
			break;
		case 'getAvailableSubStatus':
			query.orderProductStatusName = parameters.statusName;
			break;
		case 'updateProductSubstatus':
			query.orderProductId = parameters.orderProductId;
			query.tag = parameters.substatusTag;
			break;
		case 'updateProductFollowUpDueDate':
			query.orderProductId = parameters.orderProductId;
			query.followUpDateText = parameters.followUpDateText;
			break;
		case 'updateProductDesignDueDate':
			query.orderProductId = parameters.orderProductId;
			query.designDueDateText = parameters.designDueDateText;
			break;
		case 'getQuickProductById':
			query.includeInactive = parameters.includeInactive;
			break;
	}

	return query;
}
