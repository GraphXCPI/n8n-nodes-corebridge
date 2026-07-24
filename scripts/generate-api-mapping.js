const fs = require('node:fs');
const path = require('node:path');

const { domainLabels, endpoints } = require('../dist/nodes/CorebridgeEndpointDefinitions.js');

const lines = [
	'# CoreBridge V2 API Mapping',
	'',
	'This file is generated from the normalized contract in `CorebridgeEndpointDefinitions.ts`.',
	'Run `npm run docs:generate` after changing endpoint metadata.',
	'',
	'## Coverage',
	'',
	`- Normalized operations: **${endpoints.length}**`,
	`- Body-bearing operations with guided fields: **${endpoints.filter(({ body }) => body).length}**`,
	'- Advanced JSON mode remains available for compatibility and uncommon documented fields.',
	'- Existing node type names and pre-0.2.0 operation keys remain stable.',
	'',
	'## Domain Nodes',
	'',
	'| Domain | n8n Node | Operations |',
	'| --- | --- | ---: |',
];

for (const domain of [...new Set(endpoints.map(({ domain }) => domain))]) {
	lines.push(`| ${domain} | ${domainLabels[domain]} | ${endpoints.filter((endpoint) => endpoint.domain === domain).length} |`);
}

lines.push(
	'',
	'## Operation Map',
	'',
	'| Domain | Method | Endpoint | n8n Operation | Guided Body |',
	'| --- | --- | --- | --- | --- |',
);
for (const endpoint of endpoints) {
	lines.push(`| ${endpoint.domain} | ${endpoint.method} | \`${endpoint.path}\` | \`${endpoint.operation}\` | ${endpoint.body ? 'Yes' : 'N/A'} |`);
}

lines.push(
	'',
	'## Compatibility',
	'',
	'- Saved workflows containing `jsonBody` and no `bodyMode` continue to execute in JSON compatibility mode.',
	'- Newly added operations default to guided fields.',
	'- `queryParameters` remains available on every domain node and overrides generated query values.',
	'- `CoreBridge API Request` remains available as an authenticated escape hatch.',
	'',
	'## Verification',
	'',
	'- `npm run test:contract` proves the node metadata matches 86 documented operations plus two source-compatibility variants.',
	'- `npm run test:requests` proves legacy JSON and guided request construction.',
	'- `npm run test:wiring` executes every operation through a mocked n8n transport and validates method, path, query, and body wiring.',
	'- `npm run verify:release` runs build, lint, contract, request, and package checks.',
);

fs.writeFileSync(path.join(__dirname, '..', 'docs', 'API_MAPPING.md'), `${lines.join('\n')}\n`);
