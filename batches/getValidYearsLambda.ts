import axios from 'axios';
import https from 'https';

/**@type {string} */
const URI =
	'https://caliber2-mock.revaturelabs.com:443/mock/training/batch/validYears';
/**
 * @typedef {import("https").Agent} Agent
 */
/**
 * @type {Agent}
 */
export const validYearAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * @typedef {Object} Response
 * @property {number} statusCode
 * @property {string} body
 */

/**
 * @returns {Response}
 */
export async function getValidYearsLambda() {
	try {
		const res = await axios.get(`${URI}`, { httpsAgent: validYearAgent });
		return {
			statusCode: 200,
			body: JSON.stringify(res.data),
		};
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify(e),
		};
	}
}
