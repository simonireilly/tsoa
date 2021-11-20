import { Factory } from 'fishery';
import { Context } from 'aws-lambda';
import { v4 } from 'uuid';

export const lambdaContextFactory = Factory.define<Context>(({}) => ({
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'functionName',
  functionVersion: '1',
  invokedFunctionArn: 'arn',
  memoryLimitInMB: '512',
  awsRequestId: v4(),
  logGroupName: 'logGroupName',
  logStreamName: 'logStreamName',
  identity: undefined,
  clientContext: undefined,
  getRemainingTimeInMillis: () => 5000,
  done: () => {
    return;
  },
  fail: () => {
    return;
  },
  succeed: () => {
    return;
  },
}));
