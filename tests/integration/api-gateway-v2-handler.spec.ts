import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { expect } from 'chai';
import { TestModel } from '../fixtures/testModel';
import 'mocha';
import { handler } from '../fixtures/api-gateway-v2/handler';

const mockEvent = {
  version: '2.0',
  routeKey: 'GET /route/users/{userId}',
  rawPath: '/route/users/1',
  rawQueryString: 'this=that&component=anotherpart',
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    authorization: '<API Key>',
    'cache-control': 'no-cache',
    'content-length': '0',
    host: 'h6wd4009b5.execute-api.us-east-1.amazonaws.com',
    'postman-token': '09c88604-b69c-496f-b762-8e8333576ac3',
    'user-agent': 'PostmanRuntime/7.26.8',
    'x-amzn-trace-id': 'Root=1-6195f906-4ad207e737bf5e315e73ce52',
    'x-forwarded-for': '86.182.134.155',
    'x-forwarded-port': '443',
    'x-forwarded-proto': 'https',
  },
  queryStringParameters: { component: 'anotherpart', this: 'that' },
  requestContext: {
    accountId: '322567890963',
    apiId: 'h6wd4009b5',
    domainName: 'h6wd4009b5.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'h6wd4009b5',
    http: {
      method: 'GET',
      path: '/route/users/1',
      protocol: 'HTTP/1.1',
      sourceIp: '86.182.134.155',
      userAgent: 'PostmanRuntime/7.26.8',
    },
    requestId: 'I_PZHiyjoAMEPjw=',
    routeKey: 'GET /route/users/{userId}',
    stage: '$default',
    time: '18/Nov/2021:06:56:06 +0000',
    timeEpoch: 1637218566914,
  },
  pathParameters: { userId: '1' },
  isBase64Encoded: false,
};
const mockContext: Context = {
  functionName: 'StubFunction',
  callbackWaitsForEmptyEventLoop: false,
  functionVersion: '1',
  logGroupName: 'logs',
  logStreamName: 'log-stream',
  memoryLimitInMB: '128MB',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:322567890963:function:dev-poc-openapi-my-stack-ApiLambdaGETrouteusersuse-yzasKzjfQMQx',
  awsRequestId: 'dc824530-bd0e-4a96-9981-6a6ea2d89fad',
  succeed: () => true,
  fail: () => true,
  done: () => true,
  getRemainingTimeInMillis: () => 1,
};
const basePath = '/v1';

describe('API Gateway V2 Handler', () => {
  it('can handle get request to root controller`s path', async () => {
    return verifyGetRequest(
      basePath,
      mockEvent,
      mockContext,
      res => {
        const { body } = res;
        const model = (body && JSON.parse(body)) as TestModel;
        expect(model.id).to.equal(1);
      },
      200,
    );
  });

  it('can handle get request to root controller`s method path', async () => {
    return verifyGetRequest(basePath + '/rootControllerMethodWithPath', mockEvent, mockContext, res => {
      const { body } = res;
      const model = (body && JSON.parse(body)) as TestModel;
      expect(model.id).to.equal(1);
    });
  });

  it('can handle get request with path argument', async () => {
    return verifyGetRequest(basePath + '/GetTest/Current', mockEvent, mockContext, res => {
      const { body } = res;
      const model = (body && JSON.parse(body)) as TestModel;
      expect(model.id).to.equal(1);
    });
  });

  it('respects toJSON for class serialization', async () => {
    return verifyGetRequest(basePath + '/GetTest/SimpleClassWithToJSON', mockEvent, mockContext, res => {
      const { body } = res;
      const getterClass = body && JSON.parse(body);
      expect(getterClass).to.haveOwnProperty('a');
      expect(getterClass.a).to.equal('hello, world');
      expect(getterClass).to.not.haveOwnProperty('b');
    });
  });
});

async function verifyGetRequest(path: string, event: APIGatewayProxyEventV2, context: Context, verifyResponse: (res: any) => any, expectedStatus = 200) {
  const res = await handler[`GET ${path}`](event, context);
  expect(res.statusCode).to.equal(expectedStatus);
  return verifyResponse(res);
}
