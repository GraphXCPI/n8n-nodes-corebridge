/* eslint-disable n8n-nodes-base/node-param-default-missing */
/* eslint-disable n8n-nodes-base/node-param-display-name-not-first-position */
import type { IDataObject, IExecuteFunctions, INode, INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

type BodyFieldType = 'boolean' | 'json' | 'number' | 'string';

type BodyField = {
	name: string;
	apiName?: string;
	displayName: string;
	type?: BodyFieldType;
	default?: boolean | number | string;
	required?: boolean;
	description?: string;
};

const pagingFields: BodyField[] = [
	{ name: 'page', displayName: 'Page', type: 'number', default: 1 },
	{ name: 'pageSize', displayName: 'Page Size', type: 'number', default: 10 },
	{ name: 'sort', displayName: 'Sort Field' },
	{ name: 'direction', displayName: 'Direction', default: 'asc' },
];

const contactFields: BodyField[] = [
	{ name: 'firstName', apiName: 'FirstName', displayName: 'First Name' },
	{ name: 'lastName', apiName: 'LastName', displayName: 'Last Name' },
	{ name: 'email', apiName: 'Email', displayName: 'Email' },
	{ name: 'customerId', apiName: 'CustomerId', displayName: 'Customer ID', type: 'number' },
	{ name: 'officePhone', apiName: 'OfficePhone', displayName: 'Office Phone' },
	{ name: 'officePhoneExtension', apiName: 'OfficePhoneExtension', displayName: 'Office Phone Extension' },
	{ name: 'cellPhone', apiName: 'CellPhone', displayName: 'Cell Phone' },
	{ name: 'otherPhone', apiName: 'OtherPhone', displayName: 'Other Phone' },
	{ name: 'otherPhoneType', apiName: 'OtherPhoneType', displayName: 'Other Phone Type' },
	{ name: 'contactTypeId', displayName: 'Contact Type ID', type: 'number' },
	{ name: 'customerLocationId', apiName: 'CustomerLocationId', displayName: 'Customer Location ID', type: 'number' },
	{ name: 'isActive', apiName: 'IsActive', displayName: 'Active', type: 'boolean', default: true },
];

const customerLocationFields: BodyField[] = [
	{ name: 'customerLocationId', displayName: 'Customer Location ID', type: 'number' },
	{ name: 'accountId', displayName: 'Account ID', type: 'number' },
	{ name: 'addressLocationId', displayName: 'Address Location ID', type: 'number' },
	{ name: 'addressLocationName', displayName: 'Address Location Name' },
	{ name: 'centerNumber', displayName: 'Center Number' },
	{ name: 'addressName', displayName: 'Address Name' },
	{ name: 'taxGroupId', displayName: 'Tax Group ID', type: 'number' },
	{ name: 'taxGroupName', displayName: 'Tax Group Name' },
	{ name: 'addressId', displayName: 'Address ID', type: 'number' },
	{ name: 'address1', displayName: 'Address 1' },
	{ name: 'address2', displayName: 'Address 2' },
	{ name: 'city', displayName: 'City' },
	{ name: 'state', displayName: 'State' },
	{ name: 'postalCode', displayName: 'Postal Code' },
	{ name: 'country', displayName: 'Country' },
	{ name: 'postalCodeExtended', displayName: 'Postal Code Extended' },
	{ name: 'isDefault', apiName: 'IsDefault', displayName: 'Default Location', type: 'boolean', default: false },
];

const customerV2Fields: BodyField[] = [
	{ name: 'companyLocationId', displayName: 'Company Location ID', type: 'number' },
	{ name: 'salesCenterLocationNumber', displayName: 'Sales Center Location Number' },
	{ name: 'accountId', displayName: 'Account ID', type: 'number' },
	{ name: 'companyName', displayName: 'Company Name' },
	{ name: 'companyPhone', displayName: 'Company Phone' },
	{ name: 'companyFax', displayName: 'Company Fax' },
	{ name: 'companyOtherPhone', displayName: 'Company Other Phone' },
	{ name: 'companyWebsite', displayName: 'Company Website' },
	{ name: 'taxExempt', displayName: 'Tax Exempt', type: 'boolean', default: false },
	{ name: 'taxNumber', displayName: 'Tax Number' },
	{ name: 'taxExemptExpirationDate', displayName: 'Tax Exempt Expiration Date' },
	{ name: 'poNumberRequired', displayName: 'PO Number Required', type: 'boolean', default: false },
	{ name: 'customerTermsId', displayName: 'Customer Terms ID', type: 'number' },
	{ name: 'creditLimit', displayName: 'Credit Limit', type: 'number' },
	{ name: 'companySalesPersonId', displayName: 'Company Salesperson ID', type: 'number' },
	{ name: 'originationTypeId', displayName: 'Origination Type ID', type: 'number' },
	{ name: 'industryTypeId', displayName: 'Industry Type ID', type: 'number' },
	{ name: 'accountTypeId', displayName: 'Account Type ID', type: 'number' },
	{ name: 'isActive', displayName: 'Active', type: 'boolean', default: true },
	{ name: 'primaryAccountContact', displayName: 'Primary Account Contact', type: 'json', default: '{}' },
	{ name: 'billingContact', displayName: 'Billing Contact', type: 'json', default: '{}' },
	{ name: 'defaultCustomerAddress', displayName: 'Default Customer Address', type: 'json', default: '{}' },
	{ name: 'billingAddress', displayName: 'Billing Address', type: 'json', default: '{}' },
	{ name: 'royaltyOverrides', displayName: 'Royalty Overrides (JSON Object Array)', type: 'json', default: '[]' },
];

const genericOrderFields: BodyField[] = [
	{ name: 'subscriberId', apiName: 'SubscriberId', displayName: 'Subscriber ID' },
	{ name: 'externalId', apiName: 'ExternalId', displayName: 'External ID' },
	{ name: 'externalReference', apiName: 'ExternalReference', displayName: 'External Reference' },
	{ name: 'orderDescription', apiName: 'OrderDescription', displayName: 'Order Description' },
	{ name: 'externalAccountId', apiName: 'ExternalAccountId', displayName: 'External Account ID' },
	{ name: 'cbAccountId', apiName: 'CbAccountId', displayName: 'CoreBridge Account ID', type: 'number' },
	{ name: 'purchaseOrderNumber', apiName: 'PurchaseOrderNumber', displayName: 'Purchase Order Number' },
	{ name: 'orderOrigination', apiName: 'OrderOrigination', displayName: 'Order Origination' },
	{ name: 'orderOriginationId', apiName: 'OrderOriginationId', displayName: 'Order Origination ID', type: 'number' },
	{ name: 'orderContactId', apiName: 'OrderContactId', displayName: 'Order Contact ID', type: 'number' },
	{ name: 'orderContactEmail', apiName: 'OrderContactEmail', displayName: 'Order Contact Email' },
	{ name: 'orderSalesPersonId', apiName: 'OrderSalesPersonId', displayName: 'Order Salesperson ID', type: 'number' },
	{ name: 'overrideOrderSalesLocationId', apiName: 'OverrideOrderSalesLocationId', displayName: 'Sales Location ID', type: 'number' },
	{ name: 'overrideAssignedTaxGroupId', apiName: 'OverrideAssignedTaxGroupId', displayName: 'Tax Group ID', type: 'number' },
	{ name: 'enteredByUserId', apiName: 'EnteredByUserId', displayName: 'Entered By User ID', type: 'number' },
	{ name: 'isEstimate', apiName: 'IsEstimate', displayName: 'Create as Estimate', type: 'boolean', default: true },
	{ name: 'orderSubTotal', apiName: 'OrderSubTotal', displayName: 'Order Subtotal', type: 'number' },
	{ name: 'orderDiscount', apiName: 'OrderDiscount', displayName: 'Order Discount', type: 'number' },
	{ name: 'orderShipping', apiName: 'OrderShipping', displayName: 'Order Shipping', type: 'number' },
	{ name: 'orderPostage', apiName: 'OrderPostage', displayName: 'Order Postage', type: 'number' },
	{ name: 'orderTaxPrice', apiName: 'OrderTaxPrice', displayName: 'Order Tax', type: 'number' },
	{ name: 'orderTotal', apiName: 'OrderTotal', displayName: 'Order Total', type: 'number' },
	{ name: 'account', apiName: 'Account', displayName: 'New Account', type: 'json', default: '{}' },
	{ name: 'orderBillingAddress', apiName: 'OrderBillingAddress', displayName: 'Billing Address', type: 'json', default: '{}' },
	{ name: 'orderShippingAddress', apiName: 'OrderShippingAddress', displayName: 'Shipping Address', type: 'json', default: '{}' },
	{ name: 'taxes', apiName: 'Taxes', displayName: 'Taxes (JSON Object Array)', type: 'json', default: '[]' },
	{ name: 'genericOrderLineItems', apiName: 'GenericOrderLineItems', displayName: 'Line Items (JSON Object Array)', type: 'json', default: '[]', required: true },
	{ name: 'destinations', apiName: 'Destinations', displayName: 'Destinations (JSON Object Array)', type: 'json', default: '[]' },
];

const bodyFields: Record<string, BodyField[]> = {
	searchContacts: [
		{ name: 'id', displayName: 'Contact ID', type: 'number' },
		{ name: 'accountId', displayName: 'Account ID', type: 'number' },
		{ name: 'email', displayName: 'Email' },
		{ name: 'modifiedAfterDate', displayName: 'Modified After Date' },
		{ name: 'createdAfterDate', displayName: 'Created After Date' },
		{ name: 'locationId', displayName: 'Location ID', type: 'number' },
		...pagingFields,
	],
	createContact: contactFields.map((field) =>
		['firstName', 'lastName', 'email', 'customerId'].includes(field.name) ? { ...field, required: true } : field,
	),
	updateContact: [
		{ name: 'contactId', displayName: 'Contact ID', type: 'number', required: true },
		...contactFields.map((field) => ({ ...field, apiName: field.name })),
		{ name: 'birthday', displayName: 'Birthday' },
		{ name: 'anniversary', displayName: 'Anniversary' },
		{ name: 'position', displayName: 'Position' },
		{ name: 'jobAuthority', displayName: 'Job Authority ID', type: 'number' },
		{ name: 'isPrimary', displayName: 'Primary Contact', type: 'boolean', default: false },
		{ name: 'isBilling', displayName: 'Billing Contact', type: 'boolean', default: false },
	],
	createContactType: [{ name: 'name', apiName: 'Name', displayName: 'Name', required: true }],
	createCustomerLegacy: [
		{ name: 'companyName', apiName: 'CompanyName', displayName: 'Company Name', required: true },
		{ name: 'companyPhone', apiName: 'CompanyPhone', displayName: 'Company Phone', required: true },
		{ name: 'firstName', apiName: 'FirstName', displayName: 'First Name', required: true },
		{ name: 'lastName', apiName: 'LastName', displayName: 'Last Name', required: true },
		{ name: 'email', apiName: 'Email', displayName: 'Email', required: true },
		{ name: 'address1', apiName: 'Address1', displayName: 'Address 1', required: true },
		{ name: 'address2', apiName: 'Address2', displayName: 'Address 2' },
		{ name: 'city', apiName: 'City', displayName: 'City', required: true },
		{ name: 'state', apiName: 'State', displayName: 'State', required: true },
		{ name: 'postalCode', apiName: 'PostalCode', displayName: 'Postal Code', required: true },
		{ name: 'referralTypeId', apiName: 'ReferralTypeId', displayName: 'Referral Type ID', type: 'number', required: true },
		{ name: 'companyFax', apiName: 'CompanyFax', displayName: 'Company Fax' },
		{ name: 'website', apiName: 'Website', displayName: 'Website' },
		{ name: 'companySalespersonId', apiName: 'CompanySalespersonId', displayName: 'Company Salesperson ID', type: 'number' },
		{ name: 'defaultLocationId', apiName: 'DefaultLocationID', displayName: 'Default Location ID', type: 'number' },
		{ name: 'industryTypeId', apiName: 'IndustryTypeId', displayName: 'Industry Type ID', type: 'number' },
		{ name: 'accountStatusId', apiName: 'AccountStatusId', displayName: 'Account Status ID', type: 'number', default: 1 },
		{ name: 'isActive', apiName: 'IsActive', displayName: 'Active', type: 'boolean', default: true },
	],
	createCustomerLocation: customerLocationFields,
	updateCustomerLocation: customerLocationFields,
	updateCustomerName: [
		{ name: 'id', apiName: 'Id', displayName: 'Customer ID', type: 'number', required: true },
		{ name: 'newCompanyName', apiName: 'NewCompanyName', displayName: 'New Company Name', required: true },
	],
	createCustomerNote: [{ name: 'note', displayName: 'Note', required: true }],
	createReferralType: [
		{ name: 'name', apiName: 'Name', displayName: 'Name', required: true },
		{ name: 'parentId', apiName: 'ParentId', displayName: 'Parent ID', type: 'number' },
	],
	searchCustomers: [
		{ name: 'id', apiName: 'Id', displayName: 'Customer ID', type: 'number' },
		{ name: 'companyName', apiName: 'CompanyName', displayName: 'Company Name' },
		{ name: 'accountType', apiName: 'AccountType', displayName: 'Account Type' },
		{ name: 'isActive', apiName: 'IsActive', displayName: 'Active', type: 'boolean', default: true },
		{ name: 'modifiedAfterDate', apiName: 'ModifiedAfterDate', displayName: 'Modified After Date' },
		{ name: 'createdAfterDate', apiName: 'CreatedAfterDate', displayName: 'Created After Date' },
		{ name: 'includeRoyaltyOverrides', apiName: 'IncludeRoyaltyOverrides', displayName: 'Include Royalty Overrides', type: 'boolean', default: false },
		{ name: 'locationId', apiName: 'LocationId', displayName: 'Location ID', type: 'number' },
		...pagingFields.map((field) => ({ ...field, apiName: `${field.name[0].toUpperCase()}${field.name.slice(1)}` })),
	],
	createCustomer: customerV2Fields,
	updateCustomer: customerV2Fields,
	searchCustomerMergeHistory: [
		{ name: 'accountId', displayName: 'Account ID', type: 'number' },
		{ name: 'mergedOnOrAfter', displayName: 'Merged On or After' },
		...pagingFields,
	],
	cancelEstimate: [
		{ name: 'orderId', displayName: 'Order ID', type: 'number', required: true },
		{ name: 'cancelNotes', displayName: 'Cancel Notes' },
	],
	createGenericOrder: genericOrderFields,
	searchOrders: [
		{ name: 'id', displayName: 'Order ID', type: 'number' },
		{ name: 'invoiceNumber', displayName: 'Invoice Number' },
		{ name: 'estimateNumber', displayName: 'Estimate Number' },
		{ name: 'orderDescription', displayName: 'Order Description' },
		{ name: 'poNumber', displayName: 'PO Number' },
		{ name: 'orderCompanyName', displayName: 'Company Name' },
		{ name: 'orderSalespersonId', displayName: 'Salesperson ID', type: 'number' },
		{ name: 'orderLocationId', displayName: 'Location ID', type: 'number' },
		{ name: 'enteredById', displayName: 'Entered By ID', type: 'number' },
		{ name: 'orderStatusId', displayName: 'Status ID', type: 'number' },
		{ name: 'orderStatusName', displayName: 'Status Name' },
		{ name: 'dateFilterFor', displayName: 'Date Filter For', default: 'created' },
		{ name: 'startDate', displayName: 'Start Date' },
		{ name: 'endDate', displayName: 'End Date' },
		{ name: 'includeImportDetails', displayName: 'Include Import Details', type: 'boolean', default: false },
		{ name: 'includeProductDetails', displayName: 'Include Product Details', type: 'boolean', default: false },
		...pagingFields,
	],
	addOrderNotes: [
		{ name: 'orderId', displayName: 'Order ID', type: 'number', required: true },
		{ name: 'orderNotes', displayName: 'Order Notes' },
		{ name: 'important', displayName: 'Important', type: 'boolean', default: false },
	],
	updateOrderNotes: [
		{ name: 'orderId', displayName: 'Order ID', type: 'number', required: true },
		{ name: 'orderNotes', displayName: 'Order Notes' },
		{ name: 'important', displayName: 'Important', type: 'boolean', default: false },
	],
	updateOrderDueDate: [
		{ name: 'id', apiName: 'Id', displayName: 'Order ID', type: 'number', required: true },
		{ name: 'dueDate', apiName: 'DueDate', displayName: 'Due Date', required: true },
		{ name: 'timeZone', apiName: 'TimeZone', displayName: 'Time Zone', required: true },
	],
	searchRoyaltyOverrides: [
		{ name: 'accountId', displayName: 'Account ID', type: 'number' },
		...pagingFields,
	],
	searchQuickProducts: [
		{ name: 'searchText', displayName: 'Search Text' },
		{ name: 'locationId', displayName: 'Location ID', type: 'number' },
		{ name: 'includeInactive', displayName: 'Include Inactive', type: 'boolean', default: false },
		...pagingFields,
	],
};

export function hasStructuredBody(operation: string): boolean {
	return Boolean(bodyFields[operation]);
}

export function getBodyProperties(operations: string[]): INodeProperties[] {
	const supported = operations.filter(hasStructuredBody);
	if (supported.length === 0) return [];

	const properties: INodeProperties[] = [
		{
			displayName: 'Body Input',
			name: 'bodyMode',
			type: 'options',
			options: [
				{ name: 'Fields', value: 'fields' },
				{ name: 'JSON', value: 'json' },
			],
			default: 'fields',
			displayOptions: { show: { operation: supported } },
			description: 'Use guided fields or send the complete documented request object as JSON',
		},
	];

	for (const operation of supported) {
		for (const field of bodyFields[operation]) {
			properties.push({
				displayName: field.displayName,
				name: `body_${operation}_${field.name}`,
				type: field.type ?? 'string',
				default: field.default ?? (field.type === 'boolean' ? false : field.type === 'number' ? 0 : ''),
				required: field.required,
				description: field.description,
				displayOptions: { show: { operation: [operation], bodyMode: ['fields'] } },
			});
		}
	}

	properties.push(
		{
			displayName: 'Additional JSON Fields',
			name: 'additionalBodyJson',
			type: 'json',
			default: '{}',
			description: 'Optional documented fields not shown above. Values override guided fields with the same API key.',
			displayOptions: { show: { operation: supported, bodyMode: ['fields'] } },
		},
		{
			displayName: 'JSON Body',
			name: 'jsonBody',
			type: 'json',
			default: '{}',
			description: 'Complete CoreBridge request body',
			displayOptions: { show: { operation: supported, bodyMode: ['json'] } },
		},
	);

	return properties;
}

function parseJson(value: unknown, label: string, node: INode): IDataObject | IDataObject[] {
	if (typeof value !== 'string') return value as IDataObject | IDataObject[];
	try {
		return JSON.parse(value) as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeOperationError(node, `Invalid ${label}: ${(error as Error).message}`);
	}
}

function isEmpty(value: unknown, type: BodyFieldType | undefined): boolean {
	if (type === 'boolean') return false;
	if (type === 'number') return value === undefined || value === null || value === '' || value === 0;
	return value === undefined || value === null || value === '' || value === '{}' || value === '[]';
}

export function buildRequestBody(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	node: INode,
): IDataObject | IDataObject[] {
	const savedParameters = node.parameters as IDataObject;
	const legacyJsonBody = savedParameters.jsonBody;
	const savedMode = savedParameters.bodyMode;
	const mode = savedMode === undefined && legacyJsonBody !== undefined ? 'json' : executeFunctions.getNodeParameter('bodyMode', itemIndex, 'fields');

	if (mode === 'json' || !hasStructuredBody(operation)) {
		return parseJson(executeFunctions.getNodeParameter('jsonBody', itemIndex, '{}'), 'JSON body', node);
	}

	const body: IDataObject = {};
	for (const field of bodyFields[operation]) {
		const value = executeFunctions.getNodeParameter(`body_${operation}_${field.name}`, itemIndex, field.default ?? '');
		if (isEmpty(value, field.type)) continue;
		body[field.apiName ?? field.name] = field.type === 'json' ? parseJson(value, field.displayName, node) : value as never;
	}

	const additional = parseJson(executeFunctions.getNodeParameter('additionalBodyJson', itemIndex, '{}'), 'additional JSON fields', node);
	if (Array.isArray(additional)) {
		throw new NodeOperationError(node, 'Additional JSON Fields must be a JSON object');
	}
	return { ...body, ...additional };
}
