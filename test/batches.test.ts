//welcome we are testing the batches endpoint.

import axios from 'axios';
import { handler, MyEvent, agent } from '../batches/getBatchesLambda';
import allBatchesHandler, {
  allBatchesAgent,
} from '../batches/getAllBatchesLambda';
import validYearsHandler, {
  validYearAgent,
} from '../batches/getValidYearsLambda';

jest.mock('axios');

describe('Batches Test Suite', () => {
  let caliberTrainerEmail: string =
    'mock1027.employee74df14df-5842-4811-a57c-be9836537a40@mock.com';
  let caliberURI: string =
    'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

  class BatchProjection {
    constructor(
      public batchId: string, //"TR-1131",
      public name: string, //"Mock Batch 65",
      public startDate: string, //"2021-04-09",
      public endDate: string, //"2021-06-18",
      public skill: string, // "Java React",
      public location: string, // "New York",
      public type: string, // "Revature"
      public trainerEmail: string, // "",
      public trainerFirstName: string, // "",
      public trainerLastName: string // "",
    ) {
      this.batchId = batchId;
      this.name = name;
      this.startDate = startDate;
      this.endDate = endDate;
      this.skill = skill;
      this.location = location;
      this.type = type;
      this.trainerEmail = trainerEmail;
      this.trainerFirstName = trainerFirstName;
      this.trainerLastName = trainerLastName;
    }
  }

  test('Get Batches By Trainer Lambda axios requests', async () => {
    const batchIDs = ['TR-1111', 'TR-1112', 'TR-1113'];

    const batch1 = new BatchProjection(
      'TR-1131',
      'Mock Batch 100',
      '2019-01-01',
      '2019-04-01',
      'React',
      'New York',
      'Revature',
      'mock1027.employee74df14df-5842-4811-a57c-be9836537a40@mock.com',
      '',
      ''
    );
    const batch2 = new BatchProjection(
      'TR-1112',
      'Mock Batch 2',
      '2021-06-07',
      '2021-08-06',
      'COBOL',
      'Tampa',
      'Revature',
      'mock1027.employee74df14df-5842-4811-a57c-be9836537a40@mock.com',
      '',
      ''
    );
    const batch3 = new BatchProjection(
      'TR-1111',
      'Mock Batch 3',
      '2021-05-01',
      '2021-08-01',
      'Java',
      'West Virginia',
      'Corporate',
      'mock1027.employee74df14df-5842-4811-a57c-be9836537a40@mock.com',
      '',
      ''
    );
    const batches = [batch1, batch2, batch3];
    const resp = { data: batches };
    // the response will be a list of a projection of batch objects
    let returnValues: any = [];
    //mock axios request to the caliber api to get the list of batches based on the trainer
    //mock axios request to the caliber api to get info about the batches based on the batchID
    axios.get = jest
      .fn()
      .mockImplementationOnce(() => {
        return Promise.resolve({ data: batchIDs });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({ data: batch1 });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({ data: batch2 });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({ data: batch3 });
      });

    let myEvent: MyEvent = {
      queryStringParameters: {
        trainerEmail: caliberTrainerEmail,
      },
    };
    await handler(myEvent).then((data: any) => (returnValues = data));
    // test to make sure that the axios requests have been called the number of batches plus one
    expect(axios.get).toHaveBeenCalledTimes(batches.length + 1);

    // test to make sure that response is equal to resp
    expect(JSON.parse(returnValues.body)).toEqual(resp.data);
    // test to make sure that all of the requests are called with the caliber api

    expect(axios.get).toHaveBeenCalledWith(
      `${caliberURI}/${caliberTrainerEmail}/ids`,
      {
        httpsAgent: agent,
      }
    );
    for (let batchID of batchIDs) {
      expect(axios.get).toHaveBeenCalledWith(`${caliberURI}/${batchID}`, {
        httpsAgent: agent,
      });
    }
  });

  test('Get All Batches Lambda axios requests', async () => {
    const batch1 = new BatchProjection(
      'TR-1131',
      'Mock Batch 100',
      '2019-01-01',
      '2019-04-01',
      'React',
      'New York',
      'Revature',
      '',
      '',
      ''
    );
    const batch2 = new BatchProjection(
      'TR-1112',
      'Mock Batch 2',
      '2021-06-07',
      '2021-08-06',
      'COBOL',
      'Tampa',
      'Revature',
      '',
      '',
      ''
    );
    const batch3 = new BatchProjection(
      'TR-1111',
      'Mock Batch 3',
      '2021-05-01',
      '2021-08-01',
      'Java',
      'West Virginia',
      'Corporate',
      '',
      '',
      ''
    );
    const batches = [batch1, batch2, batch3];
    const resp = { data: batches };
    let returnValues: any = [];
    //mock axios request to the caliber api to get all batches
    axios.get = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({ data: batches });
    });

    await allBatchesHandler().then((data: any) => (returnValues = data));
    // test to make sure that the axios requests have been called the number of batches plus one
    expect(axios.get).toHaveBeenCalledTimes(1);

    // test to make sure that response is equal to resp
    expect(JSON.parse(returnValues.body)).toEqual(resp.data);
    // test to make sure that all of the requests are called with the caliber api

    expect(axios.get).toHaveBeenCalledWith(`${caliberURI}`, {
      httpsAgent: allBatchesAgent,
      params: '',
    });
  });

  test('Get all valid years', async () => {
    const years = [2020, 2021];
    const resp = { data: years };

    let returnValues: any = [];

    //mock axios request to the caliber api to get all valid years
    axios.get = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({ data: years });
    });

    await validYearsHandler().then((data: any) => (returnValues = data));

    expect(axios.get).toHaveBeenCalledTimes(1);
    const response = JSON.parse(returnValues.body);
    expect(JSON.parse(response.body)).toEqual(resp.data);

    expect(axios.get).toHaveBeenCalledWith(`${caliberURI}/validYears`, {
      httpsAgent: validYearAgent,
    });
  });
});
