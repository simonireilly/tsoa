import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { expect } from 'chai';
import { TestModel } from '../fixtures/testModel';
import 'mocha';
import { handler } from '../fixtures/api-gateway-v2/handler';
import { apiGatewayProxyEventFactory } from 'factories/api-gateway-v2';

// TODO: This one big test file will cause pain for future developers
//
// Propose doing GET/POST/PUT/PATCH/DELETE in separate files :+1:
const mockEvent = apiGatewayProxyEventFactory.build();
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

// TODO: Copy across tests from file://./express-server.spec.ts
describe('API Gateway V2 Handler', () => {
  describe('GET specification', () => {
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

    it('can handle get request with collection return value', () => {
      return verifyGetRequest(basePath + '/GetTest/Multi', mockEvent, mockContext, res => {
        const { body } = res;
        const models = (body && JSON.parse(body)) as TestModel[];
        expect(models.length).to.equal(3);
        models.forEach(m => {
          expect(m.id).to.equal(1);
        });
      });
    });

    // TODO: Improve factories
    //
    // The API Gateway event destructuring isn't anything special, we should
    // have a helper that does everything from the path.
    it('can handle get request with path and query parameters', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/:numberPathParam/:booleanPathParam/:stringPathParam',
        rawPath: `/v1/GetTest/${1}/${true}/test?booleanParam=true&stringParam=test1234&numberParam=1234`,
        rawQueryString: 'booleanParam=true&stringParam=test1234&numberParam=1234',
        queryStringParameters: {
          booleanParam: 'true',
          stringParam: 'test1234',
          numberParam: '1234',
        },
        pathParameters: {
          numberPathParam: '1',
          stringPathParam: 'test',
          booleanPathParam: 'true',
        },
      });
      return verifyGetRequestV2(event, mockContext, res => {
        const { body } = res;
        const model = (body && JSON.parse(body)) as TestModel;
        expect(model.id).to.equal(1);
      });
    });

    it.skip('injects express request in parameters');

    it('returns error if missing required query parameter', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/:numberPathParam/:booleanPathParam/:stringPathParam',
        rawPath: `/v1/GetTest/${1}/${true}/test?booleanParam=true&stringParam=test1234`,
        rawQueryString: 'booleanParam=true&stringParam=test1234',
        queryStringParameters: {
          booleanParam: 'true',
          stringParam: 'test1234',
        },
        pathParameters: {
          numberPathParam: '1',
          stringPathParam: 'test',
          booleanPathParam: 'true',
        },
      });
      return verifyGetRequestV2(
        event,
        mockContext,
        res => {
          const { body } = res;
          const parsedBody = body && JSON.parse(body);
          expect(parsedBody.fields.numberParam.message).to.equal(`'numberParam' is required`);
        },
        400,
      );
    });
  });
});

async function verifyGetRequest(path: string, event: APIGatewayProxyEventV2, context: Context, verifyResponse: (res: any) => any, expectedStatus = 200) {
  const res = await handler[`GET ${path}`](event, context);
  expect(res.statusCode).to.equal(expectedStatus);

  return verifyResponse(res);
}

async function verifyGetRequestV2(event: APIGatewayProxyEventV2, context: Context, verifyResponse: (res: any) => any, expectedStatus = 200) {
  const res = await handler[event.routeKey](event, context, err => {
    err;
  });
  expect(res.statusCode).to.equal(expectedStatus);

  return verifyResponse(res);
}
