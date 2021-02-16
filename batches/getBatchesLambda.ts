import axios from 'axios';
import https from 'https';

interface MyEvent {
    path: string;
}

// create handler
export const handler = async (event: MyEvent) => {
    let trainerEmail = event.path.substring(event.path.lastIndexOf('=')+1, event.path.length);
  const batchIDs = await getBatchIDs(trainerEmail);
  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(batchIDs)
  };
};

const agent = new https.Agent({rejectUnauthorized:false,});


async function getBatchIDs(trainerEmail: string): Promise<string[]> {
  const URI = 'https://caliber2-mock.revaturelabs.com:443/mock/training/';
  let reply = await axios.get(`${URI}batch/${trainerEmail}/ids`, {httpsAgent: agent} )
  return reply.data
}
