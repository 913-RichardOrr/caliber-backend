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
<<<<<<< HEAD
					/**
					 * @type {BatchInfo}
					 */
					let batchData: BatchInfo = {
=======
					let batchData = {
>>>>>>> dev
						id: batch.id,
						batchId: batch.batchId,
						name: batch.name,
						startDate: batch.startDate,
						endDate: batch.endDate,
						skill: batch.skill,
						location: batch.location,
						type: batch.type,
<<<<<<< HEAD
						trainerEmail: '',
						trainerFirstName: '',
						trainerLastName: '',
					};
=======
						trainer: '',
					};
					let trainer: string;
>>>>>>> dev
					if (
						batch.employeeAssignments &&
						batch.employeeAssignments[0].role === 'ROLE_LEAD_TRAINER'
					) {
<<<<<<< HEAD
						batchData.trainerEmail =
							batch.employeeAssignments[0].employee.email;
						batchData.trainerFirstName =
							batch.employeeAssignments[0].employee.firstName;
						batchData.trainerLastName =
							batch.employeeAssignments[0].employee.lastName;
=======
						trainer = `${batch.employeeAssignments[0].employee.firstName} ${batch.employeeAssignments[0].employee.lastName}`;
						batchData.trainer = trainer;
>>>>>>> dev
					}
					return batchData;
				});
			}
		});
	return batchInfo;
}
