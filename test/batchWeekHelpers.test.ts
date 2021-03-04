import getWeeksByBatchId from '../batchWeek/lambda/GetWeeksByBatchId';
import AddWeekLambda from '../batchWeek/lambda/AddWeekLambda';
import UpdateFeedbackLambda from '../batchWeek/lambda/UpdateFeedbackLambda';

const mockConnect = jest.fn();
const mockQuery = jest.fn(() => {
  return { rows: {id: 'id'}};
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

describe('batch-week test for getWeeksByBatchId', ()=> {

  test('getWeeksByBatchId calls pg', async ()=> {
    await getWeeksByBatchId('someBatchId');
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });

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
        let testAddNewWeek = AddWeekLambda;
        testAddNewWeek = jest.fn().mockImplementation();
        expect(testAddNewWeek).toBeCalledTimes(1);
    })
});

describe('batch-week test for updateFeedback', ()=> {
  testEvent = {
    path: '/batches/1/weeks/1',
    body: "{'note': 'yey'}",
    httpMethod: 'POST'
  }

  test('that updateFeedback connects to pg', () => {
    UpdateFeedbackLambda(testEvent);
    expect(mockConnect).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(mockEnd).toHaveBeenCalled();
  });

  test('that updateFeedback returns a proper HTTP response', () => {
    let result = UpdateFeedbackLambda(testEvent);
    expect(result).toBeTruthy();
    if(result) {
      expect(result).toHaveProperty('statusCode');
    }
  });

  test('that updateFeedback has been called', () => {
    let mockAddnote = UpdateFeedbackLambda;
    mockAddnote = jest.fn().mockImplementation();

    expect(mockAddnote).toBeCalledTimes(1);
  });
});
