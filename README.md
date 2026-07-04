# n8n-nodes-corebridge

This is an n8n community node package for the CoreBridge V2 API.

## Nodes

- CoreBridge Contacts
- CoreBridge Customers
- CoreBridge Documents
- CoreBridge Orders
- CoreBridge Products
- CoreBridge Sales
- CoreBridge API Request

The package uses the CoreBridge `Authorization` API key header and a base URL such as:

```text
https://yoursubdomain.v2api.corebridge.net/api/public/
```

## API Coverage

The first build maps the canonical CoreBridge V2 API document package from:

```text
GraphX - System/System & Development/18_Customer_Sites/AlphaGraphics/Idaho Falls/CoreBridge API Document Package
```

Coverage includes the 42 endpoints in `Postman Import JSON/CoreBridge V2 API.postman_collection.json`, the supplemental `CreateGenericOrder` Postman package, and the quick product endpoints referenced by the generic-order examples.

See [docs/API_MAPPING.md](docs/API_MAPPING.md) for the endpoint-to-node mapping.

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
