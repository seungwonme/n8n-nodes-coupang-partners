import { INodeProperties } from 'n8n-workflow';

export const AdsReportsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Impression/Click Report',
				value: 'getImpressionClick',
				description:
					'Get ad request, response, impression and click statistics',
				action: 'Get impression click report',
			},
			{
				name: 'Get Ads Orders Report',
				value: 'getAdsOrders',
				description: 'Get ad order statistics',
				action: 'Get ads orders report',
			},
			{
				name: 'Get Ads Cancels Report',
				value: 'getAdsCancels',
				description: 'Get ad cancellation statistics',
				action: 'Get ads cancels report',
			},
			{
				name: 'Get Ads eCPM Report',
				value: 'getAdsEcpm',
				description: 'Get daily eCPM values',
				action: 'Get ads e CPM report',
			},
			{
				name: 'Get Ads Commission Report',
				value: 'getAdsCommission',
				description: 'Get ad commission statistics',
				action: 'Get ads commission report',
			},
		],
		default: 'getImpressionClick',
		displayOptions: {
			show: {
				resource: ['adsReports'],
			},
		},
	},
];

export const AdsReportsFields: INodeProperties[] = [
	// Start Date
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		description: 'Start date in yyyyMMdd format (minimum: 20211025)',
		placeholder: 'e.g., 20240101',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['adsReports'],
			},
		},
	},
	// End Date
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		description:
			'End date in yyyyMMdd format (must be within 14 days from start date)',
		placeholder: 'e.g., 20240114',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['adsReports'],
			},
		},
	},
	// Common Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['adsReports'],
			},
		},
		options: [
			{
				displayName: 'Sub ID',
				name: 'subId',
				type: 'string',
				description: 'Filter by channel ID',
				placeholder: 'e.g., my-channel',
				default: '',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				description: 'Page number (max 1000 records per page)',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
			},
		],
	},
];
