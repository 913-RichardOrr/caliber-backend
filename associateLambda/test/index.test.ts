//Tests for associate lambda handler and helpers

import * as associateLambda from '../index';
import { handler, AssocEvent } from '../index';

let testEvent: AssocEvent;

//Author: Tyler
describe('tests for handler', () => {
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: { '1': 1 },
      method: 'PUT',
    };

    jest.mock('../associateService', () => ({
      getAssociate: jest.fn().mockImplementation(),
    }));
    jest.mock('../associateService', () => ({
      putAssociate: jest.fn().mockImplementation(),
    }));
    jest.mock('../associateService', () => ({
      patchAssociate: jest.fn().mockImplementation(),
    }));

    await handler(testEvent);

    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: { '1': 1 },
      method: 'GET',
    };

    jest.mock('../associateService', () => ({
      getAssociate: jest.fn().mockImplementation(),
    }));
    jest.mock('../associateService', () => ({
      putAssociate: jest.fn().mockImplementation(),
    }));
    jest.mock('../associateService', () => ({
      patchAssociate: jest.fn().mockImplementation(),
    }));

    await handler(testEvent);

    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: { '1': 1 },
      method: 'PATCH',
    };

    jest.mock('../associateService', () => ({
      getAssociate: jest.fn().mockImplementation(),
    }));
    jest.mock('../associateService', () => ({
      putAssociate: jest.fn().mockImplementation(),
    }));
    jest.mock('../associateService', () => ({
      patchAssociate: jest.fn().mockImplementation(),
    }));

    await handler(testEvent);

    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(1);
  });
});

describe('tests for getAssociate', async () => {
  testEvent.path = '/something';

  test('that getAssociate gets associate');
});

describe('tests for putAssociate', () => {
  testEvent.path = 'idk';
  testEvent.body = JSON.stringify({
    batchId: 'batch1',
    weekId: 1,
    associateId: 'testAssociateId',
    qcNote: 'test note',
    qcTechnicalStatus: 2,
  });

  test('that putAssociate does things....', async () => {
    let response;
    await associateLambda.putAssociate().then((result: any) => {
      response = result;
    });

    expect(associateLambda.putAssociate).toBeCalledTimes(1);
    expect(associateLambda.putAssociate).toBeCalledWith();
  });
});
