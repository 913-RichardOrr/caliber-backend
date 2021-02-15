import axios from 'axios';
import https from 'https';

exports.handler = async (batchId: string) => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const res = await axios.get(
      `https://caliber2-mock.revaturelabs.com:443/mock/training/batch/${batchId}`,
      { httpsAgent: agent }
    );
    const batchInfo = {
      id: res.data.id,
      batchId: res.data.batchId,
      name: res.data.name,
      startDate: res.data.startDate,
      endDate: res.data.endDate,
      skills: res.data.skills,
      location: res.data.location,
      type: res.data.type,
    };
    console.log(batchInfo);
    return {
      statusCode: 200,
      body: JSON.stringify(batchInfo),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }
};
