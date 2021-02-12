//Tests for associate lambda handler and helpers

import * as associateLambda from '../index';
import { Client } from 'pg';
import { getAssociate, patchAssociate, putAssociate } from '../index';

let testEvent: associateLambda.AssocEvent;

//Author: Tyler
describe('tests for handler', () => {

  associateLambda.getAssociate = jest.fn().mockReturnValue("");
  associateLambda.putAssociate = jest.fn().mockReturnValue("");
  associateLambda.patchAssociate = jest.fn().mockReturnValue("");


  // jest.mock('../index', () => ({
  //   getAssociate: mockGet,
  //   putAssociate: mockPut,
  //   patchAssociate: mockPatch,
  // }));

  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'PUT',
    };

    await associateLambda.handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'GET',
    };

    await associateLambda.handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: '{1:1}',
      httpMethod: 'PATCH',
    };

    await associateLambda.handler(testEvent);

    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
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

  test('that putAssociate does things....', () => {
    let response;

    expect(associateLambda.putAssociate).toBeCalledTimes(1);
    expect(associateLambda.putAssociate).toBeCalledWith();
  });
});

describe('tests for patchAssociate', () => {
  const original: associateLambda.qcFeedback = {
    batchId: 'YYMM-mmmDD-Stuff',
    weekId: 1,
    associateId: 'example@example.net',
    qcNote: 'blablabla',
    qcTechnicalStatus: 2
  };

  const mockConnect = jest.fn();
  const mockQuery = jest.fn();
  const mockEnd = jest.fn();
  jest.mock('pg', () => {
    return {
      Client: jest.fn(() => ({ connect: mockConnect, query: mockQuery, end: mockEnd }))
    }
  });

  test('That updating an associate\'s note works', async () => {
    const testUpdateObject = { qcNote: 'Updated blablabla' };

    const updatedObject = original;
    updatedObject.qcNote = testUpdateObject.qcNote;

    await expect(associateLambda.patchAssociate(JSON.stringify(testUpdateObject))).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test('That updating an associate\'s status works', async () => {
    const testUpdateObject = { qcTechnicalStatus: 3 };

    const updatedObject = original;
    updatedObject.qcTechnicalStatus = testUpdateObject.qcTechnicalStatus;

    await expect(associateLambda.patchAssociate(JSON.stringify(testUpdateObject))).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test('That invalid input returns an error but doesn\'t break anything', async () => {
    const testUpdateObject = { nonsense: 3 };

    await expect(associateLambda.patchAssociate(JSON.stringify(testUpdateObject))).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});
