//welcome we are testing the batches endpoint.

import axios from 'axios';
import allBatchesHandler, {
  allBatchesAgent,
} from '../batches/getAllBatchesLambda';

jest.mock('axios');

describe('Batches Test Suite', () => {
  let caliberURI: string =
    'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

  test('Get All Batches Lambda axios requests', async () => {
    class BatchProjectionWTrainer {
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
    const batch1 = new BatchProjectionWTrainer(
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
    const batch2 = new BatchProjectionWTrainer(
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
    const batch3 = new BatchProjectionWTrainer(
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
    });
  });
});
