import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CoupangPartnersApi implements ICredentialType {
	name = 'coupangPartnersApi';
	displayName = 'Coupang Partners API';
	documentationUrl = 'https://partners.coupang.com/#help/open-api';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Key',
			name: 'accessKey',
			type: 'string',
			default: '',
			required: true,
			description: 'The Access Key from Coupang Partners',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The Secret Key from Coupang Partners',
		},
	];
}
