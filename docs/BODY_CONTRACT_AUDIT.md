# CoreBridge Body Contract Audit

Date: 2026-09-22. Scope: body definitions, independent body fixtures, this document only.
Status: source verified locally; no publish, build, runtime installation, or API writes by this lane.
URL/executor and endpoint-definition work belong to other owners.

## Evidence And Method

Source package: `API_Documentation_Package` supplied for this review. Technical PDFs were read with `pdftotext -layout`. All eleven technical PDFs were scanned for mutation/request-body sections, plus the overview endpoint inventory. No environment files, credential values, or customer records were used. Postman inspection emitted field names/types only, never example values. Tests use newly invented `.test` fixtures and do not read the private package.

Source shorthand:

- Contacts: `CBv2-V2 API - Contacts-130126-130918.pdf`.
- Customers: `CBv2-V2 API - Customers-130126-130946.pdf`.
- Orders: `CBv2-V2 API - Orders-130126-131138.pdf`.
- Quick Products: `CBv2-V2 API - Quick Products-300626-172500.pdf`.
- Royalty: `CBv2-V2 API - Royalty-130126-131302.pdf`.
- Overview: `CoreBridge_V2_API_Overview_and_Endpoints.pdf`.
- Postman: `CoreBridge V2 API.postman_collection.json`, schema evidence only.

## Complete Body Operation Inventory

| Operation | Evidence | Contract and disposition |
| --- | --- | --- |
| `searchContacts` | Contacts section 5 / ExContactFilter | camelCase; page >= 1, size 1-50, documented sort/direction options. |
| `createContact` | Contacts section 6 / ExContact | PascalCase except `contactTypeId`; required name/email/customer, documented string limits and phone-type enum. |
| `updateContact` | Contacts section 7 / ExContactUpdate | camelCase; required positive `contactId`; corrected `accountId`; optional flags no longer implicitly reset. |
| `createContactType` | Contacts section 9 | Required `Name`. |
| `createCustomerLegacy` | Customers section 13 / ExCustomer | Existing casing retained, including `DefaultLocationID`; required fields validated; explicit `AccountStatusId: 0` preserved. |
| `createCustomerLocation` | Customers section 14 | Required account/name/address1/city/country; `IsDefault` casing retained; read-only address ID and generated location ID removed from create UI. |
| `updateCustomerLocation` | Customers section 15 | Required `customerLocationId`; optional address fields and tri-state `IsDefault`; read-only `addressId` removed from UI. |
| `updateCustomerName` | Customers section 16 | Required positive `Id` and nonblank `NewCompanyName`. |
| `createCustomerNote` | Customers section 17 | Body is a JSON string, not `{note: ...}`. Guided `note` preserved; builder returns the string. |
| `createReferralType` | Customers section 18 | Required `Name`; optional nullable `ParentId`. |
| `searchCustomers` | Customers section 19 / ExAccountFilter | PDF camelCase wins over Postman's PascalCase sample; `includeRoyaltyOverrides` emits string `"true"`/`"false"`; active filter can be unset. |
| `createCustomer` | Customers section 20 / ExCustomer2; Postman schema | Required company and primary contact with first/last/email; structured contacts, addresses and royalty overrides. Additional existing V2 scalar fields retained on Postman evidence. |
| `updateCustomer` | Customers section 21 / ExCustomer2; Postman schema | Required account ID; all remaining fields optional; booleans can remain unchanged, and zero credit limits survive. |
| `searchCustomerMergeHistory` | Overview route inventory; Postman request schema | `accountId`, `mergedOnOrAfter`, PascalCase `Page`, `PageSize`, `Sort`, `Direction`. No detailed PDF contract supplied; defaults/ranges not independently established. |
| `cancelEstimate` | Orders ExEstimate section 2 | Required positive `orderId` and nonblank `cancelNotes`, maximum 65,000 characters. |
| `createGenericOrder` | Orders ExOrder section 4 | Full documented input groups audited; account-or-ID and nonempty lines required; each line requires positive integer quantity plus description or external product ID. See nested coverage below. |
| `searchOrders` | Orders ExOrder section 5 | camelCase retained; page/size/direction and `created`, `modified`, `dueDate` selector validated. |
| `addOrderNotes` | Orders ExOrder section 6 | camelCase; required order ID; 2,000-character append limit. |
| `updateOrderNotes` | Orders ExOrder section 8 / ExOrderNotes | camelCase retained; required order ID. Conflicting maximum lengths not resolved by imposing an invented limit. |
| `updateOrderDueDate` | Orders ExOrder section 9 | Required `Id`, `DueDate`, `TimeZone`; valid ISO date-time with offset required. |
| `searchRoyaltyOverrides` | Royalty section 2 | camelCase; corrected page-size default 50 and sort default `accountId`; sort `id` also valid. No hard maximum imposed because PDF says tenant-dependent. |
| `searchQuickProducts` | Quick Products POST Search request table | All 13 PascalCase fields exposed: `QuickProductId`, `Name`, `ExternalId`, `ProductCategoryId`, `QuickProductCategoryId`, `IsGlobal`, `CustomerAccountId`, `EcommerceEnabled`, `IncludeInactive`, `Page`, `PageSize`, `Sort`, `Direction`. |

Other technical documents (Documents, Employees, Goals, Reconciliation, Sales Centers, Salespersons) contain no additional body operations in this node scope. Contact-type assignment and estimate conversion are query-only POST operations, not body schemas.

## Guided Nested Coverage

Customer V2 controls now include optional collections for primary/billing contacts and default/billing addresses; royalty overrides use repeating entries. Contacts include identity, phones, type, job authority, dates, flags, and customer location. Addresses include the ExAddress2 fields shown in the PDF examples/Postman shape. Royalty entry controls expose IDs only, not response names.

Generic orders now expose the missing top-level documented monetary totals, names, dates, notes, tax flags, integration type, and entered-by object. Repeating/structured controls cover:

- `Account`, including its contact and repeating addresses.
- `OrderBillingAddress` and `OrderShippingAddress`, with `StreetAddress1`, `StateCode`, `CountryCode` rather than the unrelated customer address schema.
- `GenericOrderLineItems`, including quantity, Quick Product identifier/pricing flag, prices/costs, category/income-account IDs, notes, designer, parts, and files. `PartIds` remains an explicitly validated numeric JSON array.
- `Taxes` with rate/amount/agency identifiers.
- `OrderShipments` and `OrderAddresses`, including repeating `OrderAddressItems`.
- `OrderPayments`, including payment type, amount, dates, custom type, check references and transaction data. `Other` requires `CustomPaymentType`.

Payment card metadata/security-code fields exist in the PDF but intentionally are not advertised as normal guided controls. Do not put sensitive payment data in saved workflows or test fixtures. Legacy/full JSON remains available for authorized integrations. Server-specific payment behavior is not proven here.

Nested JSON parameters keep their original names. New companion `_fields` and `_mode` parameters select guided fields or JSON. Without a saved nested mode, an existing JSON value is honored unless new structured fields have been saved. Explicit mode wins. To inspect an old JSON value in the editor, select its JSON input mode. Additional JSON overrides top-level API keys (not a recursive merge), then the merged body is validated.

## Compatibility And Migration

- Existing root `jsonBody` without `bodyMode` still selects JSON compatibility mode. JSON mode performs parsing and top-level shape checks only: object bodies for ordinary operations, string bodies for customer notes. It preserves supplied casing, values, unknown fields, vendor extensions, enums, and incomplete objects unchanged. No typed-field defaults are injected. Required fields and server validation remain the API's responsibility in this mode.
- `body_updateContact_customerId` is an explicit alias for `accountId`. `body_searchQuickProducts_searchText` is an explicit alias for `Name`. Conflicting alias/canonical values raise an error.
- Nonzero legacy Quick Product `locationId` is rejected, not interpreted as `CustomerAccountId` or another unrelated ID.
- Nonempty legacy `destinations` is rejected. The PDF documents `OrderShipments` and `OrderAddresses`, not `Destinations`; migration requires choosing the correct schema. Empty legacy arrays remain harmless.
- Nonzero legacy generic-order `enteredByUserId` and `orderOriginationId` are rejected. The former is auto-set; the latter is not documented. Neither is mapped to another field.
- Read-only customer-location `addressId` and create-only generated identity controls were removed, not remapped. Existing saved values are ignored; real location updates use `customerLocationId`.
- New generic orders default `IsEstimate` to false as the PDF specifies. Explicit saved true remains true. Workflows that depended on the old implicit true must explicitly set true before execution.
- Optional update/filter booleans offer unset/yes/no. Explicit saved booleans retain their values; previously saved defaults cannot be distinguished from intentional values.
- Blank optional numbers no longer default to zero. Explicit zero is preserved, including money and Lead account status; required IDs and quantities still reject zero.
- Fields mode checks required fields, nested object/array shapes, documented numeric ranges/options, date/email formats, and cross-field prerequisites after Additional JSON merging. Nested JSON selected within Fields mode also uses this canonical validation. Full/root JSON mode deliberately does not apply those constraints because partial and conflicting documentation must not reject supported live payloads. Unknown additional fields are retained. Malformed root/additional/nested JSON errors contain only a fixed message and field label, never parser exception text or user payload values.
- Compatibility boundary: JSON `{}` remains allowed even on create operations, but malformed JSON and incorrect top-level types still fail locally. Customer note JSON must be a string; empty strings pass through to server validation. Fields mode still requires a nonblank note. JSON mode is the escape hatch for vendor-supported fields and casing not captured by the typed contract.

## Remaining Ambiguities And Boundaries

1. Customer search PDF uses camelCase while Postman uses PascalCase. Typed output follows PDF; runtime case-insensitivity is not assumed/proven.
2. Customer V2 PDF is incomplete relative to Postman. Existing scalar extensions are retained, but response-shaped fields were not promoted to new mutation controls. The writable status of extra Postman properties needs vendor confirmation.
3. Customer creation refers to ExContactUpdate, which normally requires an existing contact ID, yet its creation example supplies no ID. The create contract requires names/email, not a made-up existing contact ID. Billing address is listed under required with an explicit optional qualifier; treated as optional.
4. Merge-history body has no technical PDF schema. Casing is Postman-backed; pagination defaults and valid sort values need vendor/runtime confirmation.
5. Update-note limits conflict: shared model says 2,000, general notes say 65,000, update endpoint gives none. Only the explicit append limit is enforced.
6. Country/state validity depends on tenant free-form address configuration. Two-letter country shape is checked, but US/CA-only and mandatory state restrictions are not imposed without tenant evidence.
7. Existence/active status of customer/contact/location/tax/royalty/payment IDs, duplicate emails/names, primary/billing state already stored on the server, available custom payment types, .NET time-zone identifiers, and tax configuration remain server validation responsibilities.
8. Orders PDF both labels some properties auto-generated and shows them as optional (for example Status/EnteredBy). Auto-generated IDs/status/timestamps are not promoted as ordinary create controls. Existing account phone fallback and company-name fallback are preserved.
9. No live write validation or rendered n8n editor acceptance was run by this lane. Structured collections are typechecked and their output is fixture-tested, not claimed as live UI proof.

## Verification And Owner Handoff

Run from the repository root without building:

```sh
node scripts/test-body-document-contract.js
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js nodes/CorebridgeBodyDefinitions.ts
```

The independent test loads only the body source via in-memory TypeScript transpilation. It never imports endpoint definitions or stale dist. It covers all 22 operations, Fields validation, and JSON pass-through compatibility. Scoped ESLint and body-only strict ES2020 TypeScript passed. `git diff --check` passed for the body source. Current assertion count is printed by the test.

Repo-wide `tsc --noEmit` passed after the main owner fixed an intermediate ES2020 `Object.hasOwn` error in the executor. No response-output transformation was changed by this lane. The body-only check also passed:

```sh
node node_modules/typescript/bin/tsc --noEmit --target ES2020 --module commonjs --skipLibCheck --strict --esModuleInterop nodes/CorebridgeBodyDefinitions.ts
```

Executor owner: `buildRequestBody` now returns `IDataObject | string`; send customer notes as a JSON string scalar with JSON content type. Do not wrap in `{note: ...}` or accidentally transmit unquoted text. Preserve string bodies in request-options typing and HTTP-client serialization. Live proof belongs to the main owner.

Test owner: Fields-mode generic-order fixtures require an account; the search-contact expected Fields default now includes `sort: 'id'`. JSON-mode endpoint wiring can retain `{}` (customer notes remain a string-body exception). This lane intentionally does not edit existing test files or package scripts. The independent fixture dictionary is reusable without executing assertions, compiling source, or printing on import:

```js
const { bodyJsonFixtures } = require('./test-body-document-contract');
const jsonBody = JSON.stringify(bodyJsonFixtures[operation]);
```

The dictionary has synthetic documented JSON bodies for all 22 operations, including a string for `createCustomerNote`. Running the script directly executes the suite; `runTests` is also exported. Add the source-only script to release verification when integrating.

No branch switch, commit, package build, publish, or concurrent-owner file edits were performed. The checkout was already on main. System git was blocked by the Xcode license; direct CommandLineTools git worked for read-only status/diff inspection.
