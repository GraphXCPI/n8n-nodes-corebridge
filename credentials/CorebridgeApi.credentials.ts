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
					'={{$credentials.apiKey.trim().startsWith("Bearer ") || $credentials.apiKey.trim().startsWith("Basic ") ? $credentials.apiKey.trim() : ($credentials.authorizationScheme === "Bearer" ? "Bearer " : "Basic ") + $credentials.apiKey.trim()}}',
			},
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Tenant or V2 API URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://yoursubdomain.v2api.corebridge.net/api/public/',
			required: true,
			placeholder: 'https://yourtenant.corebridge.net/Login.aspx',
			description:
				'Paste either the CoreBridge tenant Login.aspx URL or the V2 API URL ending in /api/public/. Tenant URLs are converted to the matching V2 API host.',
		},
		{
			displayName: 'API Authorization Code',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'Location-specific V2 API code. Paste the code alone or the complete Basic/Bearer authorization value.',
		},
		{
			displayName: 'Authorization Scheme',
			name: 'authorizationScheme',
			type: 'options',
			default: 'Basic',
			options: [
				{
					name: 'Basic (V2 API Default)',
					value: 'Basic',
				},
				{
					name: 'Bearer',
					value: 'Bearer',
				},
			],
			description:
				'Scheme added only when the API authorization code does not already start with Basic or Bearer',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseUrl.trim().replace(/\\/Login\\.aspx.*$/i, "").replace(/^(https?:\\/\\/)([^./]+)\\.corebridge\\.net.*$/i, "$1$2.v2api.corebridge.net/api/public/").replace(/\\/+$/, "") + "/ExSalesCenter/GetLocations"}}',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 200,
					message:
						'CoreBridge rejected the API credentials. Verify the tenant URL, API authorization code, and Basic/Bearer scheme.',
				},
			},
		],
	};
}
