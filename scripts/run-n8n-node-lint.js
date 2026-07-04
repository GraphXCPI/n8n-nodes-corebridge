#!/usr/bin/env node

const { spawnSync } = require('child_process');

const result = spawnSync('npx', ['--yes', '@n8n/node-cli', 'lint', ...process.argv.slice(2)], {
	stdio: 'inherit',
	env: {
		...process.env,
		FORCE_COLOR: process.env.FORCE_COLOR ?? '1',
	},
});

process.exit(result.status ?? 1);
