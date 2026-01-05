import { INodeProperties } from 'n8n-workflow';

export const ProductsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Best Products by Category',
				value: 'getBestProducts',
				description: 'Get best products for a specific category',
				action: 'Get best products by category',
			},
			{
				name: 'Get Goldbox Products',
				value: 'getGoldbox',
				description: 'Get Goldbox products (updated daily at 7:30 AM)',
				action: 'Get goldbox products',
			},
			{
				name: 'Get Coupang PL Products',
				value: 'getCoupangPL',
				description: 'Get Coupang Private Label products',
				action: 'Get coupang PL products',
			},
			{
				name: 'Get Coupang PL Products by Brand',
				value: 'getCoupangPLByBrand',
				description: 'Get Coupang PL products for a specific brand',
				action: 'Get coupang PL products by brand',
			},
			{
				name: 'Search Products',
				value: 'searchProducts',
				description: 'Search products by keyword (max 50 calls per minute)',
				action: 'Search products',
			},
			{
				name: 'Get Recommended Products',
				value: 'getRecommended',
				description: 'Get personalized recommended products',
				action: 'Get recommended products',
			},
		],
		default: 'getBestProducts',
		displayOptions: {
			show: {
				resource: ['products'],
			},
		},
	},
];

export const ProductsFields: INodeProperties[] = [
	// Category ID for Best Products
	{
		displayName: 'Category',
		name: 'categoryId',
		type: 'options',
		description: 'Select the product category',
		options: [
			{ name: '여성패션', value: 1001 },
			{ name: '남성패션', value: 1002 },
			{ name: '뷰티', value: 1010 },
			{ name: '출산/유아동', value: 1011 },
			{ name: '식품', value: 1012 },
			{ name: '주방용품', value: 1013 },
			{ name: '생활용품', value: 1014 },
			{ name: '홈인테리어', value: 1015 },
			{ name: '가전디지털', value: 1016 },
			{ name: '스포츠/레저', value: 1017 },
			{ name: '자동차용품', value: 1018 },
			{ name: '도서/음반/DVD', value: 1019 },
			{ name: '완구/취미', value: 1020 },
			{ name: '문구/오피스', value: 1021 },
			{ name: '헬스/건강식품', value: 1024 },
			{ name: '국내여행', value: 1025 },
			{ name: '해외여행', value: 1026 },
			{ name: '반려동물용품', value: 1029 },
			{ name: '유아동패션', value: 1030 },
		],
		default: 1001,
		required: true,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['getBestProducts'],
			},
		},
	},
	// Brand ID for Coupang PL By Brand
	{
		displayName: 'Brand',
		name: 'brandId',
		type: 'options',
		description: 'Select the Coupang PL brand',
		options: [
			{ name: '탐사', value: 1001 },
			{ name: '코멧', value: 1002 },
			{ name: 'Gomgom', value: 1003 },
			{ name: '줌', value: 1004 },
			{ name: '곰곰', value: 1006 },
			{ name: '꼬리별', value: 1007 },
			{ name: '베이스알파에센셜', value: 1008 },
			{ name: '비타할로', value: 1010 },
			{ name: '비지엔젤', value: 1011 },
		],
		default: 1001,
		required: true,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['getCoupangPLByBrand'],
			},
		},
	},
	// Keyword for Search
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		description: 'The search keyword',
		placeholder: 'e.g., 노트북',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['searchProducts'],
			},
		},
	},
	// Limit for various operations
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		description: 'Maximum number of products to return',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 20,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['getBestProducts', 'getCoupangPL', 'getCoupangPLByBrand'],
			},
		},
	},
	// Limit for Search (max 10)
	{
		displayName: 'Limit',
		name: 'searchLimit',
		type: 'number',
		description: 'Maximum number of products to return (max 10)',
		typeOptions: {
			minValue: 1,
			maxValue: 10,
		},
		default: 10,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['searchProducts'],
			},
		},
	},
	// SRP Link Only for Search
	{
		displayName: 'SRP Link Only',
		name: 'srpLinkOnly',
		type: 'boolean',
		description:
			'Whether to return only the search result page link without product details',
		default: false,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['searchProducts'],
			},
		},
	},
	// Device ID for Recommended
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		description: 'ADID, GAID or IDFA for personalized recommendations',
		placeholder: 'e.g., 38400000-8cf0-11bd-b23e-10b96e40000d',
		default: '',
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['getRecommended'],
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
				resource: ['products'],
			},
		},
		options: [
			{
				displayName: 'Sub ID',
				name: 'subId',
				type: 'string',
				description:
					'Channel ID for tracking (required for commission settlement)',
				placeholder: 'e.g., my-channel',
				default: '',
			},
			{
				displayName: 'Image Size',
				name: 'imageSize',
				type: 'string',
				description: 'Product image size',
				placeholder: 'e.g., 512x512',
				default: '',
			},
		],
	},
];
