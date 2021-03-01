import axios from 'axios';
import https from 'https';
import { BatchInfo } from './getBatchesLambda';

/**
 * @type {string}
 */
const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

/**
 * @typedef {import("https").Agent} Agent
 */
/**
 * @type {Agent}
 */
export const allBatchesAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * Gets all the Batches for a specific year
 * @param year {string}
 */
export async function getAllBatchesLambda(
	year: string
): Promise<BatchInfo[] | null> {
	let batchInfo: BatchInfo[] = [];
	await axios
		.get(`${URI}`, {
			httpsAgent: allBatchesAgent,
			params: year ? { year: year } : '',
		})
		.then((res) => {
			if (res.data) {
				batchInfo = res.data.map((batch: any) => {
					/**
					 * @type {BatchInfo}
					 */
					let batchData: BatchInfo = {
						id: batch.id,
						batchId: batch.batchId,
						name: batch.name,
						startDate: batch.startDate,
						endDate: batch.endDate,
						skill: batch.skill,
						location: batch.location,
						type: batch.type,
						trainerEmail: '',
						trainerFirstName: '',
						trainerLastName: '',
					};
					if (
						batch.employeeAssignments &&
						batch.employeeAssignments[0].role === 'ROLE_LEAD_TRAINER'
					) {
						batchData.trainerEmail =
							batch.employeeAssignments[0].employee.email;
						batchData.trainerFirstName =
							batch.employeeAssignments[0].employee.firstName;
						batchData.trainerLastName =
							batch.employeeAssignments[0].employee.lastName;
					}
					return batchData;
				});
			}
		});
	return batchInfo;
}
