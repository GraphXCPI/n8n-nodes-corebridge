# CoreBridge V2 API Mapping

This file is generated from the normalized contract in `CorebridgeEndpointDefinitions.ts`.
Run `npm run docs:generate` after changing endpoint metadata.

## Coverage

- Normalized operations: **88**
- Body-bearing operations with guided fields: **22**
- Advanced JSON mode remains available for compatibility and uncommon documented fields.
- Existing node type names and pre-0.2.0 operation keys remain stable.

## Domain Nodes

| Domain | n8n Node | Operations |
| --- | --- | ---: |
| contacts | CoreBridge Contacts | 11 |
| customers | CoreBridge Customers | 23 |
| documents | CoreBridge Documents | 4 |
| goals | CoreBridge Goals | 7 |
| orders | CoreBridge Orders | 22 |
| products | CoreBridge Products | 14 |
| royalty | CoreBridge Royalty | 2 |
| sales | CoreBridge Sales | 5 |

## Operation Map

| Domain | Method | Endpoint | n8n Operation | Guided Body |
| --- | --- | --- | --- | --- |
| contacts | GET | `ExContact` | `getContacts` | N/A |
| contacts | GET | `ExContact/GetContactById/{contactId}` | `getContactById` | N/A |
| contacts | GET | `ExContact/GetContactsByEmailAddress/{emailAddress}` | `getContactsByEmail` | N/A |
| contacts | GET | `ExContact/GetContactsModifiedAfterDate/{days}` | `getContactsModifiedAfter` | N/A |
| contacts | POST | `ExContact/SearchContacts_v2` | `searchContacts` | Yes |
| contacts | POST | `ExContact/Create` | `createContact` | Yes |
| contacts | POST | `ExContact/UpdateContact` | `updateContact` | Yes |
| contacts | POST | `ExContact/UpdateContactTypeForContact` | `updateContactType` | N/A |
| contacts | POST | `ExContact/CreateContactType` | `createContactType` | Yes |
| contacts | GET | `ExContact/GetAvailableContactTypes` | `getContactTypes` | N/A |
| contacts | GET | `ExContact/GetAvailableContactJobAuthority` | `getContactJobAuthorities` | N/A |
| customers | GET | `ExCustomer` | `getCustomers` | N/A |
| customers | GET | `ExCustomer/GetCustomerByName/{customerName}` | `getCustomerByName` | N/A |
| customers | GET | `ExCustomer/GetCustomerById/{accountId}` | `getCustomerById` | N/A |
| customers | GET | `ExCustomer/GetCustomerLocationsByCustomerId/{accountId}` | `getCustomerLocations` | N/A |
| customers | GET | `ExCustomer/GetCustomerLocationByAddressId/{addressId}` | `getCustomerLocationByAddressId` | N/A |
| customers | GET | `ExCustomer/GetCustomersByPhoneNumber/{phoneNumber}` | `getCustomersByPhone` | N/A |
| customers | GET | `ExCustomer/GetCustomersCreatedAfterDate` | `getCustomersCreatedAfter` | N/A |
| customers | GET | `ExCustomer/GetCustomersCreatedBetweenDates` | `getCustomersCreatedBetween` | N/A |
| customers | GET | `ExCustomer/GetAvailableReferralTypes` | `getReferralTypes` | N/A |
| customers | GET | `ExCustomer/GetIndustryTypes` | `getIndustryTypes` | N/A |
| customers | GET | `ExCustomer/GetAccountTypes` | `getAccountTypes` | N/A |
| customers | GET | `ExCustomer/GetCustomerTerms` | `getCustomerTerms` | N/A |
| customers | POST | `ExCustomer/Create` | `createCustomerLegacy` | Yes |
| customers | POST | `ExCustomer/CreateCustomerLocation` | `createCustomerLocation` | Yes |
| customers | POST | `ExCustomer/UpdateCustomerLocation` | `updateCustomerLocation` | Yes |
| customers | POST | `ExCustomer/UpdateCustomerName` | `updateCustomerName` | Yes |
| customers | POST | `ExCustomer/CreateCustomerNote` | `createCustomerNote` | Yes |
| customers | POST | `ExCustomer/CreateReferralType` | `createReferralType` | Yes |
| customers | POST | `ExCustomer/SearchCustomers_v2` | `searchCustomers` | Yes |
| customers | POST | `ExCustomer/CreateCustomer_v2` | `createCustomer` | Yes |
| customers | POST | `ExCustomer/UpdateCustomer_v2` | `updateCustomer` | Yes |
| customers | GET | `ExCustomerMerge/GetCustomerMergeHistoryById` | `getCustomerMergeHistoryById` | N/A |
| customers | POST | `ExCustomerMerge/CustomerMergeHistory_v2` | `searchCustomerMergeHistory` | Yes |
| documents | GET | `ExDocument/OrderStatementByOrderId` | `getOrderStatement` | N/A |
| documents | GET | `ExDocument/CustomerStatementByCustomerId` | `getCustomerStatement` | N/A |
| documents | GET | `ExDocument/WorkOrder` | `getWorkOrder` | N/A |
| documents | GET | `ExDocument/WorkOrderProduct` | `getWorkOrderProduct` | N/A |
| goals | GET | `ExGoal/GetGoalsForLocations` | `getGoalsForLocations` | N/A |
| goals | GET | `ExGoal/GetGoalsForSalePeople` | `getGoalsForSalespeople` | N/A |
| goals | GET | `ExGoal/GetCompanyCurrent` | `getCompanyCurrent` | N/A |
| goals | GET | `ExGoal/GetCompanyWideTotals` | `getCompanyWideTotals` | N/A |
| goals | GET | `ExGoal/GetGroupCompareCurrent` | `getGroupCompareCurrent` | N/A |
| goals | GET | `ExGoal/GetGroupCompareTotal` | `getGroupCompareTotal` | N/A |
| goals | GET | `ExGoal/GetSalesMonitorTotals` | `getSalesMonitorTotals` | N/A |
| orders | GET | `ExEstimate/Get` | `getEstimate` | N/A |
| orders | POST | `ExEstimate/CancelEstimate` | `cancelEstimate` | Yes |
| orders | GET | `ExEstimate/ConvertEstimate` | `convertEstimate` | N/A |
| orders | POST | `ExEstimate/ConvertEstimate` | `convertEstimatePost` | N/A |
| orders | GET | `ExOrder` | `getOrders` | N/A |
| orders | GET | `ExOrder/{orderId}` | `getOrderById` | N/A |
| orders | GET | `ExOrder/GetCustomerPortalLink/{orderId}` | `getCustomerPortalLink` | N/A |
| orders | POST | `ExOrder/CreateGenericOrder` | `createGenericOrder` | Yes |
| orders | POST | `ExOrder/SearchOrders_v2` | `searchOrders` | Yes |
| orders | POST | `ExOrder/AddOrderNotes` | `addOrderNotes` | Yes |
| orders | GET | `ExOrder/GetOrderNotes` | `getOrderNotes` | N/A |
| orders | POST | `ExOrder/UpdateOrderNotes` | `updateOrderNotes` | Yes |
| orders | DELETE | `ExOrder/DeleteOrderNotes` | `deleteOrderNotes` | N/A |
| orders | POST | `ExOrder/UpdateOrderDueDate` | `updateOrderDueDate` | Yes |
| orders | GET | `ExOrder/OrderHistory` | `getOrderHistory` | N/A |
| orders | GET | `ExOrder/OrderHistoryTypes` | `getOrderHistoryTypes` | N/A |
| orders | GET | `ExOrderDetail/GetExOrderDetailById` | `getOrderDetailById` | N/A |
| orders | GET | `ExOrderDetail/GetExOrderByInvoiceNumber` | `getOrderByInvoiceNumber` | N/A |
| orders | GET | `ExOrderDetail/GetExOrderByEstimateNumber` | `getOrderByEstimateNumber` | N/A |
| orders | GET | `ExOrderDetail/GetOrdersByStatus` | `getOrdersByStatus` | N/A |
| orders | GET | `ExOrderDetail/GetOrdersByStatusAndDate` | `getOrdersByStatusAndDate` | N/A |
| orders | GET | `ExShipping/GetOrderAddress/{orderAddressId}` | `getOrderAddress` | N/A |
| products | GET | `ExOrderProduct` | `getOrderProducts` | N/A |
| products | GET | `ExOrderProduct` | `getOrderProductById` | N/A |
| products | GET | `ExOrderProduct/{orderProductId}` | `getOrderProductByPathId` | N/A |
| products | GET | `ExOrderProductPart` | `getOrderProductParts` | N/A |
| products | GET | `ExOrderProductPart/{orderProductPartId}` | `getOrderProductPartById` | N/A |
| products | GET | `ExOrderProduct/GetAllStatusCBName` | `getAllStatusCbName` | N/A |
| products | GET | `ExOrderProduct/GetAllStatus` | `getAllStatus` | N/A |
| products | POST | `ExOrderProduct/UpdateProductStatusForId` | `updateProductStatus` | N/A |
| products | GET | `ExOrderProduct/GetAvailableSubStatusForStatus` | `getAvailableSubStatus` | N/A |
| products | POST | `ExOrderProduct/UpdateProductSubStatusForId` | `updateProductSubstatus` | N/A |
| products | POST | `ExOrderProduct/UpdateOrderProductFollowUpDueDate` | `updateProductFollowUpDueDate` | N/A |
| products | POST | `ExOrderProduct/UpdateOrderProductDesignDueDate` | `updateProductDesignDueDate` | N/A |
| products | POST | `ExQuickProduct/Search` | `searchQuickProducts` | Yes |
| products | GET | `ExQuickProduct/GetById/{quickProductId}` | `getQuickProductById` | N/A |
| royalty | GET | `ExRoyalty/RoyaltyPlans` | `getRoyaltyPlans` | N/A |
| royalty | POST | `ExRoyalty/RoyaltyPlansCustomerOverrides` | `searchRoyaltyOverrides` | Yes |
| sales | GET | `ExEmployee/GetEmployees` | `getEmployees` | N/A |
| sales | GET | `ExReconciliation/ReconciliationDetailById` | `getReconciliationDetailById` | N/A |
| sales | GET | `ExSalesCenter/GetLocations` | `getLocations` | N/A |
| sales | GET | `ExSalesCenter/GetTaxGroups` | `getTaxGroups` | N/A |
| sales | GET | `ExSalesperson/GetSalespersons` | `getSalespersons` | N/A |

## Compatibility

- Saved workflows containing `jsonBody` and no `bodyMode` continue to execute in JSON compatibility mode.
- Newly added operations default to guided fields.
- `queryParameters` remains available on every domain node and overrides generated query values.
- `CoreBridge API Request` remains available as an authenticated escape hatch.

## Verification

- `npm run test:contract` proves the node metadata matches 86 documented operations plus two source-compatibility variants.
- `npm run test:requests` proves legacy JSON and guided request construction.
- `npm run test:wiring` executes every operation through a mocked n8n transport and validates method, path, query, and body wiring.
- `npm run verify:release` runs build, lint, contract, request, and package checks.
