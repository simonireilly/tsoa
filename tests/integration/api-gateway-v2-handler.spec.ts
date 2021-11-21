import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { expect } from 'chai';
import { TestModel } from '../fixtures/testModel';
import 'mocha';
import { handler } from '../fixtures/api-gateway-v2/handler';
import { apiGatewayProxyEventFactory, lambdaContextFactory } from 'factories/api-gateway-v2';
import { base64image } from 'fixtures/base64image';
import { testModelFactory } from 'factories';

const mockContext = lambdaContextFactory.build();

// TODO: Copy across tests from file://./express-server.spec.ts
describe('API Gateway V2 Handler', () => {
  describe('GET specification', () => {
    it('can handle get request to root controller`s path', async () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1',
        rawPath: `/v1`,
      });
      return verifyGetRequestV2(
        event,
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
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/rootControllerMethodWithPath',
        rawPath: `/v1/rootControllerMethodWithPath`,
      });
      return verifyGetRequestV2(event, mockContext, res => {
        const { body } = res;
        const model = (body && JSON.parse(body)) as TestModel;
        expect(model.id).to.equal(1);
      });
    });

    it('can handle get request with path argument', async () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/Current',
        rawPath: `/v1/GetTest/Current`,
      });
      return verifyGetRequestV2(event, mockContext, res => {
        const { body } = res;
        const model = (body && JSON.parse(body)) as TestModel;
        expect(model.id).to.equal(1);
      });
    });

    it('respects toJSON for class serialization', async () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/SimpleClassWithToJSON',
        rawPath: `/v1/GetTest/SimpleClassWithToJSON`,
      });
      return verifyGetRequestV2(event, mockContext, res => {
        const { body } = res;
        const getterClass = body && JSON.parse(body);
        expect(getterClass).to.haveOwnProperty('a');
        expect(getterClass.a).to.equal('hello, world');
        expect(getterClass).to.not.haveOwnProperty('b');
      });
    });

    it('can handle get request with collection return value', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/Multi',
        rawPath: `/v1/GetTest/Multi`,
      });
      return verifyGetRequestV2(event, mockContext, res => {
        const { body } = res;
        const models = (body && JSON.parse(body)) as TestModel[];
        expect(models.length).to.equal(3);
        models.forEach(m => {
          expect(m.id).to.equal(1);
        });
      });
    });

    it('can handle get request with path and query parameters', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/:numberPathParam/:booleanPathParam/:stringPathParam',
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

    it('returns error and custom error message', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/:numberPathParam/:booleanPathParam/:stringPathParam',
        queryStringParameters: {
          booleanParam: 'true',
          numberParam: '1234',
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
          expect(parsedBody.fields.stringParam.message).to.equal(`Custom error message`);
        },
        400,
      );
    });

    it('parses path parameters', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/:numberPathParam/:booleanPathParam/:stringPathParam',
        queryStringParameters: {
          booleanParam: 'true',
          numberParam: '1234',
          stringParam: 'test1234',
        },
        pathParameters: {
          numberPathParam: '10',
          stringPathParam: 'the-string',
          booleanPathParam: 'false',
        },
      });
      const numberValue = 10;
      const boolValue = false;
      const stringValue = 'the-string';
      return verifyGetRequestV2(
        event,
        mockContext,
        res => {
          const { body } = res;
          const model = body && (JSON.parse(body) as TestModel);
          expect(model.numberValue).to.equal(numberValue);
          expect(model.boolValue).to.equal(boolValue);
          expect(model.stringValue).to.equal(stringValue);
        },
        200,
      );
    });

    it('parses query parameters', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/:numberPathParam/:booleanPathParam/:stringPathParam',
        queryStringParameters: {
          booleanParam: 'true',
          numberParam: '1',
          stringParam: 'testing',
          optionalStringParam: 'the-string',
        },
        pathParameters: {
          numberPathParam: '10',
          stringPathParam: 'the-string',
          booleanPathParam: 'false',
        },
      });
      const stringValue = 'the-string';
      return verifyGetRequestV2(
        event,
        mockContext,
        res => {
          const { body } = res;
          const model = body && (JSON.parse(body) as TestModel);
          expect(model.optionalString).to.equal(stringValue);
        },
        200,
      );
    });

    it.skip('Should return on @Res');

    [400, 500].forEach(statusCode => it.skip('Should support multiple status codes with the same @Res structure'));

    it.skip('Should not modify the response after headers sent');

    it('parses buffer parameter', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/HandleBufferType',
        queryStringParameters: {
          buffer: base64image,
        },
      });
      return verifyGetRequestV2(event, mockContext, res => {
        return;
      });
    });

    it.skip('returns streamed responses', () => {
      const event = apiGatewayProxyEventFactory.build({
        routeKey: 'GET /v1/GetTest/HandleStreamType',
      });
      return verifyGetRequestV2(event, mockContext, res => {
        const { body } = res;
        expect(body).to.equal('testbuffer');
        return;
      });
    });
  });

  describe('POST Specification', () => {
    it.skip('should reject invalid additionalProperties', () => {
      // const invalidValues = ['invalid', null, [], 1, { foo: null }, { foo: 1 }, { foo: [] }, { foo: {} }, { foo: { foo: 'bar' } }];
      // return Promise.all(
      //   invalidValues.map((value: any) => {
      //     return verifyPostRequest(basePath + '/PostTest/Object', { obj: value }, (err: any, res: any) => null, 400);
      //   }),
      // );
    });

    it('parsed body parameters', () => {
      const data = testModelFactory.build();
      const event = apiGatewayProxyEventFactory.build({
        body: JSON.stringify(data),
        routeKey: 'POST /v1/PostTest',
      });

      return verifyGetRequestV2(event, mockContext, res => {
        const model = res.body as TestModel;
        expect(model).to.deep.equal(model);
      });
    });
  });
});

async function verifyGetRequestV2(event: APIGatewayProxyEventV2, context: Context, verifyResponse: (res: any) => any, expectedStatus = 200) {
  const res = await handler[event.routeKey](event, context, err => {
    err;
  });

  expect(res.statusCode).to.equal(expectedStatus);

  return verifyResponse(res);
}
