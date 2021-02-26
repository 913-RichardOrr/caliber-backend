import axios from 'axios';
import https from 'https';
import { BatchInfo } from './getBatchesLambda';

export default async function handler() {
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

export async function getAllBatchesLambda(
  year?: string
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
          let trainer: string;
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
