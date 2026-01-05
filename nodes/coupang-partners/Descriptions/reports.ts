import { INodeProperties } from 'n8n-workflow';

export const ReportsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Clicks Report',
				value: 'getClicks',
				description: 'Get daily click statistics',
				action: 'Get clicks report',
			},
			{
				name: 'Get Orders Report',
				value: 'getOrders',
				description: 'Get daily order statistics',
				action: 'Get orders report',
			},
			{
				name: 'Get Cancels Report',
				value: 'getCancels',
				description: 'Get daily cancellation statistics',
				action: 'Get cancels report',
			},
			{
				name: 'Get Commission Report',
				value: 'getCommission',
				description: 'Get daily commission statistics',
				action: 'Get commission report',
			},
		],
		default: 'getClicks',
		displayOptions: {
			show: {
				resource: ['reports'],
			},
		},
	},
];

export const ReportsFields: INodeProperties[] = [
	// Start Date
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		description: 'Start date in yyyyMMdd format (minimum: 20181101)',
		placeholder: 'e.g., 20240101',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['reports'],
			},
		},
	},
	// End Date
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		description:
			'End date in yyyyMMdd format (must be within 30 days from start date)',
		placeholder: 'e.g., 20240131',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['reports'],
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
				resource: ['reports'],
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
