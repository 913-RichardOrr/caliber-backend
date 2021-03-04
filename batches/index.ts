import createResponse from '../response';
import { getAllBatchesLambda } from './getAllBatchesLambda';
import { BatchInfo, handler as getBatchesByTrainer } from './getBatchesLambda';
import { getValidYearsLambda } from './getValidYearsLambda';

/**
 * @typedef {Object} queryStringParameters
 * @property {string} trainerEmail
 * @property {string} query
 * @property {string} year
 */

/**
 * @typedef {Object} CombinedEvent - API Gateway proxy event
 * @property {queryStringParameters}  - query parameter as key-value pairs
 */
export interface CombinedEvent {
	queryStringParameters: {
		trainerEmail: string;
		query: string;
		year: string;
	};
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
 * Routes to proper function based on queryStringParameters and returns Response object
 * @param {CombinedEvent} event
 * @returns {Response}
 */
export async function handler(event: CombinedEvent) {
	let batchInfo: BatchInfo[] = [];
	let validYears: string;
	if (event.queryStringParameters.year) {
		let batchInfoResponse = await getAllBatchesLambda(
			event.queryStringParameters.year
		);
		if (batchInfoResponse) {
			batchInfo = batchInfoResponse;
			return createResponse(JSON.stringify(batchInfo), 200);
		} else {
			return createResponse('Not Found', 404);
		}
	} else if (event.queryStringParameters.trainerEmail) {
		let bodyTrainer = await getBatchesByTrainer(event);
		if (bodyTrainer) {
			batchInfo = JSON.parse(bodyTrainer.body);
			let validYearsArray = batchInfo.map((batch) => {
				return new Date(batch.startDate).getFullYear();
			});
			let validYearsSet = new Set(validYearsArray);
			validYears = JSON.stringify(Array.from(validYearsSet));
			return createResponse(
				JSON.stringify({
					validYears: JSON.parse(validYears),
					batches: batchInfo,
				})
			);
		} else {
			return createResponse('Not Found', 404);
		}
	} else if (event.queryStringParameters.query == 'validYears') {
		let validYearsResponse = await getValidYearsLambda();
		if (validYearsResponse) {
			validYears = validYearsResponse.body;
			return createResponse(validYears, 200);
		} else {
			return createResponse('Not Found', 404);
		}
	} else {
		return createResponse('Bad Request', 400);
	}
}
