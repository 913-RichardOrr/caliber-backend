import axios from 'axios';
import https from 'https';

interface MyEvent {
    path: string;
}

interface BatchInfo {
	id: string;
	batchId: string;
	name: string;
	startDate: string;
	endDate: string;
	skill: string;
	location: string;
	type: string;
}

export const handler = async (event: MyEvent) => {
  let trainerEmail = event.path.substring(event.path.lastIndexOf('=')+1, event.path.length);
  const batchIDs = await getBatchIDs(trainerEmail);
	let batchInfo: BatchInfo[] = [];
	if(batchIDs.data){
  batchInfo = await getBatchesLambda(batchIDs)
	}
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

async function getBatchesLambda(batchIDs:string[]) {
	let caliberURI: string =
		'https://caliber2-mock.revaturelabs.com:443/mock/training/batch';

	let batchInfo: BatchInfo[] = [];

	for (let batchID of batchIDs) {
		await axios.get(`${caliberURI}/${batchID}`, {httpsAgent: agent}).then((res) => {
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
      };
      batchInfo.push(batchData)
		});
  }
  return batchInfo
}
const agent = new https.Agent({rejectUnauthorized:false,});

async function getBatchIDs(trainerEmail: string): Promise<any | null> {
  const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/';
  let reply = await axios.get(`${URI}batch/${trainerEmail}/ids`, {httpsAgent: agent} ).catch(() => null)
  return reply
}
