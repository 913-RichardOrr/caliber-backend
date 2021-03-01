import { handler } from '../../associateLambda/associateLambda';
import * as associateLambda from '../../associateLambda/associateHelpers';

let testEvent: associateLambda.AssociateEvent;

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

  test('test handler can differentiate between put', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'PUT',
    };
    await handler(testEvent);

    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(1);
  });
  test('test handler can differentiate between get', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'GET',
    };

    await handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(1);
  });
  test('test handler can differentiate between patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'PATCH',
    };

    await handler(testEvent);

    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(1);
  });
});
