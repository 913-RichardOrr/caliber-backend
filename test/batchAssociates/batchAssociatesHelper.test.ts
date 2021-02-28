//Tests for batch associates helper

import axios from 'axios';
import * as batchAssociatesHelper from '../../batchAssociatesLambda/batchAssociatesHelper';

const URI: string = 'https://caliber2-mock.revaturelabs.com:443/mock/training';
let testPath = 'blablabla/batches/YYMM-mmmDD-Stuff';

afterEach(() => {
  jest.clearAllMocks();
});

test('That axios is called with correct path parameters', async () => {
  axios.get = jest.fn().mockResolvedValueOnce({"data": "some data"});

  const res = await batchAssociatesHelper.getAssociates(testPath);

  expect(res).toEqual("some data");
  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenLastCalledWith(URI + '/batch/YYMM-mmmDD-Stuff', { withCredentials: true });
});

test('That we can handle receiving no data (and no error) from axios', async () => {
  axios.get = jest.fn().mockResolvedValueOnce({"data": []});

  const res = await batchAssociatesHelper.getAssociates(testPath);

  expect(res).toEqual([]);
});

test('That we can handle receiving an error from axios', async () => {
  axios.get = jest.fn().mockRejectedValueOnce('If you see this error, the test is functioning correctly');

  const res = await batchAssociatesHelper.getAssociates(testPath);

  expect(res).toBe(null);
});