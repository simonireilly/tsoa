import { Factory } from 'fishery';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const apiGatewayProxyEventFactory = Factory.define<APIGatewayProxyEventV2>(({}) => ({
  version: '2.0',
  routeKey: 'GET /route/users/{userId}',
  rawPath: '/route/users/1',
  rawQueryString: 'this=that&component=anotherpart',
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
  },
  queryStringParameters: {},
  requestContext: {
    accountId: '111222333444',
    apiId: '',
    domainName: '',
    domainPrefix: '',
    http: {
      method: 'GET',
      path: '',
      protocol: '',
      sourceIp: '',
      userAgent: '',
    },
    requestId: '',
    routeKey: 'GET /v1/',
    stage: '$default',
    time: '18/Nov/2021:06:56:06 +0000',
    timeEpoch: 1637218566914,
  },
  pathParameters: { userId: '1' },
  isBase64Encoded: false,
}));
