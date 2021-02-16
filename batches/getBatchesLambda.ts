import axios from 'axios';
import https from 'https';

interface MyEvent {
    path: string;
}

export const handler = async (event: MyEvent) => {
  let trainerEmail = event.path.substring(event.path.lastIndexOf('=')+1, event.path.length);
  const batchIDs = await getBatchIDs(trainerEmail);
  const batchInfo = await getBatchesLambda(batchIDs);
  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(batchInfo)
  };
};

export function getBatchesLambda(batchIDs) {
	let caliberURI: string =
		'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

	let batchInfo = [];

	for (let batchID of batchIDs) {
		axios.get(`${caliberURI}/${batchID}`).then(() => {
			//transform batch info and add to batchInfo array
		});
	}

const agent = new https.Agent({rejectUnauthorized:false,});

async function getBatchIDs(trainerEmail: string): Promise<string[]> {
  const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/';
  let reply = await axios.get(`${URI}batch/${trainerEmail}/ids`, {httpsAgent: agent} )
  return reply.data
}
