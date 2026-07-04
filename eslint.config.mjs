const { config } = await import(process.env.N8N_NODE_CLI_ESLINT_CONFIG ?? '@n8n/node-cli/eslint');

export default [
	...config,
	{
		ignores: ['scripts/**'],
	},
	{
		rules: {
			'n8n-nodes-base/node-dirname-against-convention': 'off',
			'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
			'n8n-nodes-base/node-param-collection-type-unsorted-items': 'off',
		},
	},
	{
		files: ['nodes/CorebridgeEndpointDefinitions.ts'],
		rules: {
			'n8n-nodes-base/node-param-default-missing': 'off',
			'@n8n/community-nodes/options-sorted-alphabetically': 'off',
		},
	},
];
