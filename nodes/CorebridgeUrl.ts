import type { INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const COREBRIDGE_API_PATH = '/api/public/';

export function normalizeCorebridgeBaseUrl(value: string): string | undefined {
	const input = value.trim();

	if (!input) {
		return undefined;
	}

	let url: URL;
	try {
		url = new URL(input);
	} catch {
		return undefined;
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		return undefined;
	}

	if (/^[^.]+\.v2api\.corebridge\.net$/i.test(url.hostname)) {
		return `${url.protocol}//${url.hostname}${COREBRIDGE_API_PATH}`;
	}

	const tenantMatch = url.hostname.match(/^([^.]+)\.corebridge\.net$/i);
	if (tenantMatch) {
		return `${url.protocol}//${tenantMatch[1]}.v2api.corebridge.net${COREBRIDGE_API_PATH}`;
	}

	if (url.pathname.replace(/\/+$/, '').toLowerCase().endsWith('/api/public')) {
		return `${url.protocol}//${url.host}${url.pathname.replace(/\/+$/, '')}/`;
	}

	return undefined;
}

export function joinCorebridgeUrl(baseUrl: string, path: string, node: INode): string {
	const normalizedBaseUrl = normalizeCorebridgeBaseUrl(baseUrl);
	if (!normalizedBaseUrl) {
		throw new NodeOperationError(
			node,
			'Invalid CoreBridge URL. Use the tenant Login.aspx URL or the V2 API URL ending in /api/public/.',
		);
	}

	return `${normalizedBaseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
