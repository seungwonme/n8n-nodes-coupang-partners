import * as crypto from 'crypto';
import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { ProductsOperations, ProductsFields } from './Descriptions/products';
import { ReportsOperations, ReportsFields } from './Descriptions/reports';
import {
	AdsReportsOperations,
	AdsReportsFields,
} from './Descriptions/adsReports';
import { LinksOperations, LinksFields } from './Descriptions/links';

const BASE_URL = 'https://api-gateway.coupang.com';
const API_PATH =
	'/v2/providers/affiliate_open_api/apis/openapi/v1';

function generateHmac(
	method: string,
	path: string,
	queryString: string,
	secretKey: string,
	accessKey: string,
): string {
	// Generate datetime in YYMMDDTHHMMSSZ format (GMT)
	const now = new Date();
	const datetime = now
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/, '')
		.slice(2); // 250105T153022Z

	// Construct message: datetime + method + path + querystring
	const message = datetime + method + path + queryString;

	// Generate HMAC-SHA256 signature
	const signature = crypto
		.createHmac('sha256', secretKey)
		.update(message)
		.digest('hex');

	return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

export class CoupangPartners implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Coupang Partners',
		name: 'coupangPartners',
		icon: 'file:coupang-partners.svg',
		group: ['transform'],
		version: 1,
		subtitle:
			'={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Coupang Partners Open API',
		defaults: {
			name: 'Coupang Partners',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'coupangPartnersApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Products',
						value: 'products',
					},
					{
						name: 'Reports',
						value: 'reports',
					},
					{
						name: 'Ads Reports',
						value: 'adsReports',
					},
					{
						name: 'Links',
						value: 'links',
					},
				],
				default: 'products',
			},
			...ProductsOperations,
			...ProductsFields,
			...ReportsOperations,
			...ReportsFields,
			...AdsReportsOperations,
			...AdsReportsFields,
			...LinksOperations,
			...LinksFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('coupangPartnersApi');
		const accessKey = credentials.accessKey as string;
		const secretKey = credentials.secretKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let method: IHttpRequestMethods = 'GET';
				let path = API_PATH;
				let body: object | undefined;
				const qs: Record<string, string | number | boolean> = {};

				// Build request based on resource and operation
				if (resource === 'products') {
					const additionalOptions = this.getNodeParameter(
						'additionalOptions',
						i,
						{},
					) as { subId?: string; imageSize?: string };

					if (additionalOptions.subId) {
						qs.subId = additionalOptions.subId;
					}
					if (additionalOptions.imageSize) {
						qs.imageSize = additionalOptions.imageSize;
					}

					switch (operation) {
						case 'getBestProducts': {
							const categoryId = this.getNodeParameter(
								'categoryId',
								i,
							) as number;
							const limit = this.getNodeParameter('limit', i, 20) as number;
							path += `/products/bestcategories/${categoryId}`;
							qs.limit = limit;
							break;
						}
						case 'getGoldbox': {
							path += '/products/goldbox';
							break;
						}
						case 'getCoupangPL': {
							const limit = this.getNodeParameter('limit', i, 20) as number;
							path += '/products/coupangPL';
							qs.limit = limit;
							break;
						}
						case 'getCoupangPLByBrand': {
							const brandId = this.getNodeParameter('brandId', i) as number;
							const limit = this.getNodeParameter('limit', i, 20) as number;
							path += `/products/coupangPL/${brandId}`;
							qs.limit = limit;
							break;
						}
						case 'searchProducts': {
							const keyword = this.getNodeParameter('keyword', i) as string;
							const searchLimit = this.getNodeParameter(
								'searchLimit',
								i,
								10,
							) as number;
							const srpLinkOnly = this.getNodeParameter(
								'srpLinkOnly',
								i,
								false,
							) as boolean;
							path += '/products/search';
							qs.keyword = keyword;
							qs.limit = searchLimit;
							qs.srpLinkOnly = srpLinkOnly;
							break;
						}
						case 'getRecommended': {
							const deviceId = this.getNodeParameter('deviceId', i, '') as string;
							path += '/products/reco';
							if (deviceId) {
								qs.deviceId = deviceId;
							}
							break;
						}
					}
				} else if (resource === 'reports') {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const additionalOptions = this.getNodeParameter(
						'additionalOptions',
						i,
						{},
					) as { subId?: string; page?: number };

					qs.startDate = startDate;
					qs.endDate = endDate;
					if (additionalOptions.subId) {
						qs.subId = additionalOptions.subId;
					}
					if (additionalOptions.page !== undefined) {
						qs.page = additionalOptions.page;
					}

					switch (operation) {
						case 'getClicks':
							path += '/reports/clicks';
							break;
						case 'getOrders':
							path += '/reports/orders';
							break;
						case 'getCancels':
							path += '/reports/cancels';
							break;
						case 'getCommission':
							path += '/reports/commission';
							break;
					}
				} else if (resource === 'adsReports') {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const additionalOptions = this.getNodeParameter(
						'additionalOptions',
						i,
						{},
					) as { subId?: string; page?: number };

					qs.startDate = startDate;
					qs.endDate = endDate;
					if (additionalOptions.subId) {
						qs.subId = additionalOptions.subId;
					}
					if (additionalOptions.page !== undefined) {
						qs.page = additionalOptions.page;
					}

					switch (operation) {
						case 'getImpressionClick':
							path += '/reports/ads/impression-click';
							break;
						case 'getAdsOrders':
							path += '/reports/ads/orders';
							break;
						case 'getAdsCancels':
							path += '/reports/ads/cancels';
							break;
						case 'getAdsEcpm':
							path += '/reports/ads/performance';
							break;
						case 'getAdsCommission':
							path += '/reports/ads/commission';
							break;
					}
				} else if (resource === 'links') {
					if (operation === 'createDeeplink') {
						method = 'POST';
						path += '/deeplink';
						const coupangUrlsStr = this.getNodeParameter(
							'coupangUrls',
							i,
						) as string;
						const subId = this.getNodeParameter('subId', i, '') as string;

						const coupangUrls = coupangUrlsStr
							.split(',')
							.map((url) => url.trim())
							.filter((url) => url);

						body = {
							coupangUrls,
							...(subId && { subId }),
						};
					}
				}

				// Build query string
				const queryString = Object.keys(qs).length
					? Object.entries(qs)
							.map(
								([key, value]) =>
									`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
							)
							.join('&')
					: '';

				// Generate HMAC signature
				const authorization = generateHmac(
					method,
					path,
					queryString,
					secretKey,
					accessKey,
				);

				// Build full URL
				const url =
					BASE_URL + path + (queryString ? `?${queryString}` : '');

				// Make request
				const response = await this.helpers.httpRequest({
					method,
					url,
					headers: {
						Authorization: authorization,
						'Content-Type': 'application/json',
					},
					body: body ? JSON.stringify(body) : undefined,
					json: true,
				});

				// Check for API errors
				if (response.rCode && response.rCode !== '0') {
					throw new NodeOperationError(
						this.getNode(),
						`Coupang API Error: ${response.rMessage || 'Unknown error'}`,
						{ itemIndex: i },
					);
				}

				returnData.push({ json: response });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
