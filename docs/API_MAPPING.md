# CoreBridge V2 API Mapping

Source artifact:

- `GraphX - System/System & Development/18_Customer_Sites/AlphaGraphics/Idaho Falls/CoreBridge API Document Package/Postman Import JSON/CoreBridge V2 API.postman_collection.json`
- `CoreBridge_V2_API_Overview_and_Endpoints.pdf`
- `CreateGenericOrder_API_Package/postman/CreateGenericOrder_Postman_Collection.json`
- `CreateGenericOrder_API_Package/samples/*.json`

Do not commit copied source artifacts because they may contain workspace-specific metadata or environment placeholders.

## Source Coverage

- Canonical CoreBridge V2 Postman collection: 42 endpoints.
- CreateGenericOrder package: 1 endpoint with 5 documented sample payload scenarios.
- Quick Product endpoints: present in the earlier supplemental Postman copy and referenced by `CreateGenericOrder_API_Package/samples/03_QuickProduct_Reference.json`; kept in the node as additive coverage.

## Auth

CoreBridge uses an API key sent in the `Authorization` header.

Credential:

- `corebridgeApi`
- `baseUrl`
- `apiKey`

## Domain Nodes

| Source Group | Endpoint | Method | n8n Node | Operation |
| --- | --- | --- | --- | --- |
| ExContact | `ExContact/Create` | POST | CoreBridge Contacts | `createContact` |
| ExContact | `ExContact/UpdateContact` | POST | CoreBridge Contacts | `updateContact` |
| ExContact | `ExContact/SearchContacts_v2` | POST | CoreBridge Contacts | `searchContacts` |
| ExContact | `ExContact/GetContactsByEmailAddress/{email}` | GET | CoreBridge Contacts | `getContactsByEmail` |
| ExContact | `ExContact/GetContactById/{contactId}` | GET | CoreBridge Contacts | `getContactById` |
| ExCustomer | `ExCustomer/CreateCustomer_v2` | POST | CoreBridge Customers | `createCustomer` |
| ExCustomer | `ExCustomer/UpdateCustomer_v2` | POST | CoreBridge Customers | `updateCustomer` |
| ExCustomer | `ExCustomer/SearchCustomers_v2` | POST | CoreBridge Customers | `searchCustomers` |
| ExCustomer | `ExCustomer/GetCustomerById/{accountId}` | GET | CoreBridge Customers | `getCustomerById` |
| ExCustomer | `ExCustomer/GetCustomerByName/{customerName}` | GET | CoreBridge Customers | `getCustomerByName` |
| ExCustomer | `ExCustomer/UpdateCustomerName` | POST | CoreBridge Customers | `updateCustomerName` |
| ExCustomer | `ExCustomer/GetIndustryTypes` | GET | CoreBridge Customers | `getIndustryTypes` |
| ExCustomer | `ExCustomer/GetAvailableReferralTypes` | GET | CoreBridge Customers | `getReferralTypes` |
| ExCustomer | `ExCustomer/GetCustomerLocationsByCustomerId/{accountId}` | GET | CoreBridge Customers | `getCustomerLocations` |
| ExCustomer | `ExCustomer/CreateCustomerLocation` | POST | CoreBridge Customers | `createCustomerLocation` |
| ExCustomer | `ExCustomer/UpdateCustomerLocation` | POST | CoreBridge Customers | `updateCustomerLocation` |
| ExCustomerMerge | `ExCustomerMerge/GetCustomerMergeHistoryById` | GET | CoreBridge Customers | `getCustomerMergeHistoryById` |
| ExCustomerMerge | `ExCustomerMerge/CustomerMergeHistory_v2` | POST | CoreBridge Customers | `searchCustomerMergeHistory` |
| ExDocument | `ExDocument/OrderStatementByOrderId` | GET | CoreBridge Documents | `getOrderStatement` |
| ExDocument | `ExDocument/CustomerStatementbyCustomerId` | GET | CoreBridge Documents | `getCustomerStatement` |
| ExDocument | `ExDocument/WorkOrder` | GET | CoreBridge Documents | `getWorkOrder` |
| ExDocument | `ExDocument/WorkOrderProduct` | GET | CoreBridge Documents | `getWorkOrderProduct` |
| ExEstimate | `ExEstimate/Get` | GET | CoreBridge Orders | `getEstimate` |
| ExEstimate | `ExEstimate/CancelEstimate` | POST | CoreBridge Orders | `cancelEstimate` |
| ExEstimate | `ExEstimate/ConvertEstimate` | GET | CoreBridge Orders | `convertEstimate` |
| ExOrder | `ExOrder/CreateGenericOrder` | POST | CoreBridge Orders | `createGenericOrder` |
| ExOrder | `ExOrder/SearchOrders_v2` | POST | CoreBridge Orders | `searchOrders` |
| ExOrder | `ExOrder/OrderHistoryTypes` | GET | CoreBridge Orders | `getOrderHistoryTypes` |
| ExOrderDetail | `ExOrderDetail/GetExOrderByInvoiceNumber` | GET | CoreBridge Orders | `getOrderByInvoiceNumber` |
| ExOrderDetail | `ExOrderDetail/GetExOrderDetailById` | GET | CoreBridge Orders | `getOrderDetailById` |
| ExOrderProduct | `ExOrderProduct/` | GET | CoreBridge Products | `getOrderProductById` |
| ExOrderProduct | `ExOrderProduct/GetAllStatusCBName` | GET | CoreBridge Products | `getAllStatusCbName` |
| ExOrderProduct | `ExOrderProduct/GetAllStatus` | GET | CoreBridge Products | `getAllStatus` |
| ExOrderProduct | `ExOrderProduct/UpdateProductStatusForId` | POST | CoreBridge Products | `updateProductStatus` |
| ExOrderProduct | `ExOrderProduct/GetAvailableSubStatusForStatus` | GET | CoreBridge Products | `getAvailableSubStatus` |
| ExOrderProduct | `ExOrderProduct/UpdateProductSubStatusForId` | POST | CoreBridge Products | `updateProductSubstatus` |
| ExOrderProduct | `ExOrderProduct/UpdateOrderProductFollowUpDueDate` | POST | CoreBridge Products | `updateProductFollowUpDueDate` |
| ExOrderProduct | `ExOrderProduct/UpdateOrderProductDesignDueDate` | POST | CoreBridge Products | `updateProductDesignDueDate` |
| ExQuickProduct | `ExQuickProduct/Search` | POST | CoreBridge Products | `searchQuickProducts` |
| ExQuickProduct | `ExQuickProduct/GetById/{quickProductId}` | GET | CoreBridge Products | `getQuickProductById` |
| ExEmployee | `ExEmployee/GetEmployees` | GET | CoreBridge Sales | `getEmployees` |
| ExReconciliation | `ExReconciliation/ReconciliationDetailById` | GET | CoreBridge Sales | `getReconciliationDetailById` |
| ExSalesCenter | `ExSalesCenter/GetLocations` | GET | CoreBridge Sales | `getLocations` |
| ExSalesCenter | `ExSalesCenter/GetTaxGroups` | GET | CoreBridge Sales | `getTaxGroups` |
| ExSalesperson | `ExSalesperson/GetSalespersons` | GET | CoreBridge Sales | `getSalespersons` |

## Gaps

- Document endpoints currently return text/string responses in JSON output. A later pass should add binary file output once we validate the actual live response content types.
- Request/response schemas are not fully typed yet. POST endpoints accept raw JSON body fields from the Postman examples.
- No live CoreBridge credential has been used yet, so verification is currently build/lint/package only.
