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
	aliases?: string[];
	options?: string[];
	maxLength?: number;
	min?: number;
	max?: number;
	integer?: boolean;
	optionalBoolean?: boolean;
	stringBoolean?: boolean;
	children?: BodyField[];
	array?: boolean;
};

const pagingFields: BodyField[] = [
	{ name: 'page', displayName: 'Page', type: 'number', default: 1, min: 1, integer: true },
	{ name: 'pageSize', displayName: 'Page Size', type: 'number', default: 10, min: 1, max: 50, integer: true },
	{ name: 'sort', displayName: 'Sort Field', default: 'id' },
	{ name: 'direction', displayName: 'Direction', default: 'asc', options: ['asc', 'desc'] },
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
		...contactFields.map((field) => field.name === 'customerId'
			? { ...field, name: 'accountId', apiName: 'accountId', aliases: ['customerId'], displayName: 'Account ID' }
			: { ...field, apiName: field.name, optionalBoolean: field.type === 'boolean' }),
		{ name: 'birthday', displayName: 'Birthday' },
		{ name: 'anniversary', displayName: 'Anniversary' },
		{ name: 'position', displayName: 'Position' },
		{ name: 'jobAuthority', displayName: 'Job Authority ID', type: 'number' },
		{ name: 'isPrimary', displayName: 'Primary Contact', type: 'boolean', optionalBoolean: true },
		{ name: 'isBilling', displayName: 'Billing Contact', type: 'boolean', optionalBoolean: true },
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
	createCustomerLocation: customerLocationFields.filter((field) => !['addressId', 'customerLocationId'].includes(field.name)).map((field) => ({ ...field, required: ['accountId', 'addressName', 'address1', 'city', 'country'].includes(field.name) })),
	updateCustomerLocation: customerLocationFields.filter((field) => field.name !== 'addressId').map((field) => ({ ...field, required: field.name === 'customerLocationId', optionalBoolean: field.type === 'boolean' })),
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
	createCustomer: customerV2Fields.filter((field) => field.name !== 'accountId').map((field) => ({ ...field, required: ['companyName', 'primaryAccountContact'].includes(field.name), optionalBoolean: field.type === 'boolean' })),
	updateCustomer: customerV2Fields.map((field) => ({ ...field, required: field.name === 'accountId', optionalBoolean: field.type === 'boolean' })),
	searchCustomerMergeHistory: [
		{ name: 'accountId', displayName: 'Account ID', type: 'number' },
		{ name: 'mergedOnOrAfter', displayName: 'Merged On or After' },
		...pagingFields.map((field) => ({ ...field, apiName: `${field.name[0].toUpperCase()}${field.name.slice(1)}` })),
	],
	cancelEstimate: [
		{ name: 'orderId', displayName: 'Order ID', type: 'number', required: true },
		{ name: 'cancelNotes', displayName: 'Cancel Notes', required: true, maxLength: 65000 },
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
		...pagingFields.map((field) => field.name === 'pageSize' ? { ...field, default: 50, max: undefined } : field.name === 'sort' ? { ...field, default: 'accountId', options: ['accountId', 'id'] } : field),
	],
	searchQuickProducts: [
		{ name: 'name', apiName: 'Name', aliases: ['searchText'], displayName: 'Name Contains' },
		{ name: 'quickProductId', apiName: 'QuickProductId', displayName: 'Quick Product ID', type: 'number' },
		{ name: 'externalId', apiName: 'ExternalId', displayName: 'External ID' },
		{ name: 'productCategoryId', apiName: 'ProductCategoryId', displayName: 'Product Category ID', type: 'number' },
		{ name: 'quickProductCategoryId', apiName: 'QuickProductCategoryId', displayName: 'Quick Product Category ID', type: 'number' },
		{ name: 'customerAccountId', apiName: 'CustomerAccountId', displayName: 'Customer Account ID', type: 'number' },
		{ name: 'isGlobal', apiName: 'IsGlobal', displayName: 'Global', type: 'boolean', optionalBoolean: true },
		{ name: 'ecommerceEnabled', apiName: 'EcommerceEnabled', displayName: 'Ecommerce Enabled', type: 'boolean', optionalBoolean: true },
		{ name: 'includeInactive', apiName: 'IncludeInactive', displayName: 'Include Inactive', type: 'boolean', optionalBoolean: true },
		...pagingFields.map((field) => ({ ...field, apiName: `${field.name[0].toUpperCase()}${field.name.slice(1)}` })),
	],
};

// Nested names are the documented wire keys; legacy JSON parameters remain available.
function fields(names: string, type: BodyFieldType = 'string'): BodyField[] {
	return names.split(' ').map((name) => ({ name, displayName: name.replace(/([a-z])([A-Z])/g, '$1 $2'), type, optionalBoolean: type === 'boolean' }));
}

function nested(name: string, children: BodyField[], array = false): BodyField {
	return { name, displayName: name.replace(/([a-z])([A-Z])/g, '$1 $2'), type: 'json', children, array };
}

const addressFields = [
	...fields('addressId', 'number'),
	...fields('address1 address2 city state postalCode country postalCodeExtended'),
];
const nestedContactFields = bodyFields.updateContact.map((field) => ({ ...field, required: false, aliases: undefined }));
const genericAddressFields = [
	...fields('ExternalId Name CompanyName FreeFormContact PhoneNumber StreetAddress1 StreetAddress2 City StateCode PostalCode PostalCodeExtended CountryCode Email'),
	...fields('CbId', 'number'), ...fields('IsDefaultBilling IsDefaultShipping', 'boolean'),
];
const shipmentFields = [
	...fields('ExternalId ExternalOrderId Name Email Address1 Address2 City State Zip ZipExtended CountryCode Phone ArrivalDate DeliveryMethod Description'),
	...fields('CbId', 'number'), ...fields('IsDropship', 'boolean'),
	nested('OrderAddressItems', [...fields('ExternalLineItemId'), ...fields('Qty', 'number')], true),
];
const lineFields = [
	...fields('ExternalId ExternalProductId ExternalShipToAddressId ProductDescription ProductDescription2 ProductSubStatus ProductDesignDue ProductProductionDue IncomeAccountName ShipMethod ProductSummary ExternalImagePath EcommExternalImagePath'),
	{ name: 'ProductQuantity', displayName: 'Product Quantity', type: 'number' as const, required: true, min: 1, integer: true },
	...fields('ProductSubTotal ProductSetupFee SetupFeeAmountSubtotal ProductTotal UnitPrice UnitCost CBProductCategoryId CBIncomeAccountUsedId Tax Taxable NonTaxable', 'number'),
	...fields('IsVended UseQuickProductPricing IsTaxable', 'boolean'),
	{ name: 'PartIds', displayName: 'Part IDs (JSON Array)', type: 'json' as const },
	nested('OrderProductNotes', [{ ...fields('Key')[0], options: ['Sales', 'Design', 'Production', 'Customer', 'Vendor'] }, ...fields('Value')], true),
	nested('Designer', [...fields('CbId', 'number'), ...fields('FirstName LastName Email')]),
	nested('Parts', [...fields('CbId', 'number'), ...fields('ExternalId PartDescription PartInfoHtml ModifierInfoHtml PartText PartNotes')], true),
	nested('Files', fields('Type Link'), true),
];
const accountFields = [
	...fields('ExternalId CompanyName CompanyPhone CompanyFax CompanyOtherPhone Website TaxNumber Notes DateCreated DateCreatedTz ModifiedDate ModifiedDateTz'),
	...fields('IsTaxExempt IsActive', 'boolean'),
	nested('Contact', [...fields('ExternalId FirstName LastName EmailAddress PrimaryPhoneNumber PrimaryPhoneNumberExtension SecondaryPhoneNumber'), ...fields('CbId', 'number')]),
	nested('Addresses', genericAddressFields, true),
];
const paymentFields = [
	{ ...fields('PaymentType')[0], options: ['ACH', 'Visa', 'MasterCard', 'Discover', 'AMEX', 'Cash', 'Check', 'CreditCard', 'CustomerCredit', 'Imported', 'Wire', 'BadDebt', 'Other'] },
	...fields('ExternalOrderId CustomPaymentType Notes Location CreatedDate CheckNumber CheckIDNumber TransactionData1 TransactionData2 TransactionData3'),
	...fields('CbOrderId Amount', 'number'),
];
const orderNested: Record<string, BodyField> = {
	account: nested('account', accountFields),
	orderBillingAddress: nested('orderBillingAddress', genericAddressFields),
	orderShippingAddress: nested('orderShippingAddress', genericAddressFields),
	taxes: nested('taxes', [...fields('Name DisplayName'), ...fields('Rate Amount CbId', 'number')], true),
	genericOrderLineItems: nested('genericOrderLineItems', lineFields, true),
};
bodyFields.createGenericOrder = genericOrderFields
	.filter((field) => !['enteredByUserId', 'orderOriginationId', 'destinations'].includes(field.name))
	.map((field) => ({ ...field, ...(orderNested[field.name] ? { children: orderNested[field.name].children, array: orderNested[field.name].array } : {}), ...(field.name === 'isEstimate' ? { default: false } : {}) }));
for (const field of [
	...fields('PrinterOrderId OrderTaxableAmount OrderNonTaxableAmount OrderNewSubtotal IntegrationSystemTypeId', 'number'),
	...fields('CompanyName OrderContact OrderSalesPerson OrderSalesLocation AssignedTaxGroup OrderDueDate DateCompleted DateFirstInvoiceSent Notes Notes2'),
	...fields('IsFixedDueDate IsShippingTaxable IsPostageTaxable ForceOverrideUseDefaultTaxGroup', 'boolean'),
	nested('EnteredBy', [...fields('Id', 'number'), ...fields('UserName FullName')]),
	nested('OrderPayments', paymentFields, true),
	nested('OrderShipments', [...shipmentFields, ...fields('ExternalLineItemId TrackingNumbers Carrier ServiceType Company'), ...fields('TotalShipmentCost QtyShipped', 'number')], true),
	nested('OrderAddresses', [...shipmentFields, ...fields('Carrier ServiceType Company TrackingNumbers')], true),
]) {
	bodyFields.createGenericOrder.push({ ...field, apiName: field.name, name: field.name[0].toLowerCase() + field.name.slice(1) });
}

for (const operation of ['createCustomer', 'updateCustomer']) {
	for (const field of bodyFields[operation]) {
		if (['primaryAccountContact', 'billingContact'].includes(field.name)) field.children = nestedContactFields;
		if (['defaultCustomerAddress', 'billingAddress'].includes(field.name)) field.children = addressFields;
		if (field.name === 'royaltyOverrides') {
			field.array = true;
			field.children = fields('accountRoyaltyOverrideId accountId royaltyGroupId overriddenRoyaltyPlanId', 'number');
		}
	}
}
for (const field of bodyFields.searchCustomers) {
	field.apiName = field.name; // PDF ExAccountFilter, not the conflicting Postman sample casing.
	if (field.name === 'includeRoyaltyOverrides') field.stringBoolean = true;
	if (field.name === 'isActive') field.optionalBoolean = true;
	if (field.name === 'accountType') field.options = ['Lead', 'Prospect', 'Client'];
}
for (const operation of ['createContact', 'updateContact']) {
	for (const field of bodyFields[operation]) {
		if (field.name === 'otherPhoneType') field.options = ['Office Phone', 'Cell Phone', 'Home Phone', 'Fax'];
		if (operation === 'createContact') {
			field.maxLength = ({ firstName: 25, lastName: 50, email: 100, officePhone: 25, officePhoneExtension: 25, cellPhone: 25, otherPhone: 25 } as Record<string, number>)[field.name];
		}
	}
}
for (const operation of ['searchContacts', 'searchCustomers']) {
	const sort = bodyFields[operation].find((field) => field.name === 'sort')!;
	sort.options = operation === 'searchContacts' ? ['id', 'firstName', 'lastName', 'email', 'modified', 'created'] : ['id', 'companyName', 'modified', 'created'];
}
bodyFields.searchOrders.find((field) => field.name === 'dateFilterFor')!.options = ['created', 'modified', 'dueDate'];
bodyFields.addOrderNotes.find((field) => field.name === 'orderNotes')!.maxLength = 2000;

export function hasStructuredBody(operation: string): boolean {
	return Boolean(bodyFields[operation]);
}

function fieldProperty(field: BodyField, name = field.name): INodeProperties {
	const property: INodeProperties = {
		displayName: field.displayName, name, type: field.type ?? 'string',
		default: field.optionalBoolean ? '' : field.default ?? (field.type === 'number' ? '' : field.type === 'boolean' ? false : ''),
		required: field.required, description: field.description,
	};
	if (field.options) {
		property.type = 'options';
		property.options = [...(field.required || field.default ? [] : [{ name: 'Not Set', value: '' }]), ...field.options.map((value) => ({ name: value, value }))];
	}
	if (field.optionalBoolean) {
		property.type = 'options';
		property.options = [{ name: 'Not Set / Unchanged', value: '' }, { name: 'Yes', value: true }, { name: 'No', value: false }];
	}
	if (field.type === 'number') property.typeOptions = { ...(field.min !== undefined ? { minValue: field.min } : {}), ...(field.max !== undefined ? { maxValue: field.max } : {}), ...(field.integer ? { numberPrecision: 0 } : {}) };
	if (field.children) {
		property.type = field.array ? 'fixedCollection' : 'collection';
		property.default = {};
		property.placeholder = field.array ? 'Add Item' : 'Add Field';
		property.typeOptions = field.array ? { multipleValues: true } : {};
		const values = field.children.map((child) => fieldProperty(child));
		property.options = field.array ? [{ name: 'items', displayName: 'Items', values }] : values;
	}
	return property;
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
			const name = `body_${operation}_${field.name}`;
			const show = { operation: [operation], bodyMode: ['fields'] };
			if (field.children) {
				properties.push({ displayName: `${field.displayName} Input`, name: `${name}_mode`, type: 'options', options: [{ name: 'Fields', value: 'fields' }, { name: 'JSON', value: 'json' }], default: 'fields', displayOptions: { show } });
				properties.push({ ...fieldProperty(field, `${name}_fields`), displayOptions: { show: { ...show, [`${name}_mode`]: ['fields'] } } });
				properties.push({ ...fieldProperty({ ...field, children: undefined }, name), default: field.array ? '[]' : '{}', displayOptions: { show: { ...show, [`${name}_mode`]: ['json'] } } });
			} else properties.push({ ...fieldProperty(field, name), displayOptions: { show } });
			for (const alias of field.aliases ?? []) {
				properties.push({ displayName: `${field.displayName} (Legacy Alias)`, name: `body_${operation}_${alias}`, type: 'hidden', default: '' });
			}
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

function parseJson(value: unknown, label: string, node: INode): unknown {
	if (typeof value !== 'string') return value;
	try {
		return JSON.parse(value);
	} catch {
		throw new NodeOperationError(node, `Invalid ${label}: expected valid JSON`);
	}
}

function isObject(value: unknown): value is IDataObject {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isEmpty(value: unknown): boolean {
	return value === undefined || value === null || value === '';
}

function fail(node: INode, message: string): never {
	throw new NodeOperationError(node, message);
}

function validateFields(body: IDataObject, schema: BodyField[], node: INode, path = ''): void {
	for (const field of schema) {
		const key = field.apiName ?? field.name;
		const label = `${path}${key}`;
		const value = body[key];
		if (isEmpty(value)) {
			if (field.required) fail(node, `${label} is required`);
			continue;
		}
		if (field.children) {
			if (field.array) {
				if (!Array.isArray(value) || value.some((item) => !isObject(item))) fail(node, `${label} must be an array of objects`);
				if (field.required && value.length === 0) fail(node, `${label} must contain at least one item`);
				value.forEach((item, index) => validateFields(item as IDataObject, field.children!, node, `${label}[${index}].`));
			} else {
				if (!isObject(value)) fail(node, `${label} must be an object`);
				if (field.required && Object.keys(value).length === 0) fail(node, `${label} must not be empty`);
				validateFields(value, field.children, node, `${label}.`);
			}
		} else if (field.type === 'number') {
			if (typeof value !== 'number' || !Number.isFinite(value)) fail(node, `${label} must be a finite number`);
			const id = /(?:Id|ID)$/.test(key) || key === 'id' || key === 'jobAuthority';
			if ((field.integer || id) && !Number.isInteger(value)) fail(node, `${label} must be an integer`);
			if (field.min !== undefined && value < field.min) fail(node, `${label} must be at least ${field.min}`);
			if (field.max !== undefined && value > field.max) fail(node, `${label} must be at most ${field.max}`);
			if (id && value < 0) fail(node, `${label} must not be negative`);
			if (id && field.required && value === 0) fail(node, `${label} must be greater than zero`);
		} else if (field.type === 'boolean') {
			if (field.stringBoolean ? !['true', 'false'].includes(value as string) : typeof value !== 'boolean') fail(node, `${label} must be ${field.stringBoolean ? '"true" or "false"' : 'a boolean'}`);
		} else if (field.type !== 'json') {
			if (typeof value !== 'string') fail(node, `${label} must be a string`);
			if (field.required && !value.trim()) fail(node, `${label} must not be blank`);
			if (field.maxLength && value.length > field.maxLength) fail(node, `${label} exceeds ${field.maxLength} characters`);
			if (/^(email|Email|EmailAddress|OrderContactEmail)$/.test(key) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail(node, `${label} must be a valid email address`);
			if (/^(country|CountryCode)$/.test(key) && !/^[A-Za-z]{2}$/.test(value)) fail(node, `${label} must be a two-letter ISO code`);
			if (/^(birthday|anniversary|modifiedAfterDate|createdAfterDate|mergedOnOrAfter|startDate|endDate|taxExemptExpirationDate|OrderDueDate|DateCompleted|DateFirstInvoiceSent|ProductDesignDue|ProductProductionDue|ArrivalDate|DateCreated|ModifiedDate|CreatedDate)$/.test(key) && (!/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value) || !Number.isFinite(Date.parse(value)))) fail(node, `${label} must be an ISO date or date-time`);
		}
		if (field.options && !field.options.includes(value as string)) fail(node, `${label} is not a documented option`);
	}
}

function structuredValue(value: unknown, field: BodyField, node: INode): unknown {
	if (!field.children) return field.type === 'json' ? parseJson(value, field.displayName, node) : value;
	if (!isObject(value)) fail(node, `${field.displayName} fields must be an object`);
	if (field.array) {
		const items = value.items ?? [];
		if (!Array.isArray(items)) fail(node, `${field.displayName} items must be an array`);
		return items.map((item) => structuredValue(item, { ...field, array: false }, node));
	}
	const result: IDataObject = {};
	for (const child of field.children) {
		const raw = value[child.name];
		if (isEmpty(raw)) continue;
		result[child.apiName ?? child.name] = structuredValue(raw, child, node) as never;
	}
	return result;
}

function validateBody(body: unknown, operation: string, node: INode, validateContract = true): IDataObject | string {
	if (operation === 'createCustomerNote') {
		if (typeof body !== 'string') fail(node, 'Customer note body must be a JSON string');
		if (validateContract && !body.trim()) fail(node, 'Customer note body must be a non-empty JSON string');
		return body;
	}
	if (!isObject(body)) fail(node, 'JSON body must be an object');
	// Saved JSON is a wire-level escape hatch: partial docs cannot constrain live payloads.
	if (!validateContract) return body;
	validateFields(body, bodyFields[operation] ?? [], node);
	if (operation === 'createCustomer') {
		validateFields(body.primaryAccountContact as IDataObject, fields('firstName lastName email').map((field) => ({ ...field, required: true })), node, 'primaryAccountContact.');
	}
	if (operation === 'updateContact' && body.isActive === false && (body.isPrimary === true || body.isBilling === true)) fail(node, 'An inactive contact cannot be primary or billing');
	if (['createCustomerLocation', 'updateCustomerLocation'].includes(operation) && body.country !== undefined && (typeof body.country !== 'string' || !/^[A-Za-z]{2}$/.test(body.country))) fail(node, 'country must be a two-letter ISO code');
	if (operation === 'updateOrderDueDate' && (typeof body.DueDate !== 'string' || !/(?:Z|[+-]\d{2}:\d{2})$/.test(body.DueDate) || !Number.isFinite(Date.parse(body.DueDate)))) fail(node, 'DueDate must be an ISO date-time with a timezone offset');
	if (operation === 'createGenericOrder') {
		if (body.Destinations !== undefined) fail(node, 'Destinations is not documented for GenericOrder. Use OrderShipments or OrderAddresses with their documented schema.');
		if (!(typeof body.CbAccountId === 'number' && body.CbAccountId > 0)) {
			if (!isObject(body.Account) || !(body.Account.CompanyName || body.Account.ExternalId)) fail(node, 'Provide CbAccountId > 0 or Account with CompanyName or ExternalId');
		}
		for (const item of body.GenericOrderLineItems as IDataObject[]) {
			if (!(typeof item.ProductDescription === 'string' && item.ProductDescription.trim()) && !(typeof item.ExternalProductId === 'string' && item.ExternalProductId.trim())) fail(node, 'Each line item requires ProductDescription or ExternalProductId');
			if (item.PartIds !== undefined && (!Array.isArray(item.PartIds) || item.PartIds.some((id) => typeof id !== 'number' || !Number.isInteger(id) || id <= 0))) fail(node, 'PartIds must be an array of positive integers');
		}
		for (const payment of (body.OrderPayments ?? []) as IDataObject[]) {
			if (payment.PaymentType === 'Other' && !(typeof payment.CustomPaymentType === 'string' && payment.CustomPaymentType.trim())) fail(node, 'CustomPaymentType is required for Other payments');
		}
	}
	return body;
}

export function buildRequestBody(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	node: INode,
): IDataObject | string {
	const savedParameters = node.parameters as IDataObject;
	const legacyJsonBody = savedParameters.jsonBody;
	const savedMode = savedParameters.bodyMode;
	const mode = savedMode === undefined && legacyJsonBody !== undefined ? 'json' : executeFunctions.getNodeParameter('bodyMode', itemIndex, 'fields');

	if (mode === 'json' || !hasStructuredBody(operation)) {
		return validateBody(parseJson(executeFunctions.getNodeParameter('jsonBody', itemIndex, '{}'), 'JSON body', node), operation, node, false);
	}

	const body: IDataObject = {};
	if (operation === 'searchQuickProducts' && savedParameters.body_searchQuickProducts_locationId) fail(node, 'Legacy Quick Product locationId is not documented. Remove it; it is not a customerAccountId alias.');
	if (operation === 'createGenericOrder' && (savedParameters.body_createGenericOrder_enteredByUserId || savedParameters.body_createGenericOrder_orderOriginationId)) fail(node, 'Legacy EnteredByUserId is auto-set and OrderOriginationId is undocumented. Remove these parameters; neither is silently remapped.');
	if (operation === 'createGenericOrder' && savedParameters.body_createGenericOrder_destinations !== undefined) {
		const destinations = parseJson(executeFunctions.getNodeParameter('body_createGenericOrder_destinations', itemIndex, '[]'), 'legacy destinations', node);
		if (!Array.isArray(destinations) || destinations.length) fail(node, 'Legacy destinations is undocumented. Migrate explicitly to OrderShipments or OrderAddresses.');
	}
	for (const field of bodyFields[operation]) {
		const name = `body_${operation}_${field.name}`;
		let value: unknown = executeFunctions.getNodeParameter(name, itemIndex, field.optionalBoolean ? '' : field.default ?? '');
		for (const alias of field.aliases ?? []) {
			const aliasName = `body_${operation}_${alias}`;
			if (savedParameters[aliasName] === undefined || savedParameters[aliasName] === '') continue;
			const aliasValue = executeFunctions.getNodeParameter(aliasName, itemIndex, '');
			if (!isEmpty(value) && value !== aliasValue) fail(node, `Conflicting ${field.name} and legacy ${alias}`);
			value = aliasValue;
		}
		if (field.children) {
			const nestedMode = savedParameters[`${name}_mode`] === undefined && savedParameters[name] !== undefined && savedParameters[`${name}_fields`] === undefined ? 'json' : executeFunctions.getNodeParameter(`${name}_mode`, itemIndex, 'fields');
			if (nestedMode === 'fields') value = structuredValue(executeFunctions.getNodeParameter(`${name}_fields`, itemIndex, {}), field, node);
			else value = parseJson(value, field.displayName, node);
			if (!field.required && ((isObject(value) && Object.keys(value).length === 0) || (Array.isArray(value) && value.length === 0 && savedParameters[name] === undefined && savedParameters[`${name}_fields`] === undefined))) continue;
		} else if (field.type === 'json' && !isEmpty(value)) value = parseJson(value, field.displayName, node);
		if (isEmpty(value)) continue;
		if (field.stringBoolean && typeof value === 'boolean') value = String(value);
		body[field.apiName ?? field.name] = value as never;
	}

	const additional = parseJson(executeFunctions.getNodeParameter('additionalBodyJson', itemIndex, '{}'), 'additional JSON fields', node);
	if (!isObject(additional)) {
		throw new NodeOperationError(node, 'Additional JSON Fields must be a JSON object');
	}
	if (operation === 'createCustomerNote') {
		if (Object.keys(additional).length) fail(node, 'Customer notes use a string body; Additional JSON Fields is not supported');
		return validateBody(body.note ?? '', operation, node);
	}
	return validateBody({ ...body, ...additional }, operation, node);
}
