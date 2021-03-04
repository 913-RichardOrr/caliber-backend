import { handler, AssociateEvent } from '../../batchAssociatesLambda/batchAssociatesLambda';
import * as batchAssociatesHelper from '../../batchAssociatesLambda/batchAssociatesHelper';
import createResponse from '../../batchAssociatesLambda/response';

let testEvent: AssociateEvent = {
  path: '/something',
  httpMethod: 'GET',
};

let testAssociates = [ {"id": "associate1@example.net"}, {"id": "associate2@example.net"} ];

jest.mock('../../batchAssociatesLambda/batchAssociatesHelper', () => {
  const mockget = jest.fn().mockImplementation((path) => {
    if(path === '/something') {
      return testAssociates
    } else {
      return null;
    }});
  return {
    getAssociates: mockget
  };
});
jest.mock('../../batchAssociatesLambda/response', () => {
  return jest.fn().mockImplementation((one, two) => { return {"body": one}});
});

describe('tests for handler', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('That getAssociates is called using the given path, and createResponse can return 200', async () => {
    const res = await handler(testEvent);

    expect(res).toEqual({"body": JSON.stringify(testAssociates)});
    expect(batchAssociatesHelper.getAssociates).toHaveBeenCalledTimes(1);
    expect(batchAssociatesHelper.getAssociates).toHaveBeenLastCalledWith(testEvent.path);
    expect(createResponse).toHaveBeenCalledTimes(1);
    expect(createResponse).toHaveBeenLastCalledWith(JSON.stringify(testAssociates), 200);
  });

  test('That when no associates are returned, we return a 404', async () => {
    testEvent = {
      path: '/nothing',
      httpMethod: 'GET',
    };

    const res = await handler(testEvent);

    expect(res).toEqual({"body": ""});
    expect(batchAssociatesHelper.getAssociates).toHaveBeenCalledTimes(1);
    expect(batchAssociatesHelper.getAssociates).toHaveBeenLastCalledWith(testEvent.path);
    expect(createResponse).toHaveBeenCalledTimes(1);
    expect(createResponse).toHaveBeenLastCalledWith("", 404);
  });
});
