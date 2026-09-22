import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { buildRequestBody } from './CorebridgeBodyDefinitions';
import {
	type CorebridgeDomain,
	getCorebridgeProperties,
	getEndpoint,
	getEndpointParameterValues,
} from './CorebridgeEndpointDefinitions';
import { joinCorebridgeUrl } from './CorebridgeUrl';
import { corebridgeRequestError } from './CorebridgeErrors';
import { CorebridgeSearchRateLimit, isPacedSearch } from './CorebridgeSearchRateLimit';

type CorebridgeCredentials = {
	baseUrl: string;
	apiKey: string;
};

type QueryParameter = {
	name?: string;
	value?: string;
};

type QueryCollection = {
	parameters?: QueryParameter[];
};

export type CorebridgeNodeConfig = {
	displayName: string;
	name: string;
	description: string;
	domain: CorebridgeDomain;
};

function buildDescription(config: CorebridgeNodeConfig): INodeTypeDescription {
	return {
		displayName: config.displayName,
		name: config.name,
		icon: { light: 'file:corebridge-app.svg', dark: 'file:corebridge-app.dark.svg' },
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"]}}',
		description: config.description,
		defaults: {
			name: config.displayName,
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'corebridgeApi',
				required: true,
			},
		],
		properties: getCorebridgeProperties(config.domain),
	};
}

function replacePathParameters(path: string, parameters: IDataObject): string {
	return path.replace(/\{([^}]+)\}/g, (_match, name: string) => encodeURIComponent(String(parameters[name] ?? '')));
}

function getAdditionalQuery(parameters: QueryCollection): IDataObject {
	const query: IDataObject = {};
	for (const parameter of parameters.parameters ?? []) {
		if (!parameter.name) {
			continue;
		}
		query[parameter.name] = parameter.value ?? '';
	}
	return query;
}

function normalizeResponse(response: unknown): IDataObject {
	if (Array.isArray(response)) return { data: response as IDataObject[] };
	if (typeof response === 'object' && response !== null) {
		return response as IDataObject;
	}

	return { data: response as string | number | boolean | null };
}

function getOptionalNodeParameter(executeFunctions: IExecuteFunctions, name: string, itemIndex: number): unknown {
	try {
		return executeFunctions.getNodeParameter(name, itemIndex, undefined);
	} catch {
		return undefined;
	}
}

export class CorebridgeExecutor implements INodeType {
	description: INodeTypeDescription;

	constructor(config: CorebridgeNodeConfig) {
		this.description = buildDescription(config);
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const searchRateLimit = new CorebridgeSearchRateLimit();
		const credentials = (await this.getCredentials('corebridgeApi')) as CorebridgeCredentials;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			let route = 'API request';
			let requestStarted = false;
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const endpoint = getEndpoint(operation);

				if (!endpoint) {
					throw new NodeOperationError(this.getNode(), `Unsupported CoreBridge operation: ${operation}`, { itemIndex });
				}
				route = `${endpoint.method} ${endpoint.path}`;

				const resource = getOptionalNodeParameter(this, 'resource', itemIndex);
				if (typeof resource === 'string' && resource && endpoint.domain !== resource) {
					throw new NodeOperationError(
						this.getNode(),
						`The ${operation} operation does not belong to the selected ${resource} resource. Select an operation from the current Resource list.`,
						{ itemIndex },
					);
				}

				const queryParameters = this.getNodeParameter('queryParameters', itemIndex, {}) as QueryCollection;
				const additionalQuery = getAdditionalQuery(queryParameters);
				let parameterValues: ReturnType<typeof getEndpointParameterValues>;
				try {
					parameterValues = getEndpointParameterValues(endpoint, (name) => {
						const parameter = endpoint.parameters?.find((entry) => entry.name === name && entry.location === 'query');
						const wireName = parameter?.apiName ?? name;
						return parameter && Object.prototype.hasOwnProperty.call(additionalQuery, wireName)
							? additionalQuery[wireName]
							: getOptionalNodeParameter(this, name, itemIndex);
					});
				} catch (error) {
					throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex });
				}
				const qs = {
					...additionalQuery,
					...parameterValues.query,
				};
				for (const parameter of endpoint.parameters ?? []) {
					const key = parameter.apiName ?? parameter.name;
					if (parameter.location === 'query' && !Object.prototype.hasOwnProperty.call(parameterValues.query, key)) delete qs[key];
				}
				const requestOptions: IHttpRequestOptions = {
					method: endpoint.method,
					url: joinCorebridgeUrl(
						credentials.baseUrl,
						replacePathParameters(endpoint.path, parameterValues.path),
						this.getNode(),
						endpoint.apiRoot,
					),
					qs,
					json: endpoint.responseFormat !== 'text',
				};

				if (endpoint.body) {
					const body = buildRequestBody(this, operation, itemIndex, this.getNode());
					requestOptions.body = typeof body === 'string' ? JSON.stringify(body) : body;
					requestOptions.headers = { 'Content-Type': 'application/json' };
				}

				requestStarted = true;
				const send = () => this.helpers.httpRequestWithAuthentication.call(this, 'corebridgeApi', requestOptions);
				const response = isPacedSearch(operation)
					? await searchRateLimit.request(send,
						Number(this.getNodeParameter('searchRequestInterval', itemIndex, 8)),
						Number(this.getNodeParameter('searchRateLimitRetries', itemIndex, 2)))
					: await send();
				returnData.push({
					json: normalizeResponse(response),
					pairedItem: {
						item: itemIndex,
					},
				});
			} catch (error) {
				const safeError = !requestStarted && error instanceof NodeOperationError ? error : corebridgeRequestError(error, this.getNode(), itemIndex, route);
				if (!this.continueOnFail()) {
					throw safeError;
				}

				returnData.push({
					json: { error: safeError.message },
					pairedItem: {
						item: itemIndex,
					},
				});
			}
		}

		return [returnData];
	}
}
