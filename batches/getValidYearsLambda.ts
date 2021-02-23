import axios from 'axios';
import https from 'https';

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

  const years = await getValidYearsLambda();

  if (years) {
    resp.body = JSON.stringify(years);
  }
  return resp;
}

const URI =
  'https://caliber2-mock.revaturelabs.com:443/mock/training/batch/validYears';
export const validYearAgent = new https.Agent({ rejectUnauthorized: false });

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
