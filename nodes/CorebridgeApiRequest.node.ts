import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { joinCorebridgeUrl } from './CorebridgeUrl';

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
		icon: { light: 'file:corebridge.svg', dark: 'file:corebridge.dark.svg' },
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
						requestOptions.body = JSON.parse(this.getNodeParameter('jsonBody', itemIndex, '{}') as string) as IDataObject;
					} catch (error) {
						throw new NodeOperationError(this.getNode(), `Invalid JSON body: ${(error as Error).message}`, { itemIndex });
					}
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'corebridgeApi', requestOptions);
				returnData.push({
					json: typeof response === 'object' && response !== null ? (response as IDataObject) : { data: response as string },
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
