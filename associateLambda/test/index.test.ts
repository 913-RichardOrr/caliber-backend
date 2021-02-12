//Tests for associate lambda handler and helpers

import * as associateLambda from '../index';
import { handler, AssocEvent } from '../index';
import { Client } from 'pg';

let testEvent: associateLambda.AssocEvent;

const mockConnect = jest.fn();
const mockQuery = jest.fn();
const mockEnd = jest.fn();
jest.mock('pg', () => {
  return {
    Client: jest.fn(() => ({
      connect: mockConnect,
      query: mockQuery,
      end: mockEnd,
    })),
  };
});

//Author: Tyler
describe('tests for handler', () => {
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: JSON.stringify({ '1': 1 }),
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

    await associateLambda.handler(testEvent);

    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: JSON.stringify({ '1': 1 }),
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

    await associateLambda.handler(testEvent);

    expect(associateLambda.putAssociate).toHaveBeenCalledTimes(0);
    expect(associateLambda.getAssociate).toHaveBeenCalledTimes(1);
    expect(associateLambda.patchAssociate).toHaveBeenCalledTimes(0);
  });
  test('test handler can differentiate between get/put/patch', async () => {
    testEvent = {
      path: '/something',
      body: JSON.stringify({ '1': 1 }),
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

    await associateLambda.handler(testEvent);

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
  let body: associateLambda.qcFeedback = {
    batchId: 'batch1',
    weekId: 1,
    associateId: 'testAssociateId',
    qcNote: 'test note',
    qcTechnicalStatus: 2,
  };

  test('that putAssociate returns the object', async () => {
    let response;
    Client.query = jest.fn().mockResolvedValue({ data: response });

    await associateLambda.putAssociate().then((result: any) => {
      response = result;
    });

    expect(response).toBe(body);
    expect(Client.query).toHaveBeenCalledTimes(1);
    expect(Client.connect).toHaveBeenCalledTimes(1);
    expect(Client.end).toHaveBeenCalledTimes(1);
  });
});

describe('tests for patchAssociate', () => {
  const original: associateLambda.qcFeedback = {
    batchId: 'YYMM-mmmDD-Stuff',
    weekId: 1,
    associateId: 'example@example.net',
    qcNote: 'blablabla',
    qcTechnicalStatus: 2,
  };

  test("That updating an associate's note calls pg with correct query", async () => {
    const testUpdateObject = { qcNote: 'Updated blablabla' };

    const updatedObject = original;
    updatedObject.qcNote = testUpdateObject.qcNote;

    await expect(
      associateLambda.patchAssociate(JSON.stringify(testUpdateObject))
    ).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(
      mockQuery
    ).toHaveBeenLastCalledWith(
      'update qcnotes set note = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $3::text',
      [
        testUpdateObject.qcNote,
        original.associateId,
        original.weekId,
        original.batchId,
      ]
    );
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That updating an associate's status calls pg with correct query", async () => {
    const testUpdateObject = { qcTechnicalStatus: 3 };

    const updatedObject = original;
    updatedObject.qcTechnicalStatus = testUpdateObject.qcTechnicalStatus;

    await expect(
      associateLambda.patchAssociate(JSON.stringify(testUpdateObject))
    ).toBe(updatedObject);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(
      mockQuery
    ).toHaveBeenLastCalledWith(
      'update qcnotes set techstatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $3::text',
      [
        testUpdateObject.qcTechnicalStatus,
        original.associateId,
        original.weekId,
        original.batchId,
      ]
    );
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

  test("That invalid input returns null but doesn't break anything", async () => {
    const testUpdateObject = { nonsense: 3 };

    await expect(
      associateLambda.patchAssociate(JSON.stringify(testUpdateObject))
    ).toBe(null);
    expect(mockConnect).toHaveBeenCalledTimes(0);
    expect(mockQuery).toHaveBeenCalledTimes(0);
    expect(mockEnd).toHaveBeenCalledTimes(0);
  });
});
