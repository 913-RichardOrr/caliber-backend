import { Client } from 'pg';
import * as categoriesLambda from '../categoriesFeature/categoriesLambda';

// mocked client
jest.mock('pg', () => {
    const mClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
  });

describe('Given an event, the handler can determine the correct method', () => {
    // mocked event
    const mEvent = {
        path: '',
        body: {},
        method: '',
        queryStringParameters: {},
    }

    // mock functions needed
    beforeAll(() => {
        jest.mock('helper functions', () => ({
            getCategories: jest.fn().mockImplementation(),
            postCategories: jest.fn().mockImplementation(),
            putCategory: jest.fn().mockImplementation(),
        }));
    });

    test('that method is GET', async () => {
        mEvent.method = 'GET';

        await categoriesLambda.handler(mEvent);

        expect(categoriesLambda.getCategories).toHaveBeenCalledTimes(1);
        expect(categoriesLambda.postCategories).toHaveBeenCalledTimes(0);
        expect(categoriesLambda.putCategory).toHaveBeenCalledTimes(0);
    });

    test('that method is POST', async () => {
        mEvent.method = 'POST';

        await categoriesLambda.handler(mEvent);
        
        expect(categoriesLambda.postCategories).toHaveBeenCalledTimes(1);
        expect(categoriesLambda.getCategories).toHaveBeenCalledTimes(0);
        expect(categoriesLambda.putCategory).toHaveBeenCalledTimes(0);
        
    });

    test('that method is PUT', async () => {
        mEvent.method = 'PUT';
        
        await categoriesLambda.handler(mEvent);
        
        expect(categoriesLambda.putCategory).toHaveBeenCalledTimes(1);
        expect(categoriesLambda.getCategories).toHaveBeenCalledTimes(0);
        expect(categoriesLambda.postCategories).toHaveBeenCalledTimes(0);
    });
});


describe('getCategories', () => {
    
    let client: any;
    let mEvent: any;

    // create mocks
    beforeEach(() => {
        client = new Client();
        mEvent = {
            path: '/test',
            body: {},
            method: 'GET',
            queryStringParameters: {}
        }
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET request should succeed', async () => {
        mEvent.queryStringParameters = {param1: 'active?active=true'};
        const res = await categoriesLambda.getCategories(mEvent.queryStringParameters);
        expect(client.connect).toBeCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(client.query).toBeCalledWith('select * from categories where active=true');
        expect(client.end).toBeCalledTimes(1);
    });
});

describe('postCategories', () => {

    let client: any;
    let mEvent: any;

    // create mocks
    beforeEach(() => {
        client = new Client();
        mEvent = {
            path: '',
            body: {},
            method: '',
            queryStringParameters: {}
        }
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('POST request should succeed', async () => {
        mEvent.body = {skill: 'testskill', active: true};
        const res = await categoriesLambda.postCategories(mEvent.body);
        expect(client.connect).toBeCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(client.query).toBeCalledWith(`insert into categories (skill,active) values(${mEvent.body.skill},${mEvent.body.active})`);
        expect(client.end).toBeCalledTimes(1);
    });

    test('POST request should fail', async () => {
        mEvent.body = {skill: 'testskill'};
        const res = await categoriesLambda.postCategories(mEvent.body);
        expect(client.connect).toBeCalledTimes(1);
        expect(res.statusCode).not.toBe(200);
        expect(client.query).toBeCalledWith(`insert into categories (skill,active) values(${mEvent.body.skill},${mEvent.body.active})`);
        expect(client.end).toBeCalledTimes(1);
    });
});

describe('putCategory', () => {
    
    let client: any;
    let mEvent: any;

    // create a mocked client
    beforeEach(() => {
        client = new Client();
        mEvent = {
            path: '',
            body: {},
            method: '',
            queryStringParameters: {}
        }
    });

    // clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('PUT request should succeed', async() => {
        mEvent.body = {id: 1, skill: 'skill', active: true};
        const res = await categoriesLambda.putCategory(mEvent.body);
        expect(client.connect).toBeCalledTimes(1);
        expect(res.statusCode).toBe(200);
        expect(client.query).toBeCalledWith(`update categories set skill=${mEvent.body.skill}, active=${mEvent.body.active} where id=${mEvent.body.id}`);
        expect(client.end).toBeCalledTimes(1);
    });

    test('PUT request should fail', async () => {
        mEvent.body = {skill: 'testskill'};
        const res = await categoriesLambda.postCategories(mEvent.body);
        expect(client.connect).toBeCalledTimes(1);
        expect(res.statusCode).not.toBe(200);
        expect(client.query).toBeCalledWith(`update categories set skill=${mEvent.body.skill}, active=${mEvent.body.active} where id=${mEvent.body.id}`);
        expect(client.end).toBeCalledTimes(1);
    });
});