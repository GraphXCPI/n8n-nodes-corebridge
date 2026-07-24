import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { buildRequestBody } from './CorebridgeBodyDefinitions';
import {
	type CorebridgeDomain,
	getCorebridgeProperties,
	getEndpoint,
	getEndpointParameterValues,
} from './CorebridgeEndpointDefinitions';
import { joinCorebridgeUrl } from './CorebridgeUrl';

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

				const parameterValues = getEndpointParameterValues(endpoint, (name) =>
					getOptionalNodeParameter(this, name, itemIndex),
				);
				const queryParameters = this.getNodeParameter('queryParameters', itemIndex, {}) as QueryCollection;
				const qs = {
					...parameterValues.query,
					...getAdditionalQuery(queryParameters),
				};
				const requestOptions: IHttpRequestOptions = {
					method: endpoint.method,
					url: joinCorebridgeUrl(
						credentials.baseUrl,
						replacePathParameters(endpoint.path, parameterValues.path),
						this.getNode(),
					),
					qs,
					json: endpoint.responseFormat !== 'text',
				};

				if (endpoint.body) {
					requestOptions.body = buildRequestBody(this, operation, itemIndex, this.getNode());
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
