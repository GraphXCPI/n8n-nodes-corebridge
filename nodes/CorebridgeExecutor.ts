import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INode,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	type CorebridgeDomain,
	type CorebridgeEndpoint,
	getCorebridgeProperties,
	getEndpoint,
	getGeneratedQuery,
} from './CorebridgeEndpointDefinitions';

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
		icon: { light: 'file:corebridge.svg', dark: 'file:corebridge.dark.svg' },
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

function joinUrl(baseUrl: string, path: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function replacePathParameters(path: string, parameters: IDataObject): string {
	return path
		.replace('{emailAddress}', encodeURIComponent(String(parameters.emailAddress ?? '')))
		.replace('{contactId}', encodeURIComponent(String(parameters.contactId ?? '')))
		.replace('{accountId}', encodeURIComponent(String(parameters.accountId ?? '')))
		.replace('{customerName}', encodeURIComponent(String(parameters.customerName ?? '')))
		.replace('{quickProductId}', encodeURIComponent(String(parameters.quickProductId ?? '')));
}

function parseJsonBody(rawBody: string, endpoint: CorebridgeEndpoint, node: INode): IDataObject {
	try {
		return JSON.parse(rawBody || '{}') as IDataObject;
	} catch (error) {
		throw new NodeOperationError(node, `Invalid JSON body for ${endpoint.name}: ${(error as Error).message}`);
	}
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
		const credentials = (await this.getCredentials('corebridgeApi')) as CorebridgeCredentials;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const endpoint = getEndpoint(operation);

				if (!endpoint) {
					throw new NodeOperationError(this.getNode(), `Unsupported CoreBridge operation: ${operation}`, { itemIndex });
				}

				const parameters = {
					accountId: getOptionalNodeParameter(this, 'accountId', itemIndex),
					contactId: getOptionalNodeParameter(this, 'contactId', itemIndex),
					customerName: getOptionalNodeParameter(this, 'customerName', itemIndex),
					emailAddress: getOptionalNodeParameter(this, 'emailAddress', itemIndex),
					orderId: getOptionalNodeParameter(this, 'orderId', itemIndex),
					customerId: getOptionalNodeParameter(this, 'customerId', itemIndex),
					invoiceNumber: getOptionalNodeParameter(this, 'invoiceNumber', itemIndex),
					orderProductId: getOptionalNodeParameter(this, 'orderProductId', itemIndex),
					statusName: getOptionalNodeParameter(this, 'statusName', itemIndex),
					substatusTag: getOptionalNodeParameter(this, 'substatusTag', itemIndex),
					followUpDateText: getOptionalNodeParameter(this, 'followUpDateText', itemIndex),
					designDueDateText: getOptionalNodeParameter(this, 'designDueDateText', itemIndex),
					quickProductId: getOptionalNodeParameter(this, 'quickProductId', itemIndex),
					includeInactive: getOptionalNodeParameter(this, 'includeInactive', itemIndex),
					direction: getOptionalNodeParameter(this, 'direction', itemIndex),
					id: getOptionalNodeParameter(this, 'id', itemIndex),
				} as IDataObject;
				const queryParameters = this.getNodeParameter('queryParameters', itemIndex, {}) as QueryCollection;
				const generatedQuery = getGeneratedQuery(operation, parameters);
				const qs = {
					...generatedQuery,
					...getAdditionalQuery(queryParameters),
				};
				const requestOptions: IHttpRequestOptions = {
					method: endpoint.method,
					url: joinUrl(credentials.baseUrl, replacePathParameters(endpoint.path, parameters)),
					qs,
					json: endpoint.responseFormat !== 'text',
				};

				if (endpoint.body) {
					requestOptions.body = parseJsonBody(this.getNodeParameter('jsonBody', itemIndex, '{}') as string, endpoint, this.getNode());
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'corebridgeApi', requestOptions);
				returnData.push({
					json: normalizeResponse(response),
					pairedItem: {
						item: itemIndex,
					},
				});
			} catch (error) {
				if (!this.continueOnFail()) {
					throw new NodeApiError(this.getNode(), { message: (error as Error).message }, { itemIndex });
				}

				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: {
						item: itemIndex,
					},
				});
			}
		}

		return [returnData];
	}
}
