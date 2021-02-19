//welcome we are testing the batches endpoint.

import axios from 'axios';
import { handler, MyEvent, agent } from '../batches/getBatchesLambda';
import allBatchesHandler from '../batches/getAllBatchesLambda';

interface AllBatchesEvent {
	queryStringParameters: {
		year: number;
		quarter: number;
	};
}

/**
 * getBatchesLambda takes in a trainer ID (there is no trainer ID, only trainer email) and returns a list of batchIDs from the caliber mock api
 * @param event
 */

jest.mock('axios');

describe('Batches Test Suite', () => {
	let trainerEmail: string =
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
		'TR-1131',
		'Mock Batch 100',
		'2019-01-01',
		'2019-04-01',
		'React',
		'New York',
		'Revature'
	);
	const batch2 = new BatchProjection(
		'TR-1112',
		'Mock Batch 2',
		'2021-06-07',
		'2021-08-06',
		'COBOL',
		'Tampa',
		'Revature'
	);
	const batch3 = new BatchProjection(
		'TR-1111',
		'Mock Batch 3',
		'2021-05-01',
		'2021-08-01',
		'Java',
		'West Virginia',
		'Corporate'
	);
	const batches = [batch1, batch2, batch3];

	test('Get Batches By Trainer Lambda axios requests', async () => {
		const batchIDs = ['TR-1111', 'TR-1112', 'TR-1113'];
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
				trainerEmail: trainerEmail,
			},
		};
		await handler(myEvent).then((data: any) => (returnValues = data));
		// test to make sure that the axios requests have been called the number of batches plus one
		expect(axios.get).toHaveBeenCalledTimes(batches.length + 1);

		// test to make sure that response is equal to resp
		expect(JSON.parse(returnValues.body)).toEqual(resp.data);
		// test to make sure that all of the requests are called with the caliber api

		expect(axios.get).toHaveBeenCalledWith(
			`${caliberURI}/${trainerEmail}/ids`,
			{ httpsAgent: agent }
		);
		for (let batchID of batchIDs) {
			expect(axios.get).toHaveBeenCalledWith(`${caliberURI}/${batchID}`, {
				httpsAgent: agent,
			});
		}
	});
	test('Get All Batches Lambda axios requests', async () => {
		const resp = { data: batches };
		let returnValues: any = [];
		//mock axios request to the caliber api to get all batches
		axios.get = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({ data: batches });
		});

		let allBatchesEvent: AllBatchesEvent = {
			queryStringParameters: {
				year: 2021,
				quarter: 1,
			},
		};
		await allBatchesHandler(allBatchesEvent).then(
			(data: any) => (returnValues = data)
		);
		// test to make sure that the axios requests have been called the number of batches plus one
		expect(axios.get).toHaveBeenCalledTimes(1);

		// test to make sure that response is equal to resp
		expect(JSON.parse(returnValues.body)).toEqual(resp.data);
		// test to make sure that all of the requests are called with the caliber api

		expect(axios.get).toHaveBeenCalledWith(`${caliberURI}?year=2021`, {
			httpsAgent: agent,
		});
	});
});
