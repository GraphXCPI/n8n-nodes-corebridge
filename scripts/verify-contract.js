const assert = require('node:assert/strict');

const { hasStructuredBody } = require('../dist/nodes/CorebridgeBodyDefinitions.js');
const { endpoints } = require('../dist/nodes/CorebridgeEndpointDefinitions.js');

const documentedContract = `
GET ExContact
GET ExContact/GetContactById/{contactId}
GET ExContact/GetContactsByEmailAddress/{emailAddress}
GET ExContact/GetContactsModifiedAfterDate/{days}
POST ExContact/SearchContacts_v2
POST ExContact/Create
POST ExContact/UpdateContact
POST ExContact/UpdateContactTypeForContact
POST ExContact/CreateContactType
GET ExContact/GetAvailableContactTypes
GET ExContact/GetAvailableContactJobAuthority
GET ExCustomer
GET ExCustomer/GetCustomerByName/{customerName}
GET ExCustomer/GetCustomerById/{accountId}
GET ExCustomer/GetCustomerLocationsByCustomerId/{accountId}
GET ExCustomer/GetCustomerLocationByAddressId/{addressId}
GET ExCustomer/GetCustomersByPhoneNumber/{phoneNumber}
GET ExCustomer/GetCustomersCreatedAfterDate
GET ExCustomer/GetCustomersCreatedBetweenDates
GET ExCustomer/GetAvailableReferralTypes
GET ExCustomer/GetIndustryTypes
GET ExCustomer/GetAccountTypes
GET ExCustomer/GetCustomerTerms
POST ExCustomer/Create
POST ExCustomer/CreateCustomerLocation
POST ExCustomer/UpdateCustomerLocation
POST ExCustomer/UpdateCustomerName
POST ExCustomer/CreateCustomerNote
POST ExCustomer/CreateReferralType
POST ExCustomer/SearchCustomers_v2
POST ExCustomer/CreateCustomer_v2
POST ExCustomer/UpdateCustomer_v2
GET ExCustomerMerge/GetCustomerMergeHistoryById
POST ExCustomerMerge/CustomerMergeHistory_v2
GET ExDocument/OrderStatementByOrderId
GET ExDocument/CustomerStatementByCustomerId
GET ExDocument/WorkOrder
GET ExDocument/WorkOrderProduct
GET ExGoal/GetGoalsForLocations
GET ExGoal/GetGoalsForSalePeople
GET ExGoal/GetCompanyCurrent
GET ExGoal/GetCompanyWideTotals
GET ExGoal/GetGroupCompareCurrent
GET ExGoal/GetGroupCompareTotal
GET ExGoal/GetSalesMonitorTotals
GET ExEstimate/Get
POST ExEstimate/CancelEstimate
GET ExEstimate/ConvertEstimate
POST ExEstimate/ConvertEstimate
GET ExOrder
GET ExOrder/{orderId}
GET ExOrder/GetCustomerPortalLink/{orderId}
POST ExOrder/CreateGenericOrder
POST ExOrder/SearchOrders_v2
POST ExOrder/AddOrderNotes
GET ExOrder/GetOrderNotes
POST ExOrder/UpdateOrderNotes
DELETE ExOrder/DeleteOrderNotes
POST ExOrder/UpdateOrderDueDate
GET ExOrder/OrderHistory
GET ExOrder/OrderHistoryTypes
GET ExOrderDetail/GetExOrderDetailById
GET ExOrderDetail/GetExOrderByInvoiceNumber
GET ExOrderDetail/GetExOrderByEstimateNumber
GET ExOrderDetail/GetOrdersByStatus
GET ExOrderDetail/GetOrdersByStatusAndDate
GET ExShipping/GetOrderAddress/{orderAddressId}
GET ExOrderProduct
GET ExOrderProduct
GET ExOrderProduct/{orderProductId}
GET ExOrderProductPart
GET ExOrderProductPart/{orderProductPartId}
GET ExOrderProduct/GetAllStatusCBName
GET ExOrderProduct/GetAllStatus
POST ExOrderProduct/UpdateProductStatusForId
GET ExOrderProduct/GetAvailableSubStatusForStatus
POST ExOrderProduct/UpdateProductSubStatusForId
POST ExOrderProduct/UpdateOrderProductFollowUpDueDate
POST ExOrderProduct/UpdateOrderProductDesignDueDate
POST ExQuickProduct/Search
GET ExQuickProduct/GetById/{quickProductId}
GET ExRoyalty/RoyaltyPlans
POST ExRoyalty/RoyaltyPlansCustomerOverrides
GET ExEmployee/GetEmployees
GET ExReconciliation/ReconciliationDetailById
GET ExSalesCenter/GetLocations
GET ExSalesCenter/GetTaxGroups
GET ExSalesperson/GetSalespersons
`.trim().split('\n');

const actual = endpoints.map(({ method, path }) => `${method} ${path}`);
assert.equal(endpoints.length, 88, 'Expected 86 documented operations plus 2 source-compatibility variants');
assert.equal(new Set(endpoints.map(({ operation }) => operation)).size, endpoints.length, 'Operation keys must be unique');
assert.deepEqual(new Set(actual), new Set(documentedContract), 'Node contract differs from the normalized source manifest');

const untypedBodies = endpoints.filter(({ body, operation }) => body && !hasStructuredBody(operation));
assert.deepEqual(untypedBodies, [], 'Every documented body operation must expose structured fields');

const convertPost = endpoints.find(({ operation }) => operation === 'convertEstimatePost');
assert.equal(convertPost?.method, 'POST', 'ConvertEstimate POST variant must use the technical-reference method');

console.log(`CoreBridge contract verified: ${endpoints.length}/${documentedContract.length} operations, all body schemas typed`);
