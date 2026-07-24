# CoreBridge Source Inventory

Canonical source package:

`GraphX - System/System & Development/18_Customer_Sites/AlphaGraphics/Idaho Falls/CoreBridge API Document Package`

The package was inventoried on 2026-07-23. Source documents are not copied into this repository because the package contains customer-specific environment material.

## General Guides

- `CBv2-Postman Setup and V2 API Collection Import-030526-131019.pdf`
- `CBv2-Introduction to Postman and API Calls-030526-131252.pdf`
- `CoreBridge_V2_API_Overview_and_Endpoints.pdf`
- `JSON Payload for Corebridge Order {/JSON Payload for Corebridge Order {.md`

## Postman

- `Postman Import JSON/CoreBridge V2 API.postman_collection.json`
- `Postman Import JSON/Environment Name.postman_environment.json`

## Technical Endpoint References

- `API Endpoints Technical/CBv2-V2 API - Contacts-130126-130918.pdf`
- `API Endpoints Technical/CBv2-V2 API - Customers-130126-130946.pdf`
- `API Endpoints Technical/CBv2-V2 API - Documents-130126-131022.pdf`
- `API Endpoints Technical/CBv2-V2 API - Employees-130126-131046.pdf`
- `API Endpoints Technical/CBv2-V2 API - Goals-130126-131111.pdf`
- `API Endpoints Technical/CBv2-V2 API - Orders-130126-131138.pdf`
- `API Endpoints Technical/CBv2-V2 API - Reconciliation-130126-131233.pdf`
- `API Endpoints Technical/CBv2-V2 API - Royalty-130126-131302.pdf`
- `API Endpoints Technical/CBv2-V2 API - Sales Centers-130126-131324.pdf`
- `API Endpoints Technical/CBv2-V2 API - Salespersons-130126-131346.pdf`

## CreateGenericOrder Package

- `CreateGenericOrder_API_Package/README.md`
- `CreateGenericOrder_API_Package/CreateGenericOrder_API_Documentation.pdf`
- `CreateGenericOrder_API_Package/CreateGenericOrder_API_JSON_Examples.pdf`
- `CreateGenericOrder_API_Package/CreateGenericOrder_API_Postman_Setup_Guide.pdf`
- `CreateGenericOrder_API_Package/postman/CreateGenericOrder_Postman_Collection.json`
- `CreateGenericOrder_API_Package/postman/CreateGenericOrder_Postman_Environment.template.json`
- `CreateGenericOrder_API_Package/postman/scripts/creategenericorder_prerequest.js`
- `CreateGenericOrder_API_Package/postman/scripts/creategenericorder_tests.js`
- `CreateGenericOrder_API_Package/samples/01_Bare_Minimum_Estimate.json`
- `CreateGenericOrder_API_Package/samples/02_ImportPart_BasicLine.json`
- `CreateGenericOrder_API_Package/samples/03_QuickProduct_Reference.json`
- `CreateGenericOrder_API_Package/samples/04_MultiDestination_QtyAssignments.json`
- `CreateGenericOrder_API_Package/samples/06_NewAccount_OnFirstOrder.json`

## Security Boundary

The source package includes configured environment values and plaintext access material. Those values are excluded from Git, npm, generated documentation, tests, and logs. Store active credentials in the approved secrets vault and rotate any credential that has been distributed in plaintext.

## Authentication Finding

The supplied package separates the browser/API-documentation login from the location V2
API code. Tenant verification confirmed that the browser login creates an ASP.NET cookie
session and does not return an API bearer token. Direct V2 API use requires the tenant API
URL and the separately issued location API code in the `Authorization` header.
