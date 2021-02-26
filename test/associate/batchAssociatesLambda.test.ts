import { handler } from '../../batchAssociatesLambda/batchAssociatesLambda';
import * as batchAssociatesHelper from '../../batchAssociatesLambda/batchAssociatesHelper';

let testEvent: batchAssociatesHelper.AssociateEvent;

jest.mock('../../associateLambda/associateHelpers', () => {
  const mockget = jest.fn();
  const mockput = jest.fn();
  const mockpatch = jest.fn();

  return {
    getAssociate: mockget,
    putAssociate: mockput,
    patchAssociate: mockpatch,
  };
});

describe('tests for handler', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Tests to make sure that the GetMethod is called when using this handler', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'GET',
    };

    await handler(testEvent);

    expect(batchAssociatesHelper.getAssociates).toHaveBeenCalledTimes(1);
  });
});
