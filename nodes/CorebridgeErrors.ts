import type { INode } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

// Never retain upstream error objects: they may contain authorization headers or request bodies.
export function corebridgeRequestError(error: unknown, node: INode, itemIndex: number, route: string): NodeApiError {
	const source = (error && typeof error === 'object' ? error : {}) as {
		statusCode?: unknown; status?: unknown; httpCode?: unknown; code?: unknown;
		response?: { status?: unknown; statusCode?: unknown };
	};
	const value = source.statusCode ?? source.status ?? source.httpCode ?? source.response?.status ?? source.response?.statusCode;
	const status = /^\d{3}$/.test(String(value)) ? Number(value) : undefined;
	let reason = 'Request failed. Check service availability and the configured API URL.';
	if (status === 404) reason = 'Route or record not found. Verify the tenant API URL and whether this endpoint is enabled for that tenant.';
	else if (status === 401 || status === 403) reason = 'Authorization rejected. Verify the API code, authorization scheme, and location permissions.';
	else if (status === 400 || status === 422) reason = 'Request validation failed. Check required fields, identifiers, and filter values.';
	else if (status === 429) reason = 'API rate limit reached. Reduce request frequency before retrying.';
	else if ((status && status >= 500) || ['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'ECONNABORTED'].includes(String(source.code))) reason = 'Service unavailable or request timed out. Check service health before retrying.';
	const message = `CoreBridge ${route}${status ? ` (HTTP ${status})` : ''}: ${reason}`;
	return new NodeApiError(node, { message }, { message, httpCode: status ? String(status) : undefined, itemIndex });
}
