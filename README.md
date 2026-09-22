# n8n-nodes-corebridge

This is an n8n community node package for the CoreBridge V2 API.

## Nodes

- CoreBridge Contacts
- CoreBridge Customers
- CoreBridge Documents
- CoreBridge Goals
- CoreBridge Orders
- CoreBridge Products
- CoreBridge Royalty
- CoreBridge Sales
- CoreBridge API Request

Every typed domain node includes a **Resource** selector. You can switch between
Contacts, Customers, Orders, Products, Documents, Goals, Royalty, and Sales
without deleting the node. The **Operation** list updates to the selected
resource. Existing workflows retain their original node type and operation.

The credential accepts either a tenant login URL:

```text
https://yoursubdomain.corebridge.net/Login.aspx
```

or the canonical V2 API URL:

```text
https://yoursubdomain.v2api.corebridge.net/api/public/
```

Tenant URLs are normalized to the matching V2 API host before every request.
CoreBridge's supplied V2 Postman package documents `Basic <API code>` as the
default authorization format. Paste a complete `Basic ...` or `Bearer ...`
value to preserve it exactly, or paste the bare code and choose the matching
scheme.

The username and password for `Login.aspx` authenticate the CoreBridge browser and API
documentation portal. They do not authenticate V2 `/api/public/` requests or return the
location API code. Obtain the V2 API code separately for the same tenant/location.

## API Coverage

The node maps the supplied CoreBridge V2 technical references and Postman collection.
The 0.3.0 candidate audits all registered operations against those documents,
including the June 2026 Quick Products contract. Document coverage is not proof
that every route is enabled on every tenant.

Coverage includes 86 documented API operations plus two compatibility variants where the supplied Postman and technical references disagree. All 22 body-bearing operations support guided fields and complete JSON mode.

See [docs/API_MAPPING.md](docs/API_MAPPING.md) for the endpoint-to-node mapping and [docs/SOURCE_INVENTORY.md](docs/SOURCE_INVENTORY.md) for the redacted source inventory.

See [the migration guide](docs/MIGRATION_0.3.0.md),
[endpoint audit](docs/ENDPOINT_CONTRACT_AUDIT.md), and
[body audit](docs/BODY_CONTRACT_AUDIT.md) before updating existing workflows.

### Customers and Contacts

Legacy lists use `/api/ExContact/Get` and `/api/ExCustomer/Get`; live tests found
the documented `/api/public/` list roots return 404. V2 Search remains under
`/api/public/` and uses one-based paging. POST Search reads records, not writes.
The node never silently substitutes Search for a legacy list. Legacy Contacts
indexes 0 and 1 returned the same record, and the legacy Customers list returned
no rows despite nonempty V2 search results. Use V2 Search for extraction; legacy
list paging and dataset equivalence remain unverified. A credential test alone
does not prove operation behavior.

Fields mode validates documented inputs and exposes nested objects/arrays through
structured controls with JSON alternatives. Complete JSON mode preserves supplied
payloads for existing workflows; the API validates their fields. Object response
envelopes are retained. A top-level array is returned under `data` to keep n8n item
JSON valid, without dropping records. Each input item retains its output linkage.

### Search Rate Limits

Customer and Contact Search allow 10 requests/minute, 500/hour and 7,500/day.
The node sends one search per input item. Search requests within one execution
are paced at 8 seconds by default (configurable upward). HTTP 429 retries default
to two and apply only to these read-only searches, never writes. Retry-After is
honored; without it the delay is 60 seconds. Cooldowns longer than 120 seconds
stop execution instead of retrying early. Hourly/daily quota exhaustion still
requires waiting for the server quota reset.

Pacing is execution-local, not shared across workflows, workers or other clients.
Avoid concurrent bulk searches with the same API account. For extraction, use
pages of up to 50 records rather than repeating an unfiltered search per incoming
customer. Long batches can exceed workflow timeouts; use smaller resumable batches
and n8n Wait nodes for long cooldowns. Do not restart a workflow containing writes
from the beginning after a search failure without reviewing completed side effects.

## Development

```bash
npm install
npm run verify:release
```

## Release Hygiene

The private source repo is intended to be `GraphXCPI/n8n-nodes-corebridge`.

The public npm repo is intended to be `GraphXCPI/n8n-nodes-corebridge`.

Use:

```bash
npm run public:export -- --clean
npm run public:scan
```
