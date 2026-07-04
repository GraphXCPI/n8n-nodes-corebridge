import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class CorebridgeApi implements ICredentialType {
	name = 'corebridgeApi';
	displayName = 'CoreBridge API';
	icon: Icon = { light: 'file:corebridge.svg', dark: 'file:corebridge.dark.svg' };
	documentationUrl = 'https://support.corebridge.net/';

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey}}',
			},
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://yoursubdomain.v2api.corebridge.net/api/public/',
			required: true,
			description: 'CoreBridge V2 API base URL, ending in /api/public/',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'CoreBridge API key sent in the Authorization header',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseUrl.replace(/\\/$/, "") + "/ExSalesCenter/GetLocations"}}',
		},
	};
}
