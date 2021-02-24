import axios from "axios";
import https from "https";

export interface MyEvent {
  queryStringParameters: {
    trainerEmail: string;
  };
}

export interface BatchInfo {
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
  const resp = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: "",
  };
  let trainerEmail: string;
  if (event.queryStringParameters.trainerEmail) {
    trainerEmail = event.queryStringParameters.trainerEmail;
  } else {
    resp.statusCode = 400;
    resp.body = "Bad request.";
    return resp;
  }
  const batchIDs = await getBatchIDs(trainerEmail);
  let batchInfo: BatchInfo[] = [];
  if (batchIDs.data) {
    batchInfo = await getBatchesLambda(batchIDs.data);
  }
  resp.body = JSON.stringify(batchInfo);
  return resp;
};

const URI = "https://caliber2-mock.revaturelabs.com:443/mock/training/batch/";
export const agent = new https.Agent({ rejectUnauthorized: false });

async function getBatchIDs(trainerEmail: string): Promise<any | null> {
  return axios
    .get(`${URI}${trainerEmail}/ids`, { httpsAgent: agent })
    .catch(() => null);
}

export async function getBatchesLambda(batchIDs: string[]) {
  let batchInfo: BatchInfo[] = [];

  for (let batchID of batchIDs) {
    await axios.get(`${URI}${batchID}`, { httpsAgent: agent }).then((res) => {
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
      batchInfo.push(batchData);
    });
  }
  return batchInfo;
}
