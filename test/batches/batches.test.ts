//welcome we are testing the batches endpoint.

//imports
import axios from 'axios';


describe('Batches Test Suite', () => {
  test('GET Batches', async () => {
    //test goes here
    
    let trainerEmail = 'mock1027.employee74df14df-5842-4811-a57c-be9836537a40@mock.com'
    let returnValues;
    let obj = {data: []};
    axios.get = jest.fn().mockResolvedValue(obj);
    await getBatches()
  });
});

// the next lines will go into the actual function, not the test
/**
 * getBatches takes in a trainer ID (there is no trainer ID, only trainer email) and returns a list of batchIDs from the caliber mock api
 * @param event
 */
//there will be an axios request to the caliber api endpoint batch/trainer/{traineremail}
 


// With the getRestaurants method there are two things we can test.
// The first thing is that axios.get is actually called. If it isn't called the rest of the test isn't going to pass.
// The second thing is that the data object is what is returned from the function.
// We can also check the paramaters of the get function as a third thing (testing the environment variables are correct?)
test('getRestaurants returns a promise with data in it.', async ()=>{
    let returnValues;
    
    let obj = {data: []};
    axios.get = jest.fn().mockResolvedValue(obj);
    await restaurantService.getRestaurants().then((arr) => {
        returnValues = arr;
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(returnValues).toBe(obj.data);
    expect(axios.get).toHaveBeenCalledWith('https://k8n63gmyw8.execute-api.us-west-2.amazonaws.com/default/restaurants');
})