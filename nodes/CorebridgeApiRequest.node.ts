import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { joinCorebridgeUrl } from './CorebridgeUrl';
import { corebridgeRequestError } from './CorebridgeErrors';

type CorebridgeCredentials = {
	baseUrl: string;
};

type QueryParameter = {
	name?: string;
	value?: string;
};

type HeaderParameter = {
	name?: string;
	value?: string;
};

function parametersToObject(parameters: Array<QueryParameter | HeaderParameter> = []): IDataObject {
	const output: IDataObject = {};
	for (const parameter of parameters) {
		if (!parameter.name) {
			continue;
		}
		output[parameter.name] = parameter.value ?? '';
	}
	return output;
}

export class CorebridgeApiRequest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CoreBridge API Request',
		name: 'corebridgeApiRequest',
		icon: { light: 'file:corebridge-app.svg', dark: 'file:corebridge-app.dark.svg' },
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["method"] + " " + $parameter["path"]}}',
		description: 'Make an authenticated request to the CoreBridge V2 API',
		defaults: {
			name: 'CoreBridge API Request',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'corebridgeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
				],
				default: 'GET',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				required: true,
				description: 'Relative path under the configured CoreBridge API base URL, for example ExSalesCenter/GetLocations',
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Parameter',
						name: 'parameters',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Value', name: 'value', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'Headers',
				name: 'headers',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Header',
						name: 'parameters',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Value', name: 'value', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'JSON Body',
				name: 'jsonBody',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						method: ['PATCH', 'POST', 'PUT'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = (await this.getCredentials('corebridgeApi')) as CorebridgeCredentials;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			let requestStarted = false;
			try {
				const method = this.getNodeParameter('method', itemIndex) as IHttpRequestMethods;
				const path = this.getNodeParameter('path', itemIndex) as string;
				const queryCollection = this.getNodeParameter('queryParameters', itemIndex, {}) as { parameters?: QueryParameter[] };
				const headerCollection = this.getNodeParameter('headers', itemIndex, {}) as { parameters?: HeaderParameter[] };
				const requestOptions: IHttpRequestOptions = {
					method,
					url: joinCorebridgeUrl(credentials.baseUrl, path, this.getNode()),
					qs: parametersToObject(queryCollection.parameters),
					headers: parametersToObject(headerCollection.parameters),
					json: true,
				};

				if (['PATCH', 'POST', 'PUT'].includes(method)) {
					try {
						const value = this.getNodeParameter('jsonBody', itemIndex, '{}');
						requestOptions.body = (typeof value === 'string' ? JSON.parse(value) : value) as IDataObject;
					} catch {
						throw new NodeOperationError(this.getNode(), 'Invalid JSON body. Supply valid JSON or an object expression.', { itemIndex });
					}
				}

				requestStarted = true;
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'corebridgeApi', requestOptions);
				returnData.push({
					json: Array.isArray(response) ? { data: response as IDataObject[] } : typeof response === 'object' && response !== null ? (response as IDataObject) : { data: response as string },
					pairedItem: {
						item: itemIndex,
					},
				});
			} catch (error) {
				const safeError = !requestStarted && error instanceof NodeOperationError ? error : corebridgeRequestError(error, this.getNode(), itemIndex, 'custom API request');
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
