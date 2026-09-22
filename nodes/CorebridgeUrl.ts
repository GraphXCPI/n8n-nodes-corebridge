import type { INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Keep this function self-contained: credential expressions cannot use the URL constructor.
export function normalizeCorebridgeBaseUrl(value: string): string | undefined {
	if (typeof value !== 'string') return undefined;
	const match = value.trim().match(/^(https?):\/\/([a-z0-9.-]+)(?::([0-9]+))?(\/[^?#\s]*)?(?:[?#].*)?$/i);
	if (!match) return undefined;
	const protocol = match[1].toLowerCase();
	let host = match[2].toLowerCase();
	if (!host.split('.').every((label) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return undefined;
	const portNumber = match[3] ? Number(match[3]) : undefined;
	if (portNumber !== undefined && (portNumber < 1 || portNumber > 65535)) return undefined;
	const port = portNumber === undefined || (protocol === 'https' && portNumber === 443) || (protocol === 'http' && portNumber === 80) ? '' : `:${portNumber}`;
	let path = (match[4] ?? '').replace(/\/+$/, '');
	if (/^[^.]+\.corebridge\.net$/.test(host)) host = host.replace('.corebridge.net', '.v2api.corebridge.net');
	if (/^[^.]+\.v2api\.corebridge\.net$/.test(host)) path = '/api/public';
	else if (!/\/api\/public$/i.test(path) || path.split('/').some((part) => part === '.' || part === '..')) return undefined;
	return `${protocol}://${host}${port}${path}/`;
}

export function corebridgeCredentialTestUrl(): string {
	return `={{ (() => { const base = (${normalizeCorebridgeBaseUrl.toString()})($credentials.baseUrl); if (!base) throw new Error('Invalid CoreBridge API URL'); return base + 'ExSalesCenter/GetLocations'; })() }}`;
}

export function joinCorebridgeUrl(baseUrl: string, path: string, node: INode, apiRoot: 'public' | 'legacy' = 'public'): string {
	const normalizedBaseUrl = normalizeCorebridgeBaseUrl(baseUrl);
	if (!normalizedBaseUrl) {
		throw new NodeOperationError(
			node,
			'Invalid CoreBridge URL. Use the tenant Login.aspx URL or the V2 API URL ending in /api/public/.',
		);
	}

	// Only the explicitly marked legacy list actions use /api rather than /api/public.
	const requestBaseUrl = apiRoot === 'legacy' ? normalizedBaseUrl.replace(/\/public\/$/i, '/') : normalizedBaseUrl;
	return `${requestBaseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
