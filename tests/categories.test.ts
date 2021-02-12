/* const getCategories = require('../categories/categories.get')
const addCategory = require('../categories/category.add')
const deleteCategory = require('../categories/category.delete') */

import { createResponse } from '../response'
import { Client } from 'pg';

jest.mock('pg', () => {
    const mockClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn()
    };
    return { Client: jest.fn(() => mockClient) }
  })
  
  jest.mock('../response', () => {
    return {
      createResponse: jest.fn()
    };
  });
  
  describe('Lambda Tests', () => {
    let client: any;
    beforeEach(() => {
      client = new Client;
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('that getCategories returns a promise with data in it', async () => {

        client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    
        await getCategories.handler()
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('select skill from weekCategories where batchid = 0 and week = 0');
        expect(client.end).toBeCalledTimes(1);
        expect(createResponse).toBeCalledWith('[]', 200);
    
    
      });
    
      test('that getCategories returns an error status when client returns nothing', async () => {
        client.query.mockResolvedValueOnce();
        await getCategories.handler();
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('select skill from weekCategories where batchid = 0 and week = 0');
        expect(client.end).toBeCalledTimes(1);
        expect(createResponse).toBeCalledWith('', 400);
    
      })

  test('that addCategories returns a created status', async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    let body = JSON.stringify({ skill: 'React', batchID:0, week:0 });
    let event = { body, test };
    await addCategory.handler(event);
    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith('insert into weekCategories (skill, batchID, week) values ($1, $2, $3)', ["React", 0,0]);
    expect(client.end).toBeCalledTimes(1);
    expect(createResponse).toBeCalledWith('', 200);

  });

  test('that addCategories returns an error status when client returns nothing', async () => {
    client.query.mockResolvedValueOnce();
    let body = JSON.stringify({ skill: 'React', batchID:0, week:0 });
    let event = { body, test };
    await addCategory.handler(event);
    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith('insert into weekCategories (skill, batchID, week) values ($1, $2, $3)', ["React", 0,0]);
    expect(client.end).toBeCalledTimes(1);
    expect(createResponse).toBeCalledWith('', 400);

  });

  test('that deleteCategoires returns an ok status', async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    let body = JSON.stringify(0);
    let event = { body, test };
    await deleteCategory.handler(event);
    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith('delete from weekCategories where id = 0');
    expect(client.end).toBeCalledTimes(1);
    expect(createResponse).toBeCalledWith('', 200);
  });

  test('that deleteCategoires returns an error status when client returns nothing', async () => {
    client.query.mockResolvedValueOnce();
    let body = JSON.stringify(0);
    let event = { body, test };
    await deleteCategory.handler(event);
    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith('delete from weekCategories where id = 0');
    expect(client.end).toBeCalledTimes(1);
    expect(createResponse).toBeCalledWith('', 400);
  });


})