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
				Authorization:
					'={{$credentials.apiKey.trim().startsWith("Bearer ") || $credentials.apiKey.trim().startsWith("Basic ") ? $credentials.apiKey.trim() : "Bearer " + $credentials.apiKey.trim()}}',
			},
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'V2 API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://yoursubdomain.v2api.corebridge.net/api/public/',
			required: true,
			placeholder: 'https://yourtenant.v2api.corebridge.net/api/public/',
			description:
				'CoreBridge V2 API URL ending in /api/public/. Do not use the browser Login.aspx or API documentation URL.',
		},
		{
			displayName: 'Bearer API Code',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'Location-specific V2 API code. Paste the GUID alone or the complete Bearer value; the node adds Bearer when needed.',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseUrl.replace(/\\/$/, "") + "/ExSalesCenter/GetLocations"}}',
		},
	};
}
