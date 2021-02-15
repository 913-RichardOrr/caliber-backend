const axios = require('axios');
const https = require('https');
exports.handler = async (event: any) => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const res = await axios.get(
      `https://caliber2-mock.revaturelabs.com:443/mock/training/batch/${event.batchId}`,
      { httpsAgent: agent }
    );
    const batchInfo = {
      id: res.data.id,
      batchId: res.data.batchId,
      name: res.data.name,
      startDate: res.data.startDate,
      endDate: res.data.endDate,
      skill: res.data.skill,
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
