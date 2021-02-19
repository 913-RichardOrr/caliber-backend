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

	let year: number;
	let quarter: number;

	if (event.queryStringParameters.year) {
		year = event.queryStringParameters.year;
	} else {
		resp.statusCode = 400;
		resp.body = 'Bad request.';
		return resp;
	}

	if (event.queryStringParameters.quarter) {
		quarter = event.queryStringParameters.quarter;
	} else {
		resp.statusCode = 400;
		resp.body = 'Bad request.';
		return resp;
	}

	const batchInfo = await getAllBatchesLambda(year, quarter);

	if (batchInfo) {
		resp.body = JSON.stringify(batchInfo);
	}
	return resp;
}

const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';
export const allBatchesAgent = new https.Agent({ rejectUnauthorized: false });

export async function getAllBatchesLambda(
	year: number,
	quarter: number
): Promise<any | null> {
	let batchInfo: AllBatchInfo[] = [];
	await axios
		.get(`${URI}?year=${year}&quarter=${quarter}`, {
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
