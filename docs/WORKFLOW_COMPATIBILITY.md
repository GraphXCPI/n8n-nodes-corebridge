# Workflow Compatibility Contract

The 0.2.0 audit found 21 nodes in inactive CoreBridge test workflows on the GraphX n8n instance. No active workflow uses the package.

Stable identifiers for the first release:

| Surface | Value |
| --- | --- |
| Package name | `n8n-nodes-corebridge` |
| Credential name | `corebridgeApi` |
| Contacts node type | `n8n-nodes-corebridge.corebridgeContacts` |
| Customers node type | `n8n-nodes-corebridge.corebridgeCustomers` |
| Documents node type | `n8n-nodes-corebridge.corebridgeDocuments` |
| Goals node type | `n8n-nodes-corebridge.corebridgeGoals` |
| Orders node type | `n8n-nodes-corebridge.corebridgeOrders` |
| Products node type | `n8n-nodes-corebridge.corebridgeProducts` |
| Royalty node type | `n8n-nodes-corebridge.corebridgeRoyalty` |
| Sales node type | `n8n-nodes-corebridge.corebridgeSales` |
| API request node type | `n8n-nodes-corebridge.corebridgeApiRequest` |

All 45 operation values from 0.1.0 remain present with the same domain and endpoint path. Saved nodes with `jsonBody` and no `bodyMode` execute in JSON compatibility mode. New nodes default to guided fields.

The package adds operations without renaming existing node types, credentials, operation values, or parameters.

## Credential Compatibility

The `corebridgeApi` credential and its stored `baseUrl` and `apiKey` fields remain unchanged.
Existing values that already include `Bearer ` or `Basic ` are sent unchanged. A bare V2 API
code is now normalized to `Bearer {code}`.

The V2 API URL is the tenant `v2api.corebridge.net/api/public/` URL. The browser
`Login.aspx` username/password creates a web session only and is not interchangeable with
the location-specific V2 API code.
