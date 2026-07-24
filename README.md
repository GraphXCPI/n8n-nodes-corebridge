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

The first build maps the canonical CoreBridge V2 API document package from:

```text
GraphX - System/System & Development/18_Customer_Sites/AlphaGraphics/Idaho Falls/CoreBridge API Document Package
```

Coverage includes 86 documented API operations plus two compatibility variants where the supplied Postman and technical references disagree. All 22 body-bearing operations support guided fields and complete JSON mode.

See [docs/API_MAPPING.md](docs/API_MAPPING.md) for the endpoint-to-node mapping and [docs/SOURCE_INVENTORY.md](docs/SOURCE_INVENTORY.md) for the redacted source inventory.

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
