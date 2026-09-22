# 0.3.0 Migration

This guide is not a deployment receipt. Back up existing workflows and validate
credentials and bounded read-only calls before enabling updated live workflows.

## Preserved Contracts

- All nine node type IDs, eight resource selectors, 88 operation IDs and the
  `corebridgeApi` credential type remain available.
- Saved JSON request bodies stay in JSON mode when the old node lacks `bodyMode`.
  They are parsed and shape-checked, not rewritten to a different casing/schema.
- Existing object response envelopes and input/output item linkage are preserved.
- Basic remains the default for a bare API code; explicit Basic/Bearer values
  remain authoritative. No login-password exchange or speculative token endpoint
  was introduced.
- No automatic fallback to another route, automatic paging, or mutation retries.

## Review Before Upgrade

- Contacts/customers lists keep zero-based `intPageIndex`; orders/products/parts
  use the documented zero-based `page` instead. The saved `pageIndex` UI name stays.
- Contacts/customers legacy lists now use `/api/ExContact/Get` and
  `/api/ExCustomer/Get`, confirmed by live routing tests. Search continues to use
  `/api/public/` and returns its V2 envelope. Legacy customer lists and V2 search
  may expose different datasets; an empty legacy list is not proof of no customers.
- Legacy Contacts indexes 0 and 1 returned the same row in live testing; index 2
  advanced. Do not rely on its documented zero-based behavior for full extraction.
  V2 Search Contacts and Search Customers returned distinct records on pages 1/2.
- Order status lists serialize `listOfStatus`. Status-and-date uses `status` and
  `days`; customer date windows use `beginDays` and `endDays`. Old absolute-date
  parameters are rejected with a migration message rather than guessed.
- Employee/salesperson email filters serialize `emailAddress`.
- Fields mode now validates documented required fields, types and nested payloads.
  Review writes against a sandbox before enabling them. Unknown body keys can be
  supplied explicitly, but known typed fields must satisfy their contract.
- Quick Products exposes documented filters and pagination. An old location filter
  cannot safely become a customer-account filter and requires explicit migration.
- Generic Order destinations require explicit migration to the documented shipment
  or address model; no silent conversion is performed.
- A top-level response array is wrapped as `{ data: [...] }`. Object envelopes are
  not flattened or renamed. This prevents invalid n8n item JSON and record loss.
- Errors contain static route templates and HTTP status when available, not request
  payloads, authorization headers, or upstream response bodies.

## Acceptance Gate

1. Run `npm run verify:release` and inspect both independent document-contract audits.
2. Scan the sanitized public export and inspect `npm pack --dry-run` inventory.
3. Verify the credential and Get Locations on the intended tenant.
4. Test Contacts and Customers list/search with one record per page. Distinguish
   HTTP success and a valid record response from a green continue-on-fail execution.
5. Test saved expressions, nested input mapping, paging and downstream consumers in
   cloned inactive workflows. Keep existing live workflows unchanged.
6. Review writes with the customer in their sandbox. Local mocks do not authorize
   or prove live customer/order mutations.

The supplied sources conflict on estimate conversion method and product lookup
shape. Existing explicit variants remain; the endpoint audit records those gaps.
A 404 alone does not establish which replacement route is correct.
