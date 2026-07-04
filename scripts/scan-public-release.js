#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));
const packageName = packageJson.name.replace(/^@[^/]+\//, '');
const defaultExportRoot = path.resolve(process.env.HOME || '/tmp', 'GraphX_Public_Exports', `${packageName}-public`);
const pathArg = process.argv.slice(2).find((arg) => arg.startsWith('--path='));
const scanRoot = path.resolve(pathArg ? pathArg.slice('--path='.length) : defaultExportRoot);

const blockedPatterns = [
	{ label: 'private repo slug', regex: /GraphXCPI\/graphx-automate-n8n-[a-z0-9-]+/i },
	{ label: 'personal repo slug', regex: /cderamos-2ct\/n8n-nodes-[a-z0-9-]+/i },
	{ label: 'local user path', regex: /\/Users\/cderamos\//i },
	{ label: 'mounted server path', regex: /\/Volumes\/Servers\//i },
	{ label: 'Google Drive local path', regex: /GoogleDrive|CloudStorage|Shared drives/i },
	{ label: 'private LAN IP', regex: /192\.168\.\d+\.\d+/i },
	{ label: 'localhost service URL', regex: /127\.0\.0\.1:\d+|localhost:\d+/i },
	{ label: 'npm token secret', regex: /NPM_TOKEN|NODE_AUTH_TOKEN/i },
	{ label: 'private email', regex: /christian@visualgraphx\.com|chris@/i },
];

const skippedDirectories = new Set(['.git', 'node_modules', '.codegraph', 'dist']);

function walk(directory, files = []) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		if (skippedDirectories.has(entry.name)) {
			continue;
		}

		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			walk(entryPath, files);
		} else if (entry.isFile()) {
			files.push(entryPath);
		}
	}
	return files;
}

function isTextFile(filePath) {
	return !fs.readFileSync(filePath).includes(0);
}

if (!fs.existsSync(scanRoot)) {
	throw new Error(`Public export path does not exist: ${scanRoot}`);
}

const findings = [];
for (const filePath of walk(scanRoot)) {
	if (path.relative(scanRoot, filePath) === 'scripts/scan-public-release.js') {
		continue;
	}

	if (!isTextFile(filePath)) {
		continue;
	}
	const relativePath = path.relative(scanRoot, filePath);
	const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
	lines.forEach((line, index) => {
		for (const pattern of blockedPatterns) {
			if (pattern.regex.test(line)) {
				findings.push({ file: relativePath, line: index + 1, label: pattern.label, text: line.trim() });
			}
		}
	});
}

if (findings.length > 0) {
	for (const finding of findings) {
		console.error(`${finding.file}:${finding.line} [${finding.label}] ${finding.text}`);
	}
	process.exit(1);
}

console.log(`Public export scan passed: ${scanRoot}`);
