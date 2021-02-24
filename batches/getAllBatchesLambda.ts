import axios from 'axios';
import https from 'https';

export interface AllBatchesEvent {
	queryStringParameters: {
		year: number;
		quarter: number;
	};
}

export interface AllBatchInfo {
	id: string;
	batchId: string;
	name: string;
	startDate: string;
	endDate: string;
	skill: string;
	location: string;
	type: string;
	trainer: string;
}

export default async function handler(event: AllBatchesEvent) {
	const resp = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
		},
		body: '',
	};

	
	const batchInfo = await getAllBatchesLambda();

	if (batchInfo) {
		resp.body = JSON.stringify(batchInfo);
	}
	return resp;
}

const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';
export const allBatchesAgent = new https.Agent({ rejectUnauthorized: false });

export async function getAllBatchesLambda(): Promise<AllBatchInfo[] | null> {
	let batchInfo: AllBatchInfo[] = [];
	await axios
		.get(`${URI}`, {
			httpsAgent: allBatchesAgent,
		})
		.then((res) => {
			if (res.data) {
				batchInfo = res.data.map((batch: any) => {
					let batchData = {
						id: batch.id,
						batchId: batch.batchId,
						name: batch.name,
						startDate: batch.startDate,
						endDate: batch.endDate,
						skill: batch.skill,
						location: batch.location,
						type: batch.type,
						trainer: '',
					};
					let trainer: string;
					if (
						batch.employeeAssignments &&
						batch.employeeAssignments[0].role === 'ROLE_LEAD_TRAINER'
					) {
						trainer = `${batch.employeeAssignments[0].employee.firstName} ${batch.employeeAssignments[0].employee.lastName}`;
						batchData.trainer = trainer;
					}
					return batchData;
				});
			}
		});
	return batchInfo;
}
