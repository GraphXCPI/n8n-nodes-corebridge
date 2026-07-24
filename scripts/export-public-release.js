#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PUBLIC_OWNER = 'GraphXCPI';

const repoRoot = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const packageName = packageJson.name.replace(/^@[^/]+\//, '');
const publicRepo = packageName;
const publicRepoUrl = `https://github.com/${PUBLIC_OWNER}/${publicRepo}`;
const serviceName = publicRepo.replace(/^n8n-nodes-/, '');
const defaultOutput = path.resolve(process.env.HOME || '/tmp', 'GraphX_Public_Exports', `${publicRepo}-public`);

const args = process.argv.slice(2);
const clean = args.includes('--clean');
const outputArg = args.find((arg) => arg.startsWith('--output='));
const outputRoot = path.resolve(outputArg ? outputArg.slice('--output='.length) : defaultOutput);

function ensureDirectory(directory) {
	fs.mkdirSync(directory, { recursive: true });
}

function assertSafeOutputDirectory(directory) {
	if (directory === repoRoot || directory.startsWith(`${repoRoot}${path.sep}`)) {
		throw new Error(`Refusing to export into the private repository: ${directory}`);
	}

	const basename = path.basename(directory).toLowerCase();
	if (!basename.includes(serviceName.toLowerCase()) || !basename.includes('public')) {
		throw new Error(`Output directory must be clearly marked as a ${serviceName} public export: ${directory}`);
	}
}

function removeDirectoryContents(directory) {
	for (const entry of fs.readdirSync(directory)) {
		if (entry === '.git' || entry === 'node_modules') {
			continue;
		}
		fs.rmSync(path.join(directory, entry), { recursive: true, force: true });
	}
}

function copyPath(relativePath, targetRelativePath = relativePath) {
	const source = path.join(repoRoot, relativePath);
	if (!fs.existsSync(source)) {
		throw new Error(`Missing export source: ${relativePath}`);
	}

	const target = path.join(outputRoot, targetRelativePath);
	ensureDirectory(path.dirname(target));
	fs.cpSync(source, target, {
		recursive: true,
		filter: (sourcePath) => !['node_modules', '.git', '.codegraph', 'dist'].includes(path.basename(sourcePath)),
	});
}

function readText(relativePath) {
	return fs.readFileSync(path.join(outputRoot, relativePath), 'utf8');
}

function writeText(relativePath, text) {
	const target = path.join(outputRoot, relativePath);
	ensureDirectory(path.dirname(target));
	fs.writeFileSync(target, text);
}

function walk(directory, files = []) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		if (['.git', 'node_modules', '.codegraph', 'dist'].includes(entry.name)) {
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

function sanitizeText(text) {
	return text
		.replaceAll(packageJson.repository?.url ?? '', `git+${publicRepoUrl}.git`)
		.replaceAll(packageJson.homepage ?? '', `${publicRepoUrl}#readme`)
		.replaceAll(`GraphXCPI/graphx-automate-n8n-${serviceName}`, `${PUBLIC_OWNER}/${publicRepo}`);
}

function updatePackageMetadata() {
	const exportedPackage = JSON.parse(readText('package.json'));
	exportedPackage.name = packageName;
	exportedPackage.homepage = `${publicRepoUrl}#readme`;
	exportedPackage.bugs = { url: `${publicRepoUrl}/issues` };
	exportedPackage.repository = { type: 'git', url: `git+${publicRepoUrl}.git` };
	exportedPackage.publishConfig = { access: 'public', provenance: true };
	delete exportedPackage.private;
	writeText('package.json', `${JSON.stringify(exportedPackage, null, 2)}\n`);
}

function writeWorkflows() {
	writeText('.github/workflows/ci.yml', [
		'name: CI',
		'',
		'on:',
		'  pull_request:',
		'  push:',
		'    branches:',
		'      - main',
		'  workflow_dispatch:',
		'',
		'permissions:',
		'  contents: read',
		'',
		'jobs:',
		'  verify:',
		'    name: Verify package',
		'    runs-on: ubuntu-latest',
		'    steps:',
		'      - uses: actions/checkout@v4',
		'      - uses: actions/setup-node@v4',
		'        with:',
		'          node-version: 22.14.0',
		'          cache: npm',
		'      - run: npm install -g npm@^11.15.0',
		'      - run: npm ci',
		'      - run: npm run verify:release',
		'',
	].join('\n'));

	writeText('.github/workflows/release.yml', [
		'name: Release npm package',
		'',
		'on:',
		'  workflow_dispatch:',
		'    inputs:',
		'      npm_tag:',
		'        description: npm dist-tag to publish',
		'        required: true',
		'        default: latest',
		'        type: choice',
		'        options:',
		'          - latest',
		'          - beta',
		'          - next',
		'',
		'permissions:',
		'  contents: read',
		'  id-token: write',
		'',
		'jobs:',
		'  publish:',
		'    runs-on: ubuntu-latest',
		'    steps:',
		'      - uses: actions/checkout@v4',
		'      - uses: actions/setup-node@v4',
		'        with:',
		'          node-version: 22.14.0',
		'          registry-url: https://registry.npmjs.org',
		'          cache: npm',
		'      - run: npm install -g npm@^11.15.0',
		'      - run: npm ci',
		'      - run: npm run verify:release',
		'      - run: npm audit --audit-level=high',
		'      - run: npm publish --provenance --access public --tag "${{ inputs.npm_tag }}"',
		'',
	].join('\n'));
}

assertSafeOutputDirectory(outputRoot);
if (!fs.existsSync(outputRoot)) {
	ensureDirectory(outputRoot);
} else if (clean) {
	removeDirectoryContents(outputRoot);
} else if (fs.readdirSync(outputRoot).length > 0) {
	throw new Error(`Output directory is not empty. Re-run with --clean: ${outputRoot}`);
}

for (const relativePath of [
	'credentials',
	'nodes',
	'docs',
	'scripts',
	'README.md',
	'LICENSE',
	'package.json',
	'package-lock.json',
	'tsconfig.json',
	'eslint.config.mjs',
	'.gitignore',
]) {
	if (fs.existsSync(path.join(repoRoot, relativePath))) {
		copyPath(relativePath);
	}
}

updatePackageMetadata();
writeWorkflows();

for (const filePath of walk(outputRoot)) {
	if (!/\.(ts|js|mjs|md|json|yml|yaml|svg)$/.test(filePath)) {
		continue;
	}
	writeText(path.relative(outputRoot, filePath), sanitizeText(fs.readFileSync(filePath, 'utf8')));
}

console.log(`Public export written to ${outputRoot}`);
console.log(`Repository URL: ${publicRepoUrl}`);
