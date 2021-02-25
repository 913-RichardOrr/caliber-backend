<<<<<<< HEAD:test/BatchWeek.test.ts
import * as batchweek from '../batchWeek/lambda/index';
=======
import * as batchweek from '../batchWeek/index';
>>>>>>> e039ce54ab66a80629ca33e7312eb6db5b467746:batchWeek/test/index.test.ts
import getWeeksByBatchId from '../batchWeek/lambda/GetWeeksByBatchId';
import { Client } from 'pg';

const mockConnect = jest.fn();
const mockQuery = jest.fn(() => {
  return { id: "something" };
});
const mockEnd = jest.fn();
jest.mock('pg', () => {
  return {
    Client: jest.fn(() => ({ connect: mockConnect, query: mockQuery, end: mockEnd }))
  }
});

let testEvent = {
  path: 'path',
  body: "1",
  httpMethod: 'method'
}

describe('batch-week test for handler', () => {

  test.only('handler routes correctly to getWeek function', async () => {
    testEvent = {
      path: '/batches/1/weeks/1',
      body: '1',
      httpMethod: 'GET'
    };

    await batchweek.handler(testEvent);

    let testAddNewWeek = batchweek.addNewWeek;
    let testGetWeek = batchweek.getWeek;
    let testAddNote = batchweek.addNote;
    testAddNewWeek = jest.fn().mockImplementation();
    testGetWeek = jest.fn().mockImplementation();
    testAddNote = jest.fn().mockImplementation();
    expect(testAddNewWeek).toHaveBeenCalledTimes(0);
    expect(testAddNote).toHaveBeenCalledTimes(0);
    expect(testGetWeek).toHaveBeenCalledTimes(1);
  });

  test('handler routes correctly to addNewWeek function', async () => {
    testEvent = {
      path: '/batches/1/weeks',
      body: '1',
      httpMethod: 'POST'
    };

    await batchweek.handler(testEvent);

    let testAddNewWeek = batchweek.addNewWeek;
    let testGetWeek = batchweek.getWeek;
    let testAddNote = batchweek.addNote;
    testAddNewWeek = jest.fn().mockImplementation();
    testGetWeek = jest.fn().mockImplementation();
    testAddNote = jest.fn().mockImplementation();
    expect(testAddNewWeek).toHaveBeenCalledTimes(1);
    expect(testAddNote).toHaveBeenCalledTimes(0);
    expect(testGetWeek).toHaveBeenCalledTimes(0);
  });

  test('handler routes correctly to addNote function', async () => {
    testEvent = {
      path: '/batches/1/weeks/1',
      body: '1',
      httpMethod: 'POST'
    };

    await batchweek.handler(testEvent);

    let testAddNewWeek = batchweek.addNewWeek;
    let testGetWeek = batchweek.getWeek;
    let testAddNote = batchweek.addNote;
    testAddNewWeek = jest.fn().mockImplementation();
    testGetWeek = jest.fn().mockImplementation();
    testAddNote = jest.fn().mockImplementation();
    expect(testAddNewWeek).toHaveBeenCalledTimes(0);
    expect(testAddNote).toHaveBeenCalledTimes(1);
    expect(testGetWeek).toHaveBeenCalledTimes(0);
  });
});

describe('batch-week test for getWeeksByBatchId', ()=> {
  test('getWeeksByBatchId calls pg', async ()=> {
    await getWeeksByBatchId('someBatchId');
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  })

  test('getWeeksByBatchId returns a proper HTTP response', async ()=> {
    let result = await getWeeksByBatchId('someBatchId');
    expect(result).toBeTruthy();
    if(result) {
      expect(result).toHaveProperty('statusCode');
    }
  });

  test('getWeeksByBatchId returns the mocked query result in it\'s body', async ()=> {
    let result = await getWeeksByBatchId('someBatchId');
    expect(result).toBeTruthy();
    if(result) {
      expect(result).toHaveProperty('body');
      if(result.body) {
        expect(JSON.parse(result.body)).toHaveProperty('id');
      }
    }
  });
});

describe('batch-week test for addNewWeek', ()=> {
    testEvent.path = '/batches/1/weeks/1';
    testEvent.body = JSON.stringify({
      id: 1,
      category_id: 1,
      batch_id: '1',
      week: 1
    });

    test('add a new week', () => {
        let testAddNewWeek = batchweek.addNewWeek;
        testAddNewWeek = jest.fn().mockImplementation();
        expect(testAddNewWeek).toBeCalledTimes(1);
    })
});

describe('batch-week test for addNote', ()=> {
  testEvent.path = '/batches/1/weeks/1';
  testEvent.body = JSON.stringify({
    batchId: '1',
    weekId: 1,
    overallNote: 'yey'
  });

  test('that addNote has been called', () => {
    let testAddNote = batchweek.addNote;
    testAddNote = jest.fn().mockImplementation();
    expect(testAddNote).toBeCalledTimes(1);
  });
});

