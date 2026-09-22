# Endpoint Contract Audit

Audit date: 2026-09-22. Scope: all 88 registered operation methods, paths, and
path/query parameters. Body payloads, credentials, executor, deployment, and
tenant route investigation belong to other owners. This is source-document
alignment with offline verification, not a claim of live endpoint availability.

## Sources

The supplied private API_Documentation_Package was read locally. No environment
JSON, credentials, tenant request values, or private example payloads were copied
into this repository. Fixtures use synthetic values. Source abbreviations below
refer to these files under `API Endpoints Technical`:

- C: `CBv2-V2 API - Contacts-130126-130918.pdf`
- U: `CBv2-V2 API - Customers-130126-130946.pdf`
- D: `CBv2-V2 API - Documents-130126-131022.pdf`
- E: `CBv2-V2 API - Employees-130126-131046.pdf`
- G: `CBv2-V2 API - Goals-130126-131111.pdf`
- O: `CBv2-V2 API - Orders-130126-131138.pdf`
- Q: `CBv2-V2 API - Quick Products-300626-172500.pdf`
- R: `CBv2-V2 API - Reconciliation-130126-131233.pdf`
- Y: `CBv2-V2 API - Royalty-130126-131302.pdf`
- S: `CBv2-V2 API - Sales Centers-130126-131324.pdf`
- P: `CBv2-V2 API - Salespersons-130126-131346.pdf`
- PM: `Postman Import JSON/CoreBridge V2 API.postman_collection.json`, actual
  method/URL/query definitions; prose considered separately where inconsistent.
- Overview: `CoreBridge_V2_API_Overview_and_Endpoints.pdf`, Appendix A.

PDF references use one-based physical page numbers. Setup/tutorial PDFs are not
endpoint technical contracts. The Postman environment was not read.

## Corrections and Compatibility

- Contacts/customers retain saved `pageIndex`, mapped to `intPageIndex` (zero-based).
- Orders/products/parts retain saved `pageIndex`, now mapped to documented `page`
  (zero-based). No automatic page-number shift. Default page size is 10. Explicit
  zero page indices survive serialization; saved numeric pageSize=0 remains an
  omission sentinel for compatibility with the previous UI.
- Customer relative-date window adds required `beginDays`, `endDays`, zero-based
  `page`, and `pageSize`. Both day counts are nonnegative integers and endDays
  must be smaller than beginDays. Absolute dates have no equivalent safe mapping.
- Status list retains `statusName`, mapped to `listOfStatus`; comma-separated
  strings pass through. Status-and-date retains `statusName`, mapped to `status`,
  and requires a nonnegative integer `days`, not an absolute interval.
- Old startDate/endDate values in either affected operation cause an actionable
  error, even if new day counts are supplied. Hidden legacy properties keep
  saved fields readable by n8n. Remove old fields from the saved node JSON (or
  recreate that operation), then explicitly choose the intended day counts.
  No current-time or timezone-dependent conversion is performed. Additional
  query entries named startDate/endDate are also rejected for these operations.
- Estimates add one-based `page`, `pageSize`, and `sort`; existing `direction`
  stays a string. Defaults: page=1, pageSize=10, sort=Id, direction=asc.
- History adds `orderHistoryTypeId`, one-based `page`, and `pageSize` (default and
  maximum 50). Invalid page bases, fractional pages, and oversized history pages
  fail before generated query serialization.
- Group comparisons add reportType (current default 210, total default 10).
  Sales monitor uses only optional `date` (DateTimeOffset), not the company
  totals' location/shipping/postage/tax/cache parameters.
- Employee/salesperson saved `email` maps to `emailAddress`. Employees no longer
  generate unsupported includeInactive. Salespersons retain the boolean UI:
  its serialized true/false values are among the documented string values.
- Reconciliation ID is a numeric UI field under the unchanged saved name `id`.
  Numeric string values are validated and serialized as numbers, including
  advanced query overrides, so exponent notation cannot leak onto the wire.
- Product due-date strings remain unchanged. Postman prose specifies local
  `YYYY-MM-DD HH:MM:SS`; no ISO/timezone conversion is guessed.
- Required generated parameters now error if missing/null/empty. The executor
  validates known additional-query overrides through the same parameter rules.
  Required IDs must be positive integers; relative-day parameters permit zero.

## Complete Inventory

Paths are relative to `/api/public/`. Braced names use existing node names;
renaming a placeholder such as `{id}` to `{accountId}` does not change the wire
path. `-` means no documented path/query fields beyond the displayed path (body
content is outside this audit). Query names below are wire names, not UI aliases.

| Saved operation | Method and path | Query | Source |
| --- | --- | --- | --- |
| getContacts | GET /api/ExContact/Get | intPageIndex, pageSize | C1; live routing correction |
| getContactById | GET ExContact/GetContactById/{contactId} | - | C2 |
| getContactsByEmail | GET ExContact/GetContactsByEmailAddress/{emailAddress} | - | C2, PM |
| getContactsModifiedAfter | GET ExContact/GetContactsModifiedAfterDate/{days} | - | C3 |
| searchContacts | POST ExContact/SearchContacts_v2 | - | C3, PM |
| createContact | POST ExContact/Create | - | C5, PM |
| updateContact | POST ExContact/UpdateContact | - | C6, PM |
| updateContactType | POST ExContact/UpdateContactTypeForContact | contactId, contactTypeId | C8 |
| createContactType | POST ExContact/CreateContactType | - | C8 |
| getContactTypes | GET ExContact/GetAvailableContactTypes | - | C9 |
| getContactJobAuthorities | GET ExContact/GetAvailableContactJobAuthority | - | C9 |
| getCustomers | GET /api/ExCustomer/Get | intPageIndex, pageSize | U1; live routing correction |
| getCustomerByName | GET ExCustomer/GetCustomerByName/{customerName} | - | U2, PM |
| getCustomerById | GET ExCustomer/GetCustomerById/{accountId} | - | U2, PM |
| getCustomerLocations | GET ExCustomer/GetCustomerLocationsByCustomerId/{accountId} | - | U3, PM |
| getCustomerLocationByAddressId | GET ExCustomer/GetCustomerLocationByAddressId/{addressId} | - | U4 |
| getCustomersByPhone | GET ExCustomer/GetCustomersByPhoneNumber/{phoneNumber} | - | U4 |
| getCustomersCreatedAfter | GET ExCustomer/GetCustomersCreatedAfterDate | days | U5 |
| getCustomersCreatedBetween | GET ExCustomer/GetCustomersCreatedBetweenDates | beginDays, endDays, page, pageSize | U5-6 |
| getReferralTypes | GET ExCustomer/GetAvailableReferralTypes | - | U6, PM |
| getIndustryTypes | GET ExCustomer/GetIndustryTypes | - | U7, PM |
| getAccountTypes | GET ExCustomer/GetAccountTypes | - | U7 |
| getCustomerTerms | GET ExCustomer/GetCustomerTerms | - | U8 |
| createCustomerLegacy | POST ExCustomer/Create | - | U8 |
| createCustomerLocation | POST ExCustomer/CreateCustomerLocation | - | U10, PM |
| updateCustomerLocation | POST ExCustomer/UpdateCustomerLocation | - | U12, PM |
| updateCustomerName | POST ExCustomer/UpdateCustomerName | - | U13, PM |
| createCustomerNote | POST ExCustomer/CreateCustomerNote | customerId | U14 |
| createReferralType | POST ExCustomer/CreateReferralType | - | U14 |
| searchCustomers | POST ExCustomer/SearchCustomers_v2 | - | U15, PM |
| createCustomer | POST ExCustomer/CreateCustomer_v2 | - | U16, PM |
| updateCustomer | POST ExCustomer/UpdateCustomer_v2 | - | U18, PM |
| getCustomerMergeHistoryById | GET ExCustomerMerge/GetCustomerMergeHistoryById | id | PM, Overview |
| searchCustomerMergeHistory | POST ExCustomerMerge/CustomerMergeHistory_v2 | - | PM, Overview |
| getOrderStatement | GET ExDocument/OrderStatementByOrderId | orderId | D1, PM |
| getCustomerStatement | GET ExDocument/CustomerStatementByCustomerId | customerId | D4, PM conflict |
| getWorkOrder | GET ExDocument/WorkOrder | orderId | D2, PM |
| getWorkOrderProduct | GET ExDocument/WorkOrderProduct | orderProductId | D3, PM |
| getGoalsForLocations | GET ExGoal/GetGoalsForLocations | intYear, intMonth | G1 |
| getGoalsForSalespeople | GET ExGoal/GetGoalsForSalePeople | intYear, intMonth | G2 |
| getCompanyCurrent | GET ExGoal/GetCompanyCurrent | locationId, hasShipping, hasPostage, hasTax, refreshData | G4 |
| getCompanyWideTotals | GET ExGoal/GetCompanyWideTotals | locationId, hasShipping, hasPostage, hasTax, refreshData | G5 |
| getGroupCompareCurrent | GET ExGoal/GetGroupCompareCurrent | reportType, locationId, hasShipping, hasPostage, hasTax, refreshData | G7-8 |
| getGroupCompareTotal | GET ExGoal/GetGroupCompareTotal | reportType, locationId, hasShipping, hasPostage, hasTax, refreshData | G9-10 |
| getSalesMonitorTotals | GET ExGoal/GetSalesMonitorTotals | date | G12 |
| getEstimate | GET ExEstimate/Get | page, pageSize, sort, direction | O30, PM |
| cancelEstimate | POST ExEstimate/CancelEstimate | - | O31, PM |
| convertEstimate | GET ExEstimate/ConvertEstimate | id | PM compatibility |
| convertEstimatePost | POST ExEstimate/ConvertEstimate | id | O32, Overview |
| getOrders | GET ExOrder | page, pageSize | O1 |
| getOrderById | GET ExOrder/{orderId} | - | O2 |
| getCustomerPortalLink | GET ExOrder/GetCustomerPortalLink/{orderId} | - | O2 |
| createGenericOrder | POST ExOrder/CreateGenericOrder | - | O3 |
| searchOrders | POST ExOrder/SearchOrders_v2 | - | O19, PM |
| addOrderNotes | POST ExOrder/AddOrderNotes | - | O20 |
| getOrderNotes | GET ExOrder/GetOrderNotes | orderId | O21 |
| updateOrderNotes | POST ExOrder/UpdateOrderNotes | - | O22 |
| deleteOrderNotes | DELETE ExOrder/DeleteOrderNotes | orderId | O22 |
| updateOrderDueDate | POST ExOrder/UpdateOrderDueDate | - | O23 |
| getOrderHistory | GET ExOrder/OrderHistory | orderId, orderHistoryTypeId, page, pageSize | O24 |
| getOrderHistoryTypes | GET ExOrder/OrderHistoryTypes | - | O25, PM |
| getOrderDetailById | GET ExOrderDetail/GetExOrderDetailById | id | O25, PM |
| getOrderByInvoiceNumber | GET ExOrderDetail/GetExOrderByInvoiceNumber | id | O26, PM |
| getOrderByEstimateNumber | GET ExOrderDetail/GetExOrderByEstimateNumber | id | O27 |
| getOrdersByStatus | GET ExOrderDetail/GetOrdersByStatus | listOfStatus | O27 |
| getOrdersByStatusAndDate | GET ExOrderDetail/GetOrdersByStatusAndDate | status, days | O28 |
| getOrderAddress | GET ExShipping/GetOrderAddress/{orderAddressId} | - | O32 |
| getOrderProducts | GET ExOrderProduct | page, pageSize | O29 |
| getOrderProductById | GET ExOrderProduct | id | PM compatibility |
| getOrderProductByPathId | GET ExOrderProduct/{orderProductId} | - | O29, Overview |
| getOrderProductParts | GET ExOrderProductPart | page, pageSize | O29 |
| getOrderProductPartById | GET ExOrderProductPart/{orderProductPartId} | - | O30 |
| getAllStatusCbName | GET ExOrderProduct/GetAllStatusCBName | - | PM |
| getAllStatus | GET ExOrderProduct/GetAllStatus | - | PM |
| updateProductStatus | POST ExOrderProduct/UpdateProductStatusForId | orderProductId, newOrderProductStatusName | PM |
| getAvailableSubStatus | GET ExOrderProduct/GetAvailableSubStatusForStatus | orderProductStatusName | PM |
| updateProductSubstatus | POST ExOrderProduct/UpdateProductSubStatusForId | orderProductId, tag | PM |
| updateProductFollowUpDueDate | POST ExOrderProduct/UpdateOrderProductFollowUpDueDate | orderProductId, followUpDateText | PM |
| updateProductDesignDueDate | POST ExOrderProduct/UpdateOrderProductDesignDueDate | orderProductId, designDueDateText | PM |
| searchQuickProducts | POST ExQuickProduct/Search | - | Q2, PM |
| getQuickProductById | GET ExQuickProduct/GetById/{quickProductId} | includeInactive | Q3, PM |
| getRoyaltyPlans | GET ExRoyalty/RoyaltyPlans | - | Y1 |
| searchRoyaltyOverrides | POST ExRoyalty/RoyaltyPlansCustomerOverrides | - | Y3 |
| getEmployees | GET ExEmployee/GetEmployees | emailAddress | E1, PM |
| getReconciliationDetailById | GET ExReconciliation/ReconciliationDetailById | id | R1, PM |
| getLocations | GET ExSalesCenter/GetLocations | - | S1, PM |
| getTaxGroups | GET ExSalesCenter/GetTaxGroups | locationId | S3, PM |
| getSalespersons | GET ExSalesperson/GetSalespersons | emailAddress, includeInactive | P1, PM |

## Source Conflicts and Unresolved Evidence

1. **Root-list routing correction (2026-09-22):** C1, U1, and Overview document
   `/api/public/ExContact` and `/api/public/ExCustomer`. Live testing returned 404
   with `public` incorrectly resolved as the controller. Explicit legacy actions
   `/api/ExContact/Get` and `/api/ExCustomer/Get` returned HTTP 200 JSON arrays.
   Only these two operations use the legacy API root; search and all other
   operations retain `/api/public/`. No POST substitution or automatic retry is
   performed. The customer legacy list returned an empty array in the bounded
   test, while V2 search returned records; do not assert equivalent datasets.
   Contacts indexes 0 and 1 returned the same row, while index 2 advanced. The PDF
   zero-based paging claim is not verified. V2 searches returned distinct records
   on pages 1 and 2. Do not automate legacy-list pagination until reconciled.
2. **Estimate conversion:** O32 and Overview say POST; PM request `Convert` says
   GET. Both existing explicit operations remain; selecting one never tries the
   other. GET conversion is mutating despite its HTTP verb.
3. **Product lookup:** O29/Overview use ExOrderProduct/{id}; PM `Get Product by Id`
   uses ExOrderProduct/?id. Keep distinct existing path/query operations. Do not
   reinterpret query-ID lookup as the paginated root operation.
4. **Statement casing:** D4/Overview say CustomerStatementByCustomerId; PM has
   CustomerStatementbyCustomerId. Preserve the existing technical-reference
   casing; do not claim case-insensitive tenant routing without runtime evidence.
5. **Query casing:** PM's disabled estimate `pagesize` and salesperson
   `emailaddress` differ from technical `pageSize` and `emailAddress`. Emit the
   technical names. Disabled collection entries are not proof of a live request.
6. **Trailing slash:** technical contacts/customer lookup/search headings and
   Overview goal headings sometimes end with `/`; PM often does not. Existing
   non-trailing paths remain. C2 specifically suggests a trailing slash if email
   lookup returns 404, but no conditional retry or root-route inference is added.
7. **Postman prose versus executable requests:** follow-up due-date prose calls
   fields body parameters, but actual PM request puts them in query and has no
   body. Substatus prose mentions body subStatusId while the actual request has
   only query orderProductId/tag and no body. Preserve explicit PM request shape;
   do not invent body fields. Main/body owner should track any tenant evidence.
8. **Goal defaults:** G1/G2 mark intYear/intMonth optional with default zero, yet
   document 400 for values outside 2013-2100 and 1-12. Keep zero omission rather
   than invent a current-year/month conversion. Callers should select a valid
   explicit period; server behavior when omitted is unresolved.
9. **Date semantics:** customer/status relative-day contracts are unambiguous in
   U5-6/O28; the former absolute-date UI was not supported by those sources.
   Product due-date local-text PM contracts must not inherit Orders' broad ISO
   DateTimeOffset guidance. Sales-monitor date is explicitly DateTimeOffset.
10. **Coverage limits:** merge operations and product status/date actions are
    present in PM but absent from the corresponding detailed technical PDFs.
    Merge ID typing is not asserted beyond the existing string contract.
    Authentication descriptions differ across technical PDFs and Quick Products;
    credential resolution is explicitly outside this change.

## Verification and Handoff

Run `node scripts/test-query-document-contract.js`. It transpiles only the
endpoint source in memory and stubs body-property generation, so parallel body
edits cannot invalidate the query audit and no shared build output is written.
The independent 88-operation matrix asserts methods, literal route templates,
complete parameter surfaces, generated path/query maps, default pagination,
preserved aliases/zero/false, missing day counts, and explicit legacy-date errors.
It is not derived from the endpoint table under test. Synthetic fixtures do not
require access to the private package.

Observed: all 88 operation fixtures and pagination/migration tests pass. Targeted
ESLint of the endpoint source passes; source transpile diagnostics are clean;
the documentation inventory matches all 88 independent fixtures. No live
CoreBridge requests, publication, shared build, or credential reads performed.
System Git status is unavailable because the local Xcode license is unaccepted;
only the three assigned paths were patched. Main must run the final integrated
build/tests and verify the real n8n saved-node date guard and final query merge.
Unknown additional-query keys remain an advanced escape hatch; known keys pass
the executor's final-value validation. No external
memory artifact was ingested because this task forbids publishing private work
and restricts file ownership to these three artifacts.
