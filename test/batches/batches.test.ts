//welcome we are testing the batches endpoint.

//imports
import axios from "axios";
// according to the docs, you have to mock axios:  https://jestjs.io/docs/en/mock-functions
jest.mock("axios");

describe("Batches Test Suite", () => {
  test("GET Batches", async () => {
    //test goes here

    let trainerEmail =
      "mock1027.employee74df14df-5842-4811-a57c-be9836537a40@mock.com";
    //let returnValues;
    //let obj = {data: []};
    //axios.get = jest.fn().mockResolvedValue(obj);
    //await getBatches(trainerEmail)

    const batchIDs = ["TR-1111", "TR-1112", "TR-1113"];
    // the response will be a list of a projection of batch objects
    class BatchProjection {
      constructor(
        public batchId: string, //"TR-1131",
        public name: string, //"Mock Batch 65",
        public startDate: string, //"2021-04-09",
        public endDate: string, //"2021-06-18",
        public skill: string, // "Java React",
        public location: string, // "New York",
        public type: string // "Revature"
      ) {
        this.batchId = batchId;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.skill = skill;
        this.location = location;
        this.type = type;
      }
    }
    const batch1 = new BatchProjection(
      "TR-1131",
      "Mock Batch 100",
      "2019-01-01",
      "2019-04-01",
      "React",
      "New York",
      "Revature"
    );
    const batch2 = new BatchProjection(
      "TR-1112",
      "Mock Batch 2",
      "2021-06-07",
      "2021-08-06",
      "COBOL",
      "Tampa",
      "Revature"
    );
    const batch3 = new BatchProjection(
      "TR-1111",
      "Mock Batch 3",
      "2021-05-01",
      "2021-08-01",
      "Java",
      "West Virginia",
      "Corporate"
    );
    const resp = { data: [batch1, batch2, batch3] };

    axios.get.mockResolvedValue(resp);

    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))

    return Users.all().then(data => expect(data).toEqual(users));
  });
});

/*
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
}); 
*/

// the next lines will go into the actual function, not the test
/**
 * getBatches takes in a trainer ID (there is no trainer ID, only trainer email) and returns a list of batchIDs from the caliber mock api
 * @param event
 */
//pseudocode
/**
 * 1. axios.get(/batch/{trainerEmail}/ids)
 * 2. Get response of batchID array
 * 3. axios.get(/batch/{batchId}) for each id
 *    -in .then of request take response and transform it into managable data object and
 *  add to an array to be sent in handler of the Lambda function
 */
