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

| Domain | Method | API Root | Endpoint | n8n Operation | Guided Body |
| --- | --- | --- | --- | --- | --- |
| contacts | GET | `/api/` | `ExContact/Get` | `getContacts` | N/A |
| contacts | GET | `/api/public/` | `ExContact/GetContactById/{contactId}` | `getContactById` | N/A |
| contacts | GET | `/api/public/` | `ExContact/GetContactsByEmailAddress/{emailAddress}` | `getContactsByEmail` | N/A |
| contacts | GET | `/api/public/` | `ExContact/GetContactsModifiedAfterDate/{days}` | `getContactsModifiedAfter` | N/A |
| contacts | POST | `/api/public/` | `ExContact/SearchContacts_v2` | `searchContacts` | Yes |
| contacts | POST | `/api/public/` | `ExContact/Create` | `createContact` | Yes |
| contacts | POST | `/api/public/` | `ExContact/UpdateContact` | `updateContact` | Yes |
| contacts | POST | `/api/public/` | `ExContact/UpdateContactTypeForContact` | `updateContactType` | N/A |
| contacts | POST | `/api/public/` | `ExContact/CreateContactType` | `createContactType` | Yes |
| contacts | GET | `/api/public/` | `ExContact/GetAvailableContactTypes` | `getContactTypes` | N/A |
| contacts | GET | `/api/public/` | `ExContact/GetAvailableContactJobAuthority` | `getContactJobAuthorities` | N/A |
| customers | GET | `/api/` | `ExCustomer/Get` | `getCustomers` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomerByName/{customerName}` | `getCustomerByName` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomerById/{accountId}` | `getCustomerById` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomerLocationsByCustomerId/{accountId}` | `getCustomerLocations` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomerLocationByAddressId/{addressId}` | `getCustomerLocationByAddressId` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomersByPhoneNumber/{phoneNumber}` | `getCustomersByPhone` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomersCreatedAfterDate` | `getCustomersCreatedAfter` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomersCreatedBetweenDates` | `getCustomersCreatedBetween` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetAvailableReferralTypes` | `getReferralTypes` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetIndustryTypes` | `getIndustryTypes` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetAccountTypes` | `getAccountTypes` | N/A |
| customers | GET | `/api/public/` | `ExCustomer/GetCustomerTerms` | `getCustomerTerms` | N/A |
| customers | POST | `/api/public/` | `ExCustomer/Create` | `createCustomerLegacy` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/CreateCustomerLocation` | `createCustomerLocation` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/UpdateCustomerLocation` | `updateCustomerLocation` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/UpdateCustomerName` | `updateCustomerName` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/CreateCustomerNote` | `createCustomerNote` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/CreateReferralType` | `createReferralType` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/SearchCustomers_v2` | `searchCustomers` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/CreateCustomer_v2` | `createCustomer` | Yes |
| customers | POST | `/api/public/` | `ExCustomer/UpdateCustomer_v2` | `updateCustomer` | Yes |
| customers | GET | `/api/public/` | `ExCustomerMerge/GetCustomerMergeHistoryById` | `getCustomerMergeHistoryById` | N/A |
| customers | POST | `/api/public/` | `ExCustomerMerge/CustomerMergeHistory_v2` | `searchCustomerMergeHistory` | Yes |
| documents | GET | `/api/public/` | `ExDocument/OrderStatementByOrderId` | `getOrderStatement` | N/A |
| documents | GET | `/api/public/` | `ExDocument/CustomerStatementByCustomerId` | `getCustomerStatement` | N/A |
| documents | GET | `/api/public/` | `ExDocument/WorkOrder` | `getWorkOrder` | N/A |
| documents | GET | `/api/public/` | `ExDocument/WorkOrderProduct` | `getWorkOrderProduct` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetGoalsForLocations` | `getGoalsForLocations` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetGoalsForSalePeople` | `getGoalsForSalespeople` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetCompanyCurrent` | `getCompanyCurrent` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetCompanyWideTotals` | `getCompanyWideTotals` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetGroupCompareCurrent` | `getGroupCompareCurrent` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetGroupCompareTotal` | `getGroupCompareTotal` | N/A |
| goals | GET | `/api/public/` | `ExGoal/GetSalesMonitorTotals` | `getSalesMonitorTotals` | N/A |
| orders | GET | `/api/public/` | `ExEstimate/Get` | `getEstimate` | N/A |
| orders | POST | `/api/public/` | `ExEstimate/CancelEstimate` | `cancelEstimate` | Yes |
| orders | GET | `/api/public/` | `ExEstimate/ConvertEstimate` | `convertEstimate` | N/A |
| orders | POST | `/api/public/` | `ExEstimate/ConvertEstimate` | `convertEstimatePost` | N/A |
| orders | GET | `/api/public/` | `ExOrder` | `getOrders` | N/A |
| orders | GET | `/api/public/` | `ExOrder/{orderId}` | `getOrderById` | N/A |
| orders | GET | `/api/public/` | `ExOrder/GetCustomerPortalLink/{orderId}` | `getCustomerPortalLink` | N/A |
| orders | POST | `/api/public/` | `ExOrder/CreateGenericOrder` | `createGenericOrder` | Yes |
| orders | POST | `/api/public/` | `ExOrder/SearchOrders_v2` | `searchOrders` | Yes |
| orders | POST | `/api/public/` | `ExOrder/AddOrderNotes` | `addOrderNotes` | Yes |
| orders | GET | `/api/public/` | `ExOrder/GetOrderNotes` | `getOrderNotes` | N/A |
| orders | POST | `/api/public/` | `ExOrder/UpdateOrderNotes` | `updateOrderNotes` | Yes |
| orders | DELETE | `/api/public/` | `ExOrder/DeleteOrderNotes` | `deleteOrderNotes` | N/A |
| orders | POST | `/api/public/` | `ExOrder/UpdateOrderDueDate` | `updateOrderDueDate` | Yes |
| orders | GET | `/api/public/` | `ExOrder/OrderHistory` | `getOrderHistory` | N/A |
| orders | GET | `/api/public/` | `ExOrder/OrderHistoryTypes` | `getOrderHistoryTypes` | N/A |
| orders | GET | `/api/public/` | `ExOrderDetail/GetExOrderDetailById` | `getOrderDetailById` | N/A |
| orders | GET | `/api/public/` | `ExOrderDetail/GetExOrderByInvoiceNumber` | `getOrderByInvoiceNumber` | N/A |
| orders | GET | `/api/public/` | `ExOrderDetail/GetExOrderByEstimateNumber` | `getOrderByEstimateNumber` | N/A |
| orders | GET | `/api/public/` | `ExOrderDetail/GetOrdersByStatus` | `getOrdersByStatus` | N/A |
| orders | GET | `/api/public/` | `ExOrderDetail/GetOrdersByStatusAndDate` | `getOrdersByStatusAndDate` | N/A |
| orders | GET | `/api/public/` | `ExShipping/GetOrderAddress/{orderAddressId}` | `getOrderAddress` | N/A |
| products | GET | `/api/public/` | `ExOrderProduct` | `getOrderProducts` | N/A |
| products | GET | `/api/public/` | `ExOrderProduct` | `getOrderProductById` | N/A |
| products | GET | `/api/public/` | `ExOrderProduct/{orderProductId}` | `getOrderProductByPathId` | N/A |
| products | GET | `/api/public/` | `ExOrderProductPart` | `getOrderProductParts` | N/A |
| products | GET | `/api/public/` | `ExOrderProductPart/{orderProductPartId}` | `getOrderProductPartById` | N/A |
| products | GET | `/api/public/` | `ExOrderProduct/GetAllStatusCBName` | `getAllStatusCbName` | N/A |
| products | GET | `/api/public/` | `ExOrderProduct/GetAllStatus` | `getAllStatus` | N/A |
| products | POST | `/api/public/` | `ExOrderProduct/UpdateProductStatusForId` | `updateProductStatus` | N/A |
| products | GET | `/api/public/` | `ExOrderProduct/GetAvailableSubStatusForStatus` | `getAvailableSubStatus` | N/A |
| products | POST | `/api/public/` | `ExOrderProduct/UpdateProductSubStatusForId` | `updateProductSubstatus` | N/A |
| products | POST | `/api/public/` | `ExOrderProduct/UpdateOrderProductFollowUpDueDate` | `updateProductFollowUpDueDate` | N/A |
| products | POST | `/api/public/` | `ExOrderProduct/UpdateOrderProductDesignDueDate` | `updateProductDesignDueDate` | N/A |
| products | POST | `/api/public/` | `ExQuickProduct/Search` | `searchQuickProducts` | Yes |
| products | GET | `/api/public/` | `ExQuickProduct/GetById/{quickProductId}` | `getQuickProductById` | N/A |
| royalty | GET | `/api/public/` | `ExRoyalty/RoyaltyPlans` | `getRoyaltyPlans` | N/A |
| royalty | POST | `/api/public/` | `ExRoyalty/RoyaltyPlansCustomerOverrides` | `searchRoyaltyOverrides` | Yes |
| sales | GET | `/api/public/` | `ExEmployee/GetEmployees` | `getEmployees` | N/A |
| sales | GET | `/api/public/` | `ExReconciliation/ReconciliationDetailById` | `getReconciliationDetailById` | N/A |
| sales | GET | `/api/public/` | `ExSalesCenter/GetLocations` | `getLocations` | N/A |
| sales | GET | `/api/public/` | `ExSalesCenter/GetTaxGroups` | `getTaxGroups` | N/A |
| sales | GET | `/api/public/` | `ExSalesperson/GetSalespersons` | `getSalespersons` | N/A |

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
