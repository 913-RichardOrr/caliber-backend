import { handler } from '../batchWeek/lambda/index';
import getWeeksByBatchId from '../batchWeek/lambda/GetWeeksByBatchId';
import AddWeekLambda from '../batchWeek/lambda/AddWeekLambda';
import UpdateFeedbackLambda from '../batchWeek/lambda/UpdateFeedbackLambda';

jest.mock('../batchWeek/lambda/GetWeeksByBatchId');
jest.mock('../batchWeek/lambda/AddWeekLambda');
jest.mock('../batchWeek/lambda/UpdateFeedbackLambda');

let testEvent = {
  path: 'path',
  body: "1",
  httpMethod: 'method'
}

describe('batch-week test for handler', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('handler routes correctly to GetWeeks function', async () => {
    testEvent = {
      path: '/batches/1/weeks',
      body: '1',
      httpMethod: 'GET'
    };

    await handler(testEvent);

    expect(getWeeksByBatchId).toHaveBeenCalledTimes(1);
    expect(AddWeekLambda).toHaveBeenCalledTimes(0);
    expect(UpdateFeedbackLambda).toHaveBeenCalledTimes(0);
  });

  test('handler routes correctly to AddWeek function', async () => {
    testEvent = {
      path: '/batches/1/weeks',
      body: '1',
      httpMethod: 'POST'
    };

    await handler(testEvent);

    expect(getWeeksByBatchId).toHaveBeenCalledTimes(0);
    expect(AddWeekLambda).toHaveBeenCalledTimes(1);
    expect(UpdateFeedbackLambda).toHaveBeenCalledTimes(0);
  });

  test('handler routes correctly to UpdateFeedback function', async () => {
    testEvent = {
      path: '/batches/1/weeks/1',
      body: '1',
      httpMethod: 'POST'
    };

    await handler(testEvent);
    
    expect(getWeeksByBatchId).toHaveBeenCalledTimes(0);
    expect(AddWeekLambda).toHaveBeenCalledTimes(0);
    expect(UpdateFeedbackLambda).toHaveBeenCalledTimes(1);
  });

  test('handler returns 400 status code on invalid event', async () => {
    testEvent = {
      path: '/batches/1/weeks/1',
      body: '1',
      httpMethod: 'DELETE'
    };

    const result = await handler(testEvent);
    
    expect(result).toBeTruthy();
    if(result) {
      expect(result).toHaveProperty('statusCode');
      if(result.statusCode) {
        expect(result.statusCode).toEqual(400);
      }
    }
  });
});