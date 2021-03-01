import axios from 'axios';
import https from 'https';

/**
 * @typedef {Object} queryStringParameters
 * @property {string} trainerEmail
 */

/**
 * @typedef {Object} MyEvent - API Gateway proxy event
 * @property {queryStringParameters}  - query parameter as key-value pairs
 */
export interface MyEvent {
	queryStringParameters: {
		trainerEmail: string;
	};
}

/**
 * @typedef {Object} BatchInfo
 * @property {string} id
 * @property {string} batchId
 * @property {string} name - name of the batch itself
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} skill
 * @property {string} location
 * @property {string} type
 * @property {string} trainerEmail
 * @property {string} trainerFirstName
 * @property {string} trainerLastName
 */
export interface BatchInfo {
	id: string;
	batchId: string;
	name: string;
	startDate: string;
	endDate: string;
	skill: string;
	location: string;
	type: string;
	trainerEmail: string;
	trainerFirstName: string;
	trainerLastName: string;
}
/**
 * @typedef {Object} headers
 * @property {string} AccessControlAllowHeaders
 * @property {string} AccessControlAllowOrigin
 * @property {string} AccessControlAllowMethods
 */
/**
 * @typedef {Object} Response
 * @property {number} statusCode
 * @property {headers} headers
 * @property {string} body
 */

/**
 * Lambda handler function
 * @param {MyEvent} event
 * @returns {Response}
 */
export async function handler(event: MyEvent) {
	const resp = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
		},
		body: '',
	};
	let trainerEmail: string;
	if (event.queryStringParameters.trainerEmail) {
		trainerEmail = event.queryStringParameters.trainerEmail;
	} else {
		resp.statusCode = 400;
		resp.body = 'Bad request.';
		return resp;
	}
	const batchIDs = await getBatchIDs(trainerEmail);
	let batchInfo: BatchInfo[] = [];
	if (batchIDs.data) {
		batchInfo = await getBatchesLambda(batchIDs.data, trainerEmail);
	}
	resp.body = JSON.stringify(batchInfo);
	return resp;
}
/**@type {string} */
const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch/';
/**
 * @typedef {import("https").Agent} Agent
 */
/**
 * @type {Agent}
 */
export const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * Gets all Batch IDs on a specific trainer
 * @param {string} trainerEmail
 * @returns {string[]}
 */
async function getBatchIDs(trainerEmail: string): Promise<any | null> {
	return axios
		.get(`${URI}${trainerEmail}/ids`, { httpsAgent: agent })
		.catch(() => null);
}

/**
 * Gets information for each batch and transforms the data into the BatchInfo object
 * @param {string} batchIDs
 * @param {string} trainerEmail
 * @returns {BatchInfo[]}
 */
export async function getBatchesLambda(
	batchIDs: string[],
	trainerEmail: string
) {
	let batchInfo: BatchInfo[] = [];

	for (let batchID of batchIDs) {
		await axios.get(`${URI}${batchID}`, { httpsAgent: agent }).then((res) => {
			//transform batch info and add to batchInfo array
			const batchData = {
				id: res.data.id,
				batchId: res.data.batchId,
				name: res.data.name,
				startDate: res.data.startDate,
				endDate: res.data.endDate,
				skill: res.data.skill,
				location: res.data.location,
				type: res.data.type,
				trainerEmail: trainerEmail,
				trainerFirstName: '',
				trainerLastName: '',
			};
			batchInfo.push(batchData);
		});
	}
	return batchInfo;
}
