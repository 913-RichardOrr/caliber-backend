import * as batchweek from '../index';

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
        expect(batchweek.addNewWeek).toBeCalledTimes(1);
    })
});

describe('batch-week test for addNote', ()=> {

});

//batches
    //batchid ---> 7

