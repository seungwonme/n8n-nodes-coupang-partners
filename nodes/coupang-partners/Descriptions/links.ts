import { INodeProperties } from 'n8n-workflow';

export const LinksOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Deeplink',
				value: 'createDeeplink',
				description:
					'Convert Coupang URLs to partner tracking short URLs',
				action: 'Create deeplink',
			},
		],
		default: 'createDeeplink',
		displayOptions: {
			show: {
				resource: ['links'],
			},
		},
	},
];

export const LinksFields: INodeProperties[] = [
	// Coupang URLs
	{
		displayName: 'Coupang URLs',
		name: 'coupangUrls',
		type: 'string',
		description:
			'Coupang product URLs to convert (comma-separated for multiple URLs)',
		placeholder:
			'e.g., https://www.coupang.com/vp/products/184614775',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['links'],
				operation: ['createDeeplink'],
			},
		},
	},
	// Sub ID
	{
		displayName: 'Sub ID',
		name: 'subId',
		type: 'string',
		description: 'Channel ID for tracking',
		placeholder: 'e.g., my-channel',
		default: '',
		displayOptions: {
			show: {
				resource: ['links'],
				operation: ['createDeeplink'],
			},
		},
	},
];
