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
  queryStringParameters: { component: 'anotherpart', this: 'that' },
  requestContext: {
    accountId: '111222333444',
    apiId: 'h6wd7009b5',
    domainName: 'h6wd7009b5.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'h6wd4009b5',
    http: {
      method: 'GET',
      path: '/route/users/1',
      protocol: 'HTTP/1.1',
      sourceIp: '',
      userAgent: '',
    },
    requestId: 'I_PZHiyjoAMEPjw=',
    routeKey: 'GET /route/users/{userId}',
    stage: '$default',
    time: '18/Nov/2021:06:56:06 +0000',
    timeEpoch: 1637218566914,
  },
  pathParameters: { userId: '1' },
  isBase64Encoded: false,
}));
