import { sleep } from 'n8n-workflow';

type Clock = { now: () => number; sleep: (ms: number) => Promise<void> };
const clock: Clock = { now: Date.now, sleep };

export function isPacedSearch(operation: string): boolean {
	return operation === 'searchContacts' || operation === 'searchCustomers';
}

function retryDelay(error: unknown, now: number): number | undefined {
	if (!error || typeof error !== 'object') return undefined;
	const source = error as { statusCode?: unknown; status?: unknown; httpCode?: unknown; headers?: Record<string, unknown>; response?: { status?: unknown; statusCode?: unknown; headers?: Record<string, unknown> } };
	if (Number(source.statusCode ?? source.status ?? source.httpCode ?? source.response?.status ?? source.response?.statusCode) !== 429) return undefined;
	const headers = source.response?.headers ?? source.headers ?? {};
	const value = Object.entries(headers).find(([key]) => key.toLowerCase() === 'retry-after')?.[1];
	if (typeof value !== 'string' && typeof value !== 'number') return 60000;
	const text = String(value).trim();
	const seconds = /^\d+(?:\.\d+)?$/.test(text) ? Number(text) : undefined;
	const delay = seconds === undefined ? Date.parse(text) - now : seconds * 1000;
	return Number.isFinite(delay) ? Math.max(0, delay) : 60000;
}

// Execution-local state: no credential material retained and no retries for writes.
export class CorebridgeSearchRateLimit {
	private nextRequestAt = 0;
	constructor(private readonly time: Clock = clock) {}

	async request<T>(send: () => Promise<T>, intervalSeconds: number, maxRetries: number): Promise<T> {
		if (!Number.isInteger(intervalSeconds) || intervalSeconds < 8 || intervalSeconds > 3600 ||
			!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 3) {
			throw new Error('Search request interval must be 8-3600 seconds and rate-limit retries must be 0-3.');
		}
		for (let retry = 0; ; retry++) {
			const wait = this.nextRequestAt - this.time.now();
			if (wait > 0) await this.time.sleep(wait);
			this.nextRequestAt = this.time.now() + intervalSeconds * 1000;
			try {
				return await send();
			} catch (error) {
				const delay = retryDelay(error, this.time.now());
				// Do not shorten a server-requested cooldown or hold an execution indefinitely.
				if (delay === undefined || retry >= maxRetries || delay > 120000) {
					// The executor sanitizes this into NodeApiError before it can leave the node.
					// eslint-disable-next-line @n8n/community-nodes/require-node-api-error
					throw error;
				}
				this.nextRequestAt = Math.max(this.nextRequestAt, this.time.now() + delay);
			}
		}
	}
}
