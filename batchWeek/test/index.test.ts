import * as batchweek from '../index';
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

  test('handler routes correctly to getWeek function', async () => {
    testEvent = {
      path: '/batches/1/weeks/1',
      body: '1',
      httpMethod: 'GET'
    };

    
    // we don't need these to actually do anything right now
    jest.mock('../index', () => ({
      getWeek: jest.fn().mockImplementation(),
    }));

    jest.mock('../index', () => ({
      addNewWeek: jest.fn().mockImplementation(),
    }));

    jest.mock('../index', () => ({
      addNote: jest.fn().mockImplementation(),
    }));

    await batchweek.handler(testEvent);
    // Make sure only the correct function is being called based on path & http method
    expect(batchweek.getWeek).toHaveBeenCalledTimes(1);
    expect(batchweek.addNewWeek).toHaveBeenCalledTimes(0);
    expect(batchweek.addNote).toHaveBeenCalledTimes(0);
  });

  test('handler routes correctly to addNewWeek function', async () => {
    testEvent = {
      path: '/batches/1/weeks',
      body: '1',
      httpMethod: 'POST'
    };
    
    // we don't need these to actually do anything right now
    jest.mock('../index', () => ({
      getWeek: jest.fn().mockImplementation(),
    }));

    jest.mock('../index', () => ({
      addNewWeek: jest.fn().mockImplementation(),
    }));

    jest.mock('../index', () => ({
      addNote: jest.fn().mockImplementation(),
    }));

    await batchweek.handler(testEvent);
    // Make sure only the correct function is being called based on path & http method
    expect(batchweek.getWeek).toHaveBeenCalledTimes(0);
    expect(batchweek.addNewWeek).toHaveBeenCalledTimes(1);
    expect(batchweek.addNote).toHaveBeenCalledTimes(0);
  });

  test('handler routes correctly to addNote function', async () => {
    testEvent = {
      path: '/batches/1/weeks/1',
      body: '1',
      httpMethod: 'POST'
    };
    
    // we don't need these to actually do anything right now
    jest.mock('../index', () => ({
      getWeek: jest.fn().mockImplementation(),
    }));

    jest.mock('../index', () => ({
      addNewWeek: jest.fn().mockImplementation(),
    }));

    jest.mock('../index', () => ({
      addNote: jest.fn().mockImplementation(),
    }));

    await batchweek.handler(testEvent);
    // Make sure only the correct function is being called based on path & http method
    expect(batchweek.getWeek).toHaveBeenCalledTimes(0);
    expect(batchweek.addNewWeek).toHaveBeenCalledTimes(0);
    expect(batchweek.addNote).toHaveBeenCalledTimes(1);
  });
});

describe('batch-week test for getWeek', ()=> {
  test('getWeek calls pg', async ()=> {
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  })

  test('getWeek returns a non-empty object in it/`s promise', async ()=> {
    let result = await batchweek.getWeek();
    // Make sure it's not an empty object
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('id');
  });
});

describe('batch-week test for addNewWeek', ()=> {
  
});

describe('batch-week test for addNote', ()=> {
  
});