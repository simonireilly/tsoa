import { expect } from 'chai';
import 'mocha';
import { handler } from '../fixtures/api-gateway-v2/handler';

describe('API Gateway V2 Handler', () => {
  it('acceptance test', async () => {
    const result = await handler({}, {}, err => err);

    expect(result).to.equal({});
  });
});
